// =========================================
// VIVAFIT BACKEND — AI PLANNER + EXERCISE REPLACEMENT
// =========================================
// Start with:
// node server.js
//
// Then open:
// http://localhost:3000/planner.html
// =========================================

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// =========================================
// LOAD .ENV
// =========================================

{
    const envCandidates = [
        path.join(__dirname, ".env"),
        path.join(__dirname, "backend", ".env")
    ];

    const envPath = envCandidates.find((p) => fs.existsSync(p));

    require("dotenv").config({
        path: envPath || envCandidates[0]
    });
}

// =========================================
// APP SETTINGS
// =========================================

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// =========================================
// GEMINI MODELS
// =========================================

const MODEL_FALLBACKS = [
    process.env.GEMINI_MODEL,
    "gemini-flash-latest",
    "gemini-3.7-flash",
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest"
].filter(Boolean);

const MODELS_TO_TRY = [...new Set(MODEL_FALLBACKS)];

// =========================================
// CACHE
// =========================================

const responseCache = new Map();
const CACHE_MAX = 200;

const planCache = new Map();
const PLAN_CACHE_MAX = 200;
const PLAN_CACHE_AI_TTL_MS = 30 * 60 * 1000;
const PLAN_CACHE_FALLBACK_TTL_MS = 3 * 60 * 1000;
const AI_PLAN_TIMEOUT_MS = 12000;

function withTimeout(promise, ms) {
    let timer = null;
    const timeout = new Promise(function (_, reject) {
        timer = setTimeout(function () {
            reject(new Error("Request timed out after " + ms + "ms"));
        }, ms);
    });
    return Promise.race([promise, timeout]).then(
        function (value) { clearTimeout(timer); return value; },
        function (err) { clearTimeout(timer); throw err; }
    );
}

function cleanWorkoutsFor(body) {
    const list = (body && Array.isArray(body.availableWorkouts)) ? body.availableWorkouts : [];
    return list
        .filter(function (workout) {
            return workout && workout.id && workout.name;
        })
        .map(function (workout) {
            return {
                id: String(workout.id),
                name: String(workout.name),
                category: String(workout.category || ""),
                duration: String(workout.duration || ""),
                difficulty: String(workout.difficulty || ""),
                description: String(workout.description || ""),
                exercises: Array.isArray(workout.exercises)
                    ? workout.exercises
                        .slice(0, 10)
                        .map(function (exercise) {
                            return String(exercise.name || "");
                        })
                        .filter(Boolean)
                    : []
            };
        });
}

function planCacheKeyFor(body, cleanWorkouts) {
    const muscles = (body && Array.isArray(body.selectedMuscles)) ? body.selectedMuscles : [];
    return JSON.stringify([
        (body && body.goal) || "stay-fit",
        (body && body.level) || "beginner",
        (body && body.experience) || "beginner",
        Number(body && body.days) || 3,
        (body && body.equipment) || "full-gym",
        Number(body && body.duration) || 45,
        [...muscles].sort(),
        cleanWorkouts.map(function (workout) {
            return [workout.id, workout.name]
                .concat(workout.exercises || []);
        })
    ]);
}

const SEED_CACHE_FILE = path.join(__dirname, "ai-seed-cache.json");

function loadSeedCache() {
    try {
        if (!fs.existsSync(SEED_CACHE_FILE)) {
            return 0;
        }

        const seed = JSON.parse(
            fs.readFileSync(SEED_CACHE_FILE, "utf8")
        );

        let loaded = 0;

        for (const [key, value] of Object.entries(seed)) {
            if (
                value &&
                value.alternatives &&
                value.alternatives.length
            ) {
                responseCache.set(key.toLowerCase(), value);
                loaded++;
            }
        }

        return loaded;

    } catch (e) {
        console.error("[seed cache] failed to load:", e.message);
        return 0;
    }
}

// =========================================
// EXPRESS
// =========================================

app.use(cors());

app.use(
    express.json({
        limit: "256kb"
    })
);

