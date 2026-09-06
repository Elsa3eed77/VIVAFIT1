// =========================================
// VIVAFIT BACKEND — AI EXERCISE REPLACEMENT
// =========================================
// Runs the Gemini-powered replacement API and serves the frontend.
// Start with:  node server.js
// Then open:   http://localhost:3000/workouts.html

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "backend", ".env") });

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Models to try, in order. Each model has its own free daily quota, so if one
// runs out we silently move to the next. "gemini-flash-latest" is an alias
// Google keeps updated, so it never becomes "no longer available".
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

// Simple in-memory cache: repeat requests for the same exercise never hit the
// Gemini API, so we don't burn the free quota on duplicate clicks.
const responseCache = new Map();
const CACHE_MAX = 200;

const SEED_CACHE_FILE = path.join(__dirname, "ai-seed-cache.json");

function loadSeedCache() {
    try {
        if (!fs.existsSync(SEED_CACHE_FILE)) return 0;
        const seed = JSON.parse(fs.readFileSync(SEED_CACHE_FILE, "utf8"));
        let loaded = 0;
        for (const [key, value] of Object.entries(seed)) {
            if (value && value.alternatives && value.alternatives.length) {
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

function cacheKeyFor(exerciseName, equipment, level) {
    return (exerciseName + "|" + (equipment || "full-gym") + "|" + (level || "intermediate")).toLowerCase();
}

app.use(cors());
app.use(express.json({ limit: "256kb" }));

// Serve the frontend (parent of the backend folder)
app.use(express.static(path.join(__dirname, "..")));

// =========================================
// HEALTH CHECK
// =========================================

app.get("/api/health", (req, res) => {
    const keyConfigured = !!GEMINI_API_KEY && !GEMINI_API_KEY.startsWith("PUT_");
    res.json({
        ok: true,
        ai: keyConfigured,
        model: keyConfigured ? MODELS_TO_TRY[0] : null,
        cache: responseCache.size
    });
});

// =========================================
// AI EXERCISE REPLACEMENT
// =========================================

app.post("/api/replace-exercise", async (req, res) => {
    try {
        const exerciseName = (req.body && req.body.exerciseName) || "";
        const userEquipment = (req.body && req.body.userEquipment) || "full-gym";
        const userLevel = (req.body && req.body.userLevel) || "intermediate";

        if (!exerciseName) {
            return res.status(400).json({ error: "BAD_REQUEST", message: "exerciseName is required" });
        }

        if (!GEMINI_API_KEY || GEMINI_API_KEY.startsWith("PUT_")) {
            return res.status(503).json({
                error: "NO_API_KEY",
                message: "Gemini API key is not configured yet. Add your key to backend/backend/.env as: GEMINI_API_KEY=your_api_key"
            });
        }

        // Serve from cache instantly (no Gemini call)
        const cacheKey = cacheKeyFor(exerciseName, userEquipment, userLevel);
        if (responseCache.has(cacheKey)) {
            return res.json({ suggestions: responseCache.get(cacheKey), cached: true });
        }

        const prompt = buildReplacementPrompt(exerciseName, userEquipment, userLevel);
        const text = await generateContent(prompt);

        let parsed;
        try {
            parsed = parseJsonResponse(text);
        } catch (err) {
            console.error("[Gemini parse error]", text);
            return res.status(502).json({ error: "PARSE_ERROR", message: "Could not parse Gemini response" });
        }

        // Store in cache (bounded)
        responseCache.set(cacheKey, parsed);
        if (responseCache.size > CACHE_MAX) {
            responseCache.delete(responseCache.keys().next().value);
        }

        res.json({ suggestions: parsed, cached: false });
    } catch (err) {
        console.error("[/api/replace-exercise]", err.message || err);
        res.status(502).json({
            error: err.isQuota ? "QUOTA_EXHAUSTED" : "GEMINI_ERROR",
            message: err.message || "Gemini API error"
        });
    }
});

// =========================================
// GEMINI CLIENT (multi-model fallback + caching)
// =========================================

async function generateContent(prompt) {
    let lastError = null;
    let lastQuotaError = null;

    for (const model of MODELS_TO_TRY) {
        try {
            const geminiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 8192,
                            responseMimeType: "application/json"
                        }
                    })
                }
            );

            const data = await geminiRes.json();

            if (!geminiRes.ok) {
                const msg = (data.error && data.error.message) || ("Gemini returned status " + geminiRes.status);
                const status = geminiRes.status;

                if (status === 429) {
                    // Daily/RPM quota for THIS model exhausted -> try next model
                    console.error("[Gemini quota]", model, "-", msg);
                    lastQuotaError = new Error("AI free quota for today is used up");
                    lastQuotaError.isQuota = true;
                    continue;
                }

                if (status === 503 || status === 404 || status === 400) {
                    // Temporary overload / removed model -> try next model
                    console.error("[Gemini model unavailable]", model, "-", msg);
                    lastError = new Error(msg);
                    continue;
                }

                // Other errors (401, 403, ...) -> real problem, stop trying
                lastError = new Error(msg);
                throw lastError;
            }

            const text = data.candidates && data.candidates[0] &&
                data.candidates[0].content && data.candidates[0].content.parts &&
                data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;

            if (!text) {
                lastError = new Error("Gemini returned an empty response");
                continue;
            }

            return text;
        } catch (err) {
            if (err.isQuota) {
                lastQuotaError = err;
            } else if (!(err.message && /(503|404|400|429)/.test(err.message))) {
                throw err;
            } else {
                lastError = err;
            }
        }
    }

    if (lastQuotaError) throw lastQuotaError;
    throw lastError || new Error("All Gemini models failed");
}

function parseJsonResponse(text) {
    const raw = String(text).trim();
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) {
        return JSON.parse(fenced[1].trim());
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return JSON.parse(raw.slice(start, end + 1));
        }
        throw e;
    }
}

// =========================================
// PROMPT BUILDER
// =========================================

function buildReplacementPrompt(exerciseName, userEquipment, userLevel) {
    const equipmentGuide = {
        "bodyweight": "No equipment — bodyweight exercises only",
        "minimal": "Minimal equipment (resistance bands, a single dumbbell)",
        "home-gym": "Home gym (dumbbells, bench)",
        "full-gym": "Full gym (machines, barbells, cables)"
    };
    const equipmentDesc = equipmentGuide[userEquipment] || equipmentGuide["full-gym"];

    return [
        "You are a professional personal trainer. Suggest exactly 3 alternative exercises that replace the given exercise while keeping the same training goal and targeting the same primary muscle group.",
        "",
        "Original exercise: " + exerciseName,
        "User's available equipment: " + equipmentDesc,
        "User's experience level: " + userLevel,
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
// START
// =========================================

app.listen(PORT, () => {
    const aiOn = !!GEMINI_API_KEY && !GEMINI_API_KEY.startsWith("PUT_");
    const seeded = loadSeedCache();
    console.log("VIVAFIT backend running at http://localhost:" + PORT);
    console.log("AI mode: " + (aiOn ? "ON (models: " + MODELS_TO_TRY.join(", ") + ")" : "OFF — add your GEMINI_API_KEY to backend/backend/.env"));
    console.log("Seeded suggestions loaded: " + seeded);
});