// Serve frontend from the parent folder
app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

// =========================================
// HEALTH CHECK
// =========================================

app.get("/api/health", (req, res) => {

    const keyConfigured =
        !!GEMINI_API_KEY &&
        !GEMINI_API_KEY.startsWith("PUT_");

    res.json({
        ok: true,
        ai: keyConfigured,
        model: keyConfigured
            ? MODELS_TO_TRY[0]
            : null,
        cache: responseCache.size
    });
});

// =========================================
// AI EXERCISE REPLACEMENT
// =========================================

app.post("/api/replace-exercise", async (req, res) => {

    try {

        const exerciseName =
            (req.body && req.body.exerciseName) || "";

        const userEquipment =
            (req.body && req.body.userEquipment) ||
            "full-gym";

        const userLevel =
            (req.body && req.body.userLevel) ||
            "intermediate";

        if (!exerciseName) {

            return res.status(400).json({
                error: "BAD_REQUEST",
                message: "exerciseName is required"
            });

        }

        if (
            !GEMINI_API_KEY ||
            GEMINI_API_KEY.startsWith("PUT_")
        ) {

            return res.status(503).json({
                error: "NO_API_KEY",
                message: "Gemini API key is not configured."
            });

        }

        const cacheKey =
            cacheKeyFor(
                exerciseName,
                userEquipment,
                userLevel
            );

        if (responseCache.has(cacheKey)) {

            return res.json({
                suggestions:
                    responseCache.get(cacheKey),
                cached: true
            });

        }

        // Fast path: the exact key is missing, but the same
        // exercise exists in the bundled cache under another
        // equipment/level — serve it instantly instead of
        // waiting on Gemini.
        const nearKey =
            nearestCachedKey(
                exerciseName,
                userEquipment,
                userLevel
            );

        if (nearKey) {

            console.log(
                "[replace-exercise] nearest cached hit:",
                nearKey,
                "for",
                cacheKey
            );

            return res.json({
                suggestions:
                    responseCache.get(nearKey),
                cached: true
            });

        }

        const prompt =
            buildReplacementPrompt(
                exerciseName,
                userEquipment,
                userLevel
            );

        const text =
            await withTimeout(
                generateContent(prompt),
                10000
            );

        let parsed;

        try {

            parsed =
                parseJsonResponse(text);

        } catch (err) {

            console.error(
                "[Gemini parse error]",
                text
            );

            return res.status(502).json({
                error: "PARSE_ERROR",
                message:
                    "Could not parse Gemini response"
            });

        }

        responseCache.set(
            cacheKey,
            parsed
        );

        if (responseCache.size > CACHE_MAX) {

            responseCache.delete(
                responseCache.keys().next().value
            );

        }

        res.json({
            suggestions: parsed,
            cached: false
        });

    } catch (err) {

        console.error(
            "[/api/replace-exercise]",
            err.message || err
        );

        res.status(502).json({
            error: err.isQuota
                ? "QUOTA_EXHAUSTED"
                : "GEMINI_ERROR",

            message:
                err.message ||
                "Gemini API error"
        });
    }
});

// =========================================
// AI WORKOUT PLANNER
// =========================================

app.post("/api/generate-plan", async (req, res) => {

    try {

        const body = req.body || {};

        const goal = body.goal || "stay-fit";
        const level = body.level || "beginner";
        const experience =
            body.experience || "beginner";

        const days = Number(body.days) || 3;

        const equipment =
            body.equipment || "full-gym";

        const duration =
            Number(body.duration) || 45;

        const selectedMuscles =
            Array.isArray(body.selectedMuscles)
                ? body.selectedMuscles
                : [];

        const availableWorkouts =
            Array.isArray(body.availableWorkouts)
                ? body.availableWorkouts
                : [];

        // -----------------------------------------
        // BASIC VALIDATION
        // -----------------------------------------

        if (days < 2 || days > 6) {

            return res.status(400).json({
                error: "BAD_REQUEST",
                message:
                    "days must be between 2 and 6"
            });

        }

        if (availableWorkouts.length === 0) {

            return res.status(400).json({
                error: "BAD_REQUEST",
                message:
                    "No available workouts were provided"
            });

        }

        if (
            !GEMINI_API_KEY ||
            GEMINI_API_KEY.startsWith("PUT_")
        ) {

            return res.status(503).json({
                error: "NO_API_KEY",
                message:
                    "Gemini API key is not configured."
            });

        }

        // -----------------------------------------
        // CLEAN WORKOUT LIST
        // -----------------------------------------

        const cleanWorkouts =
            cleanWorkoutsFor(body);

        if (cleanWorkouts.length === 0) {

            return res.status(400).json({
                error: "BAD_REQUEST",
                message:
                    "Available workouts are invalid"
            });

        }

        // -----------------------------------------
        // PLAN CACHE
        // -----------------------------------------

        const planCacheKey =
            planCacheKeyFor(body, cleanWorkouts);

        if (planCache.has(planCacheKey)) {

const cachedPlan =
            planCache.get(planCacheKey);

        const cachedIsStale =
            cachedPlan
                ? (
                    Date.now() - cachedPlan.ts >
                    (cachedPlan.fallback
                        ? PLAN_CACHE_FALLBACK_TTL_MS
                        : PLAN_CACHE_AI_TTL_MS)
                )
                : true;

        if (!cachedIsStale) {

            console.log(
                "[AI Planner] Returning cached plan.",
                cachedPlan.fallback ? "(fallback)" : ""
            );

            return res.json({
                days: cachedPlan.days,
                fallback: cachedPlan.fallback,
                cached: true
            });

        }

        }

        // -----------------------------------------
        // AI PROMPT
        // -----------------------------------------

        const prompt =
            buildPlannerPrompt({
                goal,
                level,
                experience,
                days,
                equipment,
                duration,
                selectedMuscles,
                availableWorkouts:
                    cleanWorkouts
            });

console.log(
        "[AI Planner] Generating plan..."
    );

    const text =
        await withTimeout(
            generateContent(
                prompt,
                {
                    maxOutputTokens: 4096,
                    temperature: 0.5
                }
            ),
            AI_PLAN_TIMEOUT_MS
        );

        let parsed;

        try {

            parsed =
                parseJsonResponse(text);

        } catch (err) {

            console.error(
                "[AI Planner parse error]",
                text
            );

            return res.status(502).json({
                error: "PLANNER_PARSE_ERROR",
                message:
                    "Could not parse AI planner response"
            });

        }

        // -----------------------------------------
        // VALIDATE AI PLAN
        // -----------------------------------------

        const validation =
            validateGeneratedPlan(
                parsed,
                days,
                cleanWorkouts
            );

if (!validation.valid) {

            console.error(
                "[AI Planner validation]",
                validation.message,
                JSON.stringify(parsed).slice(0, 1000)
            );

            // Try a safe local fallback
            const fallback =
                buildFallbackPlan(
                    days,
                    cleanWorkouts
                );

            if (fallback) {

                console.log(
                    "[AI Planner] Using fallback plan."
                );

                planCache.set(planCacheKey, {
                    days: fallback.days,
                    fallback: true,
                    ts: Date.now()
                });

                return res.json({
                    days: fallback.days,
                    fallback: true
                });

            }

            return res.status(502).json({
                error: "INVALID_PLAN",
                message:
                    validation.message
            });
        }

        // -----------------------------------------
        // SUCCESS
        // -----------------------------------------

        planCache.set(planCacheKey, {
            days: parsed.days,
            fallback: false,
            ts: Date.now()
        });

        if (planCache.size > PLAN_CACHE_MAX) {

            planCache.delete(
                planCache.keys().next().value
            );

        }

        return res.json({
            days: parsed.days,
            fallback: false
        });

    } catch (err) {

        console.error(
            "[/api/generate-plan]",
            err.message || err
        );

        const fbBody = req.body || {};
        const fbWorkouts = cleanWorkoutsFor(fbBody);
        const fbKey = planCacheKeyFor(fbBody, fbWorkouts);
        const fbDays = Number(fbBody.days) || 3;

        const fallbackPlan =
            buildFallbackPlan(
                fbDays,
                fbWorkouts
            );

        if (fallbackPlan) {

            console.log(
                "[AI Planner] AI failed - returning fallback plan:",
                err.isQuota ? "quota" : (err.message || err)
            );

            planCache.set(fbKey, {
                days: fallbackPlan.days,
                fallback: true,
                ts: Date.now()
            });

            return res.json({
                days: fallbackPlan.days,
                fallback: true
            });

        }

        res.status(502).json({
            error: err.isQuota
                ? "QUOTA_EXHAUSTED"
                : "GEMINI_ERROR",

            message:
                err.message ||
                "Could not generate workout plan"
        });
    }
});

// =========================================
// BUILD PLANNER PROMPT
// =========================================

function buildPlannerPrompt(options) {

    const {
        goal,
        level,
        experience,
        days,
        equipment,
        duration,
        selectedMuscles,
        availableWorkouts
    } = options;

    const workoutText =
        availableWorkouts
            .map(function (workout) {

                return [
                    "ID: " + workout.id,
                    "Name: " + workout.name,
                    "Category: " + workout.category,
                    "Duration: " + workout.duration,
                    "Difficulty: " + workout.difficulty,
                    "Description: " + workout.description,
                    "Exercises: " +
                        workout.exercises.join(", ")
                ].join("\n");

            })
            .join("\n\n");

    return [
        "You are an AI workout planner for the VIVAFIT website.",
        "",
        "Your job is ONLY to create a weekly schedule using the existing workouts provided below.",
        "",
        "USER PREFERENCES:",
        "Goal: " + goal,
        "Fitness level: " + level,
        "Experience: " + experience,
        "Workout days requested: " + days,
        "Available equipment: " + equipment,
        "Preferred workout duration: " + duration + " minutes",
        "Target muscles: " +
            (
                selectedMuscles.length
                    ? selectedMuscles.join(", ")
                    : "No specific muscle selected"
            ),
        "",
        "AVAILABLE WORKOUTS:",
        workoutText,
        "",
        "VERY IMPORTANT RULES:",
        "1. You MUST choose workouts ONLY from the AVAILABLE WORKOUTS list.",
        "2. NEVER invent a workout.",
        "3. NEVER create a new workout ID.",
        "4. NEVER change a workout ID.",
        "5. Use the exact workout ID provided.",
        "6. The plan must contain exactly " + days + " workout days.",
        "7. The weekly schedule has Monday through Sunday.",
        "8. Any days not used for workouts must be rest days.",
        "9. Do not assign the same workout ID more than once unless absolutely necessary.",
        "10. Match the user's goal, level, duration, equipment and selected muscles as closely as possible.",
        "11. DISTRIBUTE the workout days evenly across the week and NEVER put two workout days back to back when possible (example for 3 days: Monday, Wednesday, Friday).",
        "12. For every workout day, choose the exercises for that day ONLY from that workout's exercise list shown above.",
        "13. NEVER invent or rename an exercise.",
        "14. For each chosen exercise, decide a personalized number of sets, reps and rest based on the user's goal, level and workout duration.",
        "15. Return ONLY valid JSON.",
        "",
        "Keep the response as short as possible.",
        "",
        "The response MUST have exactly this structure:",
        '{',
        '  "days": [',
        '    { "day": "Monday", "workoutId": "existing-id", "exercises": [ { "name": "real exercise name", "sets": 4, "reps": "8", "rest": "90s" } ] },',
        '    { "day": "Tuesday", "rest": true },',
        '    { "day": "Wednesday", "workoutId": "existing-id", "exercises": [ { "name": "real exercise name", "sets": 3, "reps": "10", "rest": "60s" } ] },',
        '    { "day": "Thursday", "rest": true },',
        '    { "day": "Friday", "workoutId": "existing-id", "exercises": [ { "name": "real exercise name", "sets": 4, "reps": "12", "rest": "45s" } ] },',
        '    { "day": "Saturday", "rest": true },',
        '    { "day": "Sunday", "rest": true }',
        '  ]',
        '}',
        "",
        "Rules for the exercises field:",
        "- Every workout day MUST include an exercises array with at least one exercise.",
        "- Sets must be a NUMBER between 2 and 5.",
        "- Reps and rest must be short strings like \"10\" and \"60s\".",
        "- You may include a subset of the workout's real exercises, but NEVER any exercise that is not in that workout's exercise list.",
        "",
        "The days array MUST always contain exactly 7 days, one for each day of the week.",
        "Exactly " + days + " of those days must contain workoutId.",
        "All remaining days must contain rest: true."
    ].join("\n");
}

// =========================================
// VALIDATE GENERATED PLAN
// =========================================

function validateGeneratedPlan(
    plan,
    requestedDays,
    availableWorkouts
) {

    if (
        !plan ||
        !Array.isArray(plan.days)
    ) {

        return {
            valid: false,
            message:
                "AI response does not contain a days array"
        };

    }

    if (plan.days.length !== 7) {

        return {
            valid: false,
            message:
                "AI plan must contain exactly 7 days"
        };

    }

    const allowedIds =
        new Set(
            availableWorkouts.map(function (workout) {
                return workout.id;
            })
        );

    const allowedExerciseNames =
        new Map(
            availableWorkouts.map(function (workout) {
                return [
                    workout.id,
                    new Set(
                        (workout.exercises || []).map(function (name) {
                            return String(name).trim().toLowerCase();
                        })
                    )
                ];
            })
        );

    const expectedDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    let workoutCount = 0;
    const usedIds = new Set();

    for (let i = 0; i < 7; i++) {

        const day = plan.days[i];

        if (!day || day.day !== expectedDays[i]) {

            return {
                valid: false,
                message:
                    "Invalid day order in AI response"
            };

        }

        if (day.workoutId) {

            const id =
                String(day.workoutId);

            if (!allowedIds.has(id)) {

                return {
                    valid: false,
                    message:
                        "AI returned an invalid workout ID: " +
                        id
                };

            }

            workoutCount++;

            if (usedIds.has(id)) {

                return {
                    valid: false,
                    message:
                        "AI repeated workout ID: " +
                        id
                };

            }

            usedIds.add(id);

            const nameSet =
                allowedExerciseNames.get(id);

            if (
                !Array.isArray(day.exercises) ||
                day.exercises.length === 0
            ) {

                return {
                    valid: false,
                    message:
                        "AI must include exercises for workout day: " +
                        id
                };

            }

            for (let e = 0; e < day.exercises.length; e++) {

                const ex = day.exercises[e];

                if (
                    !ex ||
                    typeof ex.name !== "string" ||
                    ex.name.trim() === ""
                ) {

                    return {
                        valid: false,
                        message:
                            "An exercise is missing a name on day: " +
                            id
                    };

                }

                const exName =
                    ex.name.trim().toLowerCase();

                if (!nameSet.has(exName)) {

                    return {
                        valid: false,
                        message:
                            "AI invented an exercise name: " +
                            ex.name
                    };

                }

                if (
                    ex.sets !== undefined &&
                    ex.sets !== null
                ) {

                    const setCount =
                        Number(ex.sets);

                    if (
                        !(setCount >= 2 && setCount <= 5)
                    ) {

                        return {
                            valid: false,
                            message:
                                "Sets must be between 2 and 5 for: " +
                                ex.name
                        };

                    }

                }

            }

        } else if (day.rest === true) {

            // Valid rest day

        } else {

            return {
                valid: false,
                message:
                    "Each day must have either workoutId or rest"
            };

        }
    }

    if (workoutCount !== requestedDays) {

        return {
            valid: false,
            message:
                "AI returned " +
                workoutCount +
                " workout days instead of " +
                requestedDays
        };

    }

    return {
        valid: true
    };
}

// =========================================
// FALLBACK PLAN
// =========================================

function buildFallbackPlan(
    requestedDays,
    availableWorkouts
) {

    if (
        availableWorkouts.length <
        requestedDays
    ) {

        return null;
    }

    const selected =
        availableWorkouts
            .slice(0, requestedDays);

    const week = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const days = [];

    let workoutIndex = 0;

    for (let i = 0; i < week.length; i++) {

        if (
            workoutIndex < selected.length
        ) {

            days.push({
                day: week[i],
                workoutId:
                    selected[workoutIndex].id
            });

            workoutIndex++;

        } else {

            days.push({
                day: week[i],
                rest: true
            });

        }
    }

    return {
        days: days
    };
}

// =========================================
// GEMINI CLIENT
// =========================================

async function generateContent(prompt, options) {

    let lastError = null;
    let lastQuotaError = null;

    for (const model of MODELS_TO_TRY) {

        try {

            const geminiRes =
                await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            contents: [
                                {
                                    parts: [
                                        {
                                            text: prompt
                                        }
                                    ]
                                }
                            ],

                            generationConfig: {
                                temperature:
                                    (options && options.temperature) || 0.7,
                                maxOutputTokens:
                                    (options && options.maxOutputTokens) || 8192,
                                responseMimeType:
                                    "application/json"
                            }
                        })
                    }
                );

            const data =
                await geminiRes.json();

            if (!geminiRes.ok) {

                const msg =
                    (
                        data.error &&
                        data.error.message
                    ) ||
                    (
                        "Gemini returned status " +
                        geminiRes.status
                    );

                const status =
                    geminiRes.status;

                if (status === 429) {

                    console.error(
                        "[Gemini quota]",
                        model,
                        "-",
                        msg
                    );

                    lastQuotaError =
                        new Error(
                            "AI free quota for today is used up"
                        );

                    lastQuotaError.isQuota = true;

                    continue;
                }

                if (
                    status === 503 ||
                    status === 404 ||
                    status === 400
                ) {

                    console.error(
                        "[Gemini model unavailable]",
                        model,
                        "-",
                        msg
                    );

                    lastError =
                        new Error(msg);

                    continue;
                }

                lastError =
                    new Error(msg);

                throw lastError;
            }

            const text =
                data.candidates &&
                data.candidates[0] &&
                data.candidates[0].content &&
                data.candidates[0].content.parts &&
                data.candidates[0].content.parts[0] &&
                data.candidates[0].content.parts[0].text;

            if (!text) {

                lastError =
                    new Error(
                        "Gemini returned an empty response"
                    );

                continue;
            }

            return text;

        } catch (err) {

            if (err.isQuota) {

                lastQuotaError = err;

            } else if (
                !(
                    err.message &&
                    /(503|404|400|429)/.test(
                        err.message
                    )
                )
            ) {

                throw err;

            } else {

                lastError = err;
            }
        }
    }

    if (lastQuotaError) {
        throw lastQuotaError;
    }

    throw (
        lastError ||
        new Error(
            "All Gemini models failed"
        )
    );
}

// =========================================
// JSON PARSER
// =========================================

function parseJsonResponse(text) {

    const raw =
        String(text).trim();

    const fenced =
        raw.match(
            /```(?:json)?\s*([\s\S]*?)```/
        );

    if (fenced) {

        return JSON.parse(
            fenced[1].trim()
        );

    }

    try {

        return JSON.parse(raw);

    } catch (e) {

        const start =
            raw.indexOf("{");

        const end =
            raw.lastIndexOf("}");

        if (
            start >= 0 &&
            end > start
        ) {

            return JSON.parse(
                raw.slice(start, end + 1)
            );

        }

        throw e;
    }
}

// =========================================
// REPLACEMENT CACHE KEY
// =========================================

function cacheKeyFor(
    exerciseName,
    equipment,
    level
) {

    return (
        exerciseName +
        "|" +
        (
            equipment ||
            "full-gym"
        ) +
        "|" +
        (
            level ||
            "intermediate"
        )
    ).toLowerCase();
}

function nearestCachedKey(exerciseName, equipment, level) {
    const name = String(exerciseName || "").trim().toLowerCase();
    if (!name) return null;
    for (const key of responseCache.keys()) {
        const namePart = String(key).split("|")[0];
        if (namePart && namePart.trim() === name) {
            return key;
        }
    }
    return null;
}

// =========================================
// REPLACEMENT PROMPT
// =========================================

function buildReplacementPrompt(
    exerciseName,
    userEquipment,
    userLevel
) {

    const equipmentGuide = {

        "bodyweight":
            "No equipment — bodyweight exercises only",

        "minimal":
            "Minimal equipment (resistance bands, a single dumbbell)",

        "home-gym":
            "Home gym (dumbbells, bench)",

        "full-gym":
            "Full gym (machines, barbells, cables)"
    };

    const equipmentDesc =
        equipmentGuide[userEquipment] ||
        equipmentGuide["full-gym"];

    return [

        "You are a professional personal trainer. Suggest exactly 3 alternative exercises that replace the given exercise while keeping the same training goal and targeting the same primary muscle group.",

        "",

        "Original exercise: " +
            exerciseName,

        "User's available equipment: " +
            equipmentDesc,

        "User's experience level: " +
            userLevel,

        "",

        "Rules:",

        "- Only suggest exercises the user can actually do with their available equipment.",

        "- Match the original equipment when possible; a bodyweight or minimal-equipment alternative is fine if equipment is limited.",

        "- Prefer a similar difficulty level, but it is okay to go one step up or down.",

        "- For EVERY alternative include ALL of the following: a short reason (1-2 sentences), exactly 3-4 concise form steps, exactly 2-3 form tips, and exactly 2-3 common mistakes to avoid.",

        "- Every alternative object MUST contain ONLY and EXACTLY these fields, no extra fields and no missing fields: name, reason, muscle, equipment, difficulty, sets, reps, rest, steps, tips, commonMistakes.",

        "",

        "Allowed values:",

        "- muscle: one of chest, back, shoulders, arms, legs, glutes, core.",

        "- equipment: one of bodyweight, minimal, home-gym, full-gym.",

        "- difficulty: one of beginner, intermediate, advanced.",

        "- sets: a number between 2 and 5. reps and rest: short strings like \"12\" and \"60s\".",

        "",

        "Respond ONLY with a single valid JSON object (no markdown, no code fences, no commentary before or after) with this exact shape:",

        '{ "alternatives": [ { "name": "Alternative exercise name", "reason": "why it is a good replacement (1-2 sentences)", "muscle": "chest", "equipment": "bodyweight", "difficulty": "beginner", "sets": 3, "reps": "12", "rest": "60s", "steps": ["concise step 1", "concise step 2", "concise step 3"], "tips": ["form tip 1", "form tip 2"], "commonMistakes": ["mistake 1", "mistake 2"] } ] }'

    ].join("\n");
}

// =========================================
// START SERVER
// =========================================

app.listen(PORT, () => {

    const aiOn =
        !!GEMINI_API_KEY &&
        !GEMINI_API_KEY.startsWith("PUT_");

    const seeded =
        loadSeedCache();

    console.log(
        "VIVAFIT backend running at http://localhost:" +
        PORT
    );

    console.log(
        "AI mode: " +
        (
            aiOn
                ? "ON (models: " +
                    MODELS_TO_TRY.join(", ") +
                    ")"
                : "OFF — add your GEMINI_API_KEY to .env"
        )
    );

    console.log(
        "Seeded suggestions loaded: " +
        seeded
    );
});