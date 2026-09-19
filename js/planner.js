// =========================================
// VIVAFIT AI WORKOUT PLANNER
// =========================================
const PLANNER_STORAGE_KEY = "vivafitWorkoutPlan";
const API_URL = "http://localhost:3000";

const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

let selectedEquipment = "full-gym";
let selectedMuscles = [];
let currentPlan = null;
let exerciseModal = null;
let lastPlanSource = "ai";


// =========================================
// DOM REFERENCES
// =========================================

let planResult;
let planDaysContainer;
let generateBtn;
let savePlanBtn;
let regenerateBtn;
let exportBtn;

let summaryDays;
let summaryExercises;
let summaryDuration;

let savedPlansContainer;
let plannerMessage;

let selectAllMusclesBtn;
let clearAllMusclesBtn;
let muscleChipGroup;


// =========================================
// INITIALIZE DOM
// =========================================

function initializeDOM() {

    planResult = document.getElementById("planResult");
    planDaysContainer = document.getElementById("planDaysContainer");
    generateBtn = document.getElementById("generatePlanBtn");
    savePlanBtn = document.getElementById("savePlanBtn");
    regenerateBtn = document.getElementById("regeneratePlanBtn");
    exportBtn = document.getElementById("exportPlanBtn");

    summaryDays = document.getElementById("summaryDays");
    summaryExercises = document.getElementById("summaryExercises");
    summaryDuration = document.getElementById("summaryDuration");

    savedPlansContainer = document.getElementById("savedPlansContainer");
    plannerMessage = document.getElementById("plannerMessage");

    selectAllMusclesBtn =
        document.getElementById("selectAllMuscles");

    clearAllMusclesBtn =
        document.getElementById("clearAllMuscles");

    muscleChipGroup =
        document.getElementById("muscleChipGroup");

}


// =========================================
// MESSAGE
// =========================================

function showMessage(message, type = "error") {

    if (!plannerMessage) {
        return;
    }

    plannerMessage.textContent = message;

    if (type === "success") {

        plannerMessage.style.color = "#4ade80";

    } else if (type === "loading") {

        plannerMessage.style.color = "#ffffff";

    } else {

        plannerMessage.style.color = "#ff4a60";

    }

}


// =========================================
// MUSCLE CHIPS
// =========================================

function initializeMuscleChips() {

    if (muscleChipGroup) {

        muscleChipGroup.addEventListener(
            "click",
            function (e) {

                const chip =
                    e.target.closest(".chip");

                if (
                    !chip ||
                    !chip.dataset.muscle
                ) {
                    return;
                }

                chip.classList.toggle("active");

                selectedMuscles =
                    Array.from(
                        document.querySelectorAll(
                            "#muscleChipGroup .chip.active"
                        )
                    ).map(
                        function (chip) {
                            return chip.dataset.muscle;
                        }
                    );

            }
        );

    }


    if (selectAllMusclesBtn) {

        selectAllMusclesBtn.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        "#muscleChipGroup .chip[data-muscle]"
                    )
                    .forEach(
                        function (chip) {
                            chip.classList.add("active");
                        }
                    );

                selectedMuscles =
                    Array.from(
                        document.querySelectorAll(
                            "#muscleChipGroup .chip[data-muscle]"
                        )
                    ).map(
                        function (chip) {
                            return chip.dataset.muscle;
                        }
                    );

            }
        );

    }


    if (clearAllMusclesBtn) {

        clearAllMusclesBtn.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        "#muscleChipGroup .chip[data-muscle]"
                    )
                    .forEach(
                        function (chip) {
                            chip.classList.remove("active");
                        }
                    );

                selectedMuscles = [];

            }
        );

    }

}


// =========================================
// GET FORM DATA
// =========================================

function getPlannerSettings() {

    return {

        goal:
            document.getElementById("planGoal")?.value || "",

        level:
            document.getElementById("planLevel")?.value || "",

        experience:
            document.getElementById("planExperience")?.value || "",

        days:
            parseInt(
                document.getElementById("planDays")?.value
            ) || 3,

        equipment:
            document.getElementById("planEquipment")?.value ||
            "full-gym",

        duration:
            parseInt(
                document.getElementById("planDuration")?.value
            ) || 45,

        selectedMuscles:
            [...selectedMuscles]

    };

}


// =========================================
// EQUIPMENT FOR SUBSTITUTION
// =========================================

function getSubstitutionEquipment(equipment) {

    if (equipment === "none") {
        return "bodyweight";
    }

    if (equipment === "dumbbells") {
        return "minimal";
    }

    if (equipment === "barbell") {
        return "home-gym";
    }

    return "full-gym";

}


// =========================================
// AVAILABLE WORKOUTS
// =========================================

function getAvailableWorkouts() {

    if (typeof workouts === "undefined") {

        console.error(
            "workouts-data.js was not loaded."
        );

        return [];

    }

    return workouts.map(
        function (workout) {

            return {

                id: workout.id,

                name: workout.name,

                category: workout.category,

                duration: workout.duration,

                difficulty: workout.difficulty,

                description: workout.description,

                exercises:
                    Array.isArray(workout.exercises)
                        ? workout.exercises.map(
                            function (exercise) {
                                return exercise.name;
                            }
                        )
                        : []

            };

        }
    );

}


// =========================================
// MUSCLE GROUP MATCHING
// =========================================

function normalizeMuscleGroup(label) {

    const name =
        String(label || "")
            .toLowerCase()
            .trim();

    if (
        name === "biceps" ||
        name === "triceps"
    ) {
        return "arms";
    }

    if (
        name === "quads" ||
        name === "hamstrings" ||
        name === "calves"
    ) {
        return "legs";
    }

    return name;

}


// =========================================
// WORKOUT MUSCLE COVERAGE
// =========================================

function getWorkoutCoverage(workout) {

    const id =
        String(
            workout.id || ""
        ).toLowerCase();

    if (id === "upper-body") {

        return [
            "chest",
            "back",
            "shoulders",
            "arms"
        ];

    }

    if (id === "lower-body") {

        return [
            "legs",
            "glutes",
            "core"
        ];

    }

    if (id === "full-body") {

        return [
            "chest",
            "back",
            "shoulders",
            "arms",
            "legs",
            "glutes",
            "core",
            "cardio"
        ];

    }

    if (id === "cardio-blast") {

        return [
            "cardio"
        ];

    }

    if (id === "push") {

        return [
            "chest",
            "shoulders",
            "arms"
        ];

    }

    if (id === "pull") {

        return [
            "back",
            "arms"
        ];

    }

    if (id === "legs") {

        return [
            "legs",
            "glutes",
            "core"
        ];

    }

    return [
        "chest",
        "back",
        "shoulders",
        "arms",
        "legs",
        "glutes",
        "core"
    ];

}


// =========================================
// FILTER WORKOUTS BY MUSCLES
// =========================================

function filterWorkoutsByMuscles(
    workoutList,
    selectedMuscles
) {

    if (
        !Array.isArray(workoutList) ||
        !Array.isArray(selectedMuscles) ||
        selectedMuscles.length === 0
    ) {
        return workoutList;
    }

    const selectedGroups =
        selectedMuscles
            .map(normalizeMuscleGroup)
            .filter(Boolean);

    const filtered =
        workoutList.filter(
            function (workout) {

                const coverage =
                    getWorkoutCoverage(workout);

                return selectedGroups.some(
                    function (group) {

                        return (
                            coverage.indexOf(group) !== -1
                        );

                    }
                );

            }
        );

    return (
        filtered.length > 0
            ? filtered
            : workoutList
    );

}


// =========================================
// LOCAL FALLBACK PLAN (REAL WORKOUTS ONLY)
// =========================================

function buildLocalFallbackPlan(settings) {

    if (
        typeof workouts === "undefined" ||
        !Array.isArray(workouts)
    ) {
        return null;
    }

    const pool =
        filterWorkoutsByMuscles(
            workouts,
            settings.selectedMuscles || []
        );

    if (pool.length === 0) {
        return null;
    }

    const totalDays =
        Math.max(
            Number(settings.days) || 3,
            1
        );

    const workoutDays =
        Math.min(
            totalDays,
            7
        );

    const localPlan = [];

    for (
        let index = 0;
        index < 7;
        index++
    ) {

        if (index < workoutDays) {

            const workout =
                pool[index % pool.length];

            localPlan.push(
                createLocalWorkoutDay(
                    workout,
                    index + 1,
                    settings
                )
            );

        } else {

            localPlan.push(
                createRestDay(
                    index + 1
                )
            );

        }

    }

    return spreadWorkoutDays(
        localPlan
    );

}


// =========================================
// CREATE PLAN USING AI
// =========================================

async function generatePlanFromAI() {

    const settings =
        getPlannerSettings();


    lastPlanSource = "ai";


    console.log(
        "Starting AI workout generation..."
    );


    if (
        !settings.goal ||
        !settings.level ||
        !settings.days ||
        !settings.equipment ||
        !settings.duration
    ) {

        showMessage(
            "Please fill in all required fields."
        );

        return null;

    }


    const availableWorkouts =
        filterWorkoutsByMuscles(
            getAvailableWorkouts(),
            settings.selectedMuscles || []
        );


    if (availableWorkouts.length === 0) {

        showMessage(
            "No workouts were found. Check workouts-data.js."
        );

        return null;

    }


    showMessage(
        "Creating your personalized workout plan...",
        "loading"
    );


    if (generateBtn) {

        generateBtn.disabled = true;

        generateBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Creating Your Plan...
        `;

    }


    try {

        console.log(
            "Sending request to:",
            `${API_URL}/api/generate-plan`
        );


        const response =
            await fetch(
                `${API_URL}/api/generate-plan`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        goal:
                            settings.goal,

                        level:
                            settings.level,

                        experience:
                            settings.experience,

                        days:
                            settings.days,

                        equipment:
                            settings.equipment,

                        duration:
                            settings.duration,

                        selectedMuscles:
                            settings.selectedMuscles,

                        availableWorkouts:
                            availableWorkouts

                    })

                }
            );


        console.log(
            "Backend response status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "AI PLAN RESPONSE:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to generate workout plan."
            );

        }


        if (
            !data.days ||
            !Array.isArray(data.days)
        ) {

            throw new Error(
                "The AI returned an invalid workout plan."
            );

        }


        console.log(
            "AI returned days:",
            data.days
        );


        const convertedPlan =
            convertAIPlanToLocalPlan(
                data.days,
                settings
            );


        console.log(
            "CONVERTED LOCAL PLAN:",
            convertedPlan
        );


        return convertedPlan;


    } catch (error) {

        console.error(
            "Planner error:",
            error
        );


        const localFallback =
            buildLocalFallbackPlan(
                settings
            );


        if (localFallback) {

            lastPlanSource = "local";

            console.warn(
                "AI unavailable - using real saved workouts."
            );

            return localFallback;

        }


        showMessage(
            "Could not generate the plan: " +
            error.message
        );


        return null;


    } finally {

        if (generateBtn) {

            generateBtn.disabled = false;

            generateBtn.innerHTML = `
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                Generate My Workout Plan
            `;

        }

    }

}


// =========================================
// FIND WORKOUT BY ID
// =========================================

function findWorkoutById(id) {

    if (
        typeof workouts === "undefined" ||
        !id
    ) {

        return null;

    }


    return (
        workouts.find(
            function (workout) {

                return (
                    String(workout.id).toLowerCase() ===
                    String(id).toLowerCase()
                );

            }
        ) || null
    );

}


// =========================================
// NORMALIZE WORKOUT NAME
// =========================================

function normalizeWorkoutName(name) {

    return String(name || "")
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .replace(/\bday\b/g, "")
        .replace(/\bdays\b/g, "")
        .replace(/\blegs\b/g, "leg")
        .replace(/\bworkout\b/g, "")
        .replace(/\s+/g, " ")
        .trim();

}


// =========================================
// FIND WORKOUT BY NAME
// =========================================

function findWorkoutByName(name) {

    if (
        typeof workouts === "undefined" ||
        !name
    ) {

        return null;

    }


    const normalizedName =
        normalizeWorkoutName(name);


    return (
        workouts.find(
            function (workout) {

                const workoutName =
                    normalizeWorkoutName(
                        workout.name
                    );

                return (
                    workoutName ===
                    normalizedName
                );

            }
        ) || null
    );

}


// =========================================
// FIND WORKOUT FROM AI DAY
// =========================================

function findWorkoutFromAIDay(aiDay) {

    if (!aiDay) {
        return null;
    }


    // -----------------------------------------
    // 1. TRY ID
    // -----------------------------------------

    const possibleId =
        aiDay.workoutId ||
        aiDay.id;


    if (possibleId) {

        const byId =
            findWorkoutById(
                possibleId
            );


        if (byId) {
            return byId;
        }

    }


    // -----------------------------------------
    // 2. TRY ALL NAME FIELDS
    // -----------------------------------------

    const possibleNames = [

        aiDay.name,

        aiDay.workout,

        aiDay.workoutName,

        aiDay.title,

        aiDay.workoutTitle

    ];


    for (
        let i = 0;
        i < possibleNames.length;
        i++
    ) {

        if (!possibleNames[i]) {
            continue;
        }


        const byName =
            findWorkoutByName(
                possibleNames[i]
            );


        if (byName) {

            return byName;

        }

    }


    // -----------------------------------------
    // 3. FALLBACK KEYWORD MATCH
    // -----------------------------------------

    const aiText =
        normalizeWorkoutName(
            possibleNames.find(
                function (name) {
                    return !!name;
                }
            ) || ""
        );


    if (aiText.includes("push")) {

        return findWorkoutById("push");

    }


    if (aiText.includes("pull")) {

        return findWorkoutById("pull");

    }


    if (aiText.includes("leg")) {

        return findWorkoutById("legs");

    }


    if (aiText.includes("full")) {

        return findWorkoutById("full-body");

    }


    if (aiText.includes("cardio")) {

        return findWorkoutById("cardio-blast");

    }


    if (aiText.includes("upper")) {

        return findWorkoutById("upper-body");

    }


    if (aiText.includes("lower")) {

        return findWorkoutById("lower-body");

    }


    return null;

}


// =========================================
// MUSCLE DETECTION
// =========================================

function getExerciseMuscle(
    exerciseName,
    workoutCategory
) {

    const name =
        String(
            exerciseName || ""
        ).toLowerCase();


    if (
        name.includes("bench") ||
        name.includes("chest") ||
        name.includes("fly") ||
        name.includes("push-up")
    ) {

        return "Chest";

    }


    if (
        name.includes("row") ||
        name.includes("pull-up") ||
        name.includes("pulldown") ||
        name.includes("deadlift")
    ) {

        return "Back";

    }


    if (
        name.includes("shoulder") ||
        name.includes("overhead press") ||
        name.includes("lateral raise")
    ) {

        return "Shoulders";

    }


    if (
        name.includes("curl") ||
        name.includes("bicep") ||
        name.includes("tricep") ||
        name.includes("skull")
    ) {

        return "Arms";

    }


    if (
        name.includes("squat") ||
        name.includes("lunge") ||
        name.includes("leg press") ||
        name.includes("leg curl") ||
        name.includes("leg extension")
    ) {

        return "Legs";

    }


    if (
        name.includes("hip thrust") ||
        name.includes("glute") ||
        name.includes("kickback")
    ) {

        return "Glutes";

    }


    if (
        name.includes("calf") ||
        name.includes("calves")
    ) {

        return "Calves";

    }


    if (
        name.includes("plank") ||
        name.includes("crunch") ||
        name.includes("core") ||
        name.includes("ab ")
    ) {

        return "Core";

    }


    if (
        workoutCategory === "cardio" ||
        name.includes("jump") ||
        name.includes("burpee") ||
        name.includes("mountain climber") ||
        name.includes("high knee")
    ) {

        return "Cardio";

    }


    return "Full Body";

}


// =========================================
// WORKOUT FOCUS
// =========================================

function getWorkoutFocus(workout) {

    if (!workout) {
        return ["Workout"];
    }


    const category =
        String(
            workout.category || ""
        ).toLowerCase();


    if (workout.id === "push") {

        return [
            "Chest",
            "Shoulders",
            "Arms"
        ];

    }


    if (workout.id === "pull") {

        return [
            "Back",
            "Arms"
        ];

    }


    if (
        workout.id === "legs" ||
        workout.id === "lower-body"
    ) {

        return [
            "Legs",
            "Glutes",
            "Core"
        ];

    }


    if (workout.id === "upper-body") {

        return [
            "Chest",
            "Back",
            "Shoulders",
            "Arms"
        ];

    }


    if (workout.id === "full-body") {

        return [
            "Full Body"
        ];

    }


    if (category === "cardio") {

        return [
            "Cardio"
        ];

    }


    return [
        workout.category ||
        "Workout"
    ];

}


// =========================================
// NORMALIZE EXERCISE NAME
// =========================================

function normalizeExerciseName(name) {

    return String(name || "")
        .toLowerCase()
        .replace(/["']/g, "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


// =========================================
// CREATE LOCAL WORKOUT OBJECT
// =========================================

function createLocalWorkoutDay(
    workout,
    dayNumber,
    settings,
    aiExercises
) {

    const workoutExercises =
        Array.isArray(workout.exercises)
            ? workout.exercises
            : [];

    const hasAiExercises =
        Array.isArray(aiExercises) &&
        aiExercises.length > 0;

    let aiLookup = null;

    if (hasAiExercises) {

        aiLookup = {};

        aiExercises.forEach(
            function (aiEx) {

                if (!aiEx || !aiEx.name) {
                    return;
                }

                aiLookup[
                    normalizeExerciseName(aiEx.name)
                ] = aiEx;

            }
        );

    }


    const exercises =
        workoutExercises.map(
            function (exercise) {

                const aiMatch =
                    aiLookup
                        ? aiLookup[
                            normalizeExerciseName(
                                exercise.name
                            )
                        ]
                        : null;

                // The AI may pick a subset of the workout's
                // real exercises. Skip anything not chosen.
                if (
                    hasAiExercises &&
                    !aiMatch
                ) {
                    return null;
                }

                const aiSets =
                    Number(
                        aiMatch &&
                        aiMatch.sets
                    );

                const sanitizedSets =
                    (aiSets >= 2 && aiSets <= 5)
                        ? aiSets
                        : Number(
                            exercise.sets || 3
                        );

                const aiReps =
                    aiMatch &&
                    aiMatch.reps
                        ? String(aiMatch.reps).trim()
                        : "";

                const aiRest =
                    aiMatch &&
                    aiMatch.rest
                        ? String(aiMatch.rest).trim()
                        : "";

                return {

                    name:
                        exercise.name,

                    muscle:
                        getExerciseMuscle(
                            exercise.name,
                            workout.category
                        ),

                    sets:
                        sanitizedSets,

                    reps:
                        aiReps ||
                        exercise.reps ||
                        "10",

                    rest:
                        aiRest ||
                        exercise.rest ||
                        "60s",

                    instruction:
                        "Perform this exercise with controlled movement and proper form."

                };

            }
        )
        .filter(Boolean);


    const totalSets =
        exercises.reduce(
            function (sum, exercise) {

                return (
                    sum +
                    Number(
                        exercise.sets || 0
                    )
                );

            },
            0
        );


    return {

        dayNumber:
            dayNumber,

        dayName:
            dayNames[
                dayNumber - 1
            ],

        isRestDay:
            false,

        workoutId:
            workout.id,

        name:
            workout.name,

        category:
            workout.category,

        description:
            workout.description,

        focus:
            getWorkoutFocus(
                workout
            ),

        exercises:
            exercises,

        estimatedTime:
            parseInt(
                workout.duration
            ) ||
            settings.duration,

        totalSets:
            totalSets

    };

}


// =========================================
// CREATE REST DAY
// =========================================

function createRestDay(dayNumber) {

    return {

        dayNumber:
            dayNumber,

        dayName:
            dayNames[
                dayNumber - 1
            ],

        isRestDay:
            true,

        name:
            "Rest Day",

        focus:
            [],

        exercises:
            [],

        estimatedTime:
            0,

        totalSets:
            0

    };

}


// =========================================
// SPREAD WORKOUT DAYS ACROSS THE WEEK
// =========================================

function spreadWorkoutDays(plan) {

    if (
        !Array.isArray(plan) ||
        plan.length === 0
    ) {
        return plan;
    }

    const workoutDays =
        plan.filter(
            function (day) {
                return (
                    day &&
                    !day.isRestDay
                );
            }
        );

    const count =
        workoutDays.length;

    if (count === 0) {
        return plan;
    }

    if (count >= 7) {
        return plan;
    }

    const targets = [];
    const used = [];

    for (
        let i = 0;
        i < count;
        i++
    ) {

        let position =
            Math.round(
                (i * 6) /
                Math.max(count - 1, 1)
            );

        while (
            used.indexOf(position) !== -1
        ) {
            position = (position + 1) % 7;
        }

        used.push(position);
        targets.push(position);

    }

    const sortedTargets =
        targets.slice().sort(
            function (a, b) {
                return a - b;
            }
        );

    const spread = [];

    for (
        let day = 0;
        day < 7;
        day++
    ) {

        const targetIndex =
            sortedTargets.indexOf(day);

        if (targetIndex !== -1) {

            const workout =
                workoutDays[targetIndex];

            spread.push({
                ...workout,
                dayNumber: day + 1,
                dayName: dayNames[day]
            });

        } else {

            spread.push(
                createRestDay(
                    day + 1
                )
            );

        }

    }

    return spread;

}


// =========================================
// CONVERT AI PLAN TO LOCAL PLAN
// =========================================

function convertAIPlanToLocalPlan(
    aiDays,
    settings
) {

    const localPlan = [];


    console.log(
        "Converting AI plan..."
    );


    for (
        let index = 0;
        index < 7;
        index++
    ) {

        const aiDay =
            aiDays[index] || {};


        // -----------------------------------------
        // REST DAY
        // -----------------------------------------

        const aiName =
            String(
                aiDay.name ||
                aiDay.workout ||
                aiDay.workoutName ||
                aiDay.title ||
                ""
            ).toLowerCase();


        if (
            aiDay.rest === true ||
            aiName.includes("rest")
        ) {

            localPlan.push(
                createRestDay(
                    index + 1
                )
            );

            continue;

        }


        // -----------------------------------------
        // FIND WORKOUT
        // -----------------------------------------

        const workout =
            findWorkoutFromAIDay(
                aiDay
            );


        console.log(
            "AI day:",
            aiDay,
            "Matched workout:",
            workout
                ? workout.id
                : "NOT FOUND"
        );


        // -----------------------------------------
        // IF WORKOUT NOT FOUND
        // -----------------------------------------

        if (!workout) {

            console.warn(
                "Could not match AI workout:",
                aiDay
            );


            localPlan.push(
                createRestDay(
                    index + 1
                )
            );


            continue;

        }


        // -----------------------------------------
        // CREATE REAL WORKOUT
        // -----------------------------------------

        localPlan.push(
            createLocalWorkoutDay(
                workout,
                index + 1,
                settings,
                aiDay.exercises
            )
        );

    }


    // -----------------------------------------
    // ALWAYS MAKE 7 DAYS
    // -----------------------------------------

    while (
        localPlan.length < 7
    ) {

        localPlan.push(
            createRestDay(
                localPlan.length + 1
            )
        );

    }


    return spreadWorkoutDays(
        localPlan.slice(
            0,
            7
        )
    );

}


// =========================================
// EXERCISE MODAL
// =========================================

function createExerciseModal() {

    const overlay =
        document.createElement("div");


    overlay.className =
        "exercise-modal-overlay";


    overlay.id =
        "exerciseModal";


    overlay.innerHTML = `

        <div class="exercise-modal-card">

            <div class="exercise-modal-header">

                <h3 id="exModalName">
                    Exercise
                </h3>

                <button
                    class="exercise-modal-close"
                    id="exModalClose"
                    type="button">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>

            <div
                class="exercise-modal-muscle"
                id="exModalMuscle">

                Chest

            </div>

            <div class="exercise-modal-stats">

                <div class="exercise-modal-stat">

                    <span
                        class="stat-val"
                        id="exModalSets">

                        4

                    </span>

                    <span class="stat-label">
                        Sets
                    </span>

                </div>

                <div class="exercise-modal-stat">

                    <span
                        class="stat-val"
                        id="exModalReps">

                        10

                    </span>

                    <span class="stat-label">
                        Reps
                    </span>

                </div>

                <div class="exercise-modal-stat">

                    <span
                        class="stat-val"
                        id="exModalRest">

                        90s

                    </span>

                    <span class="stat-label">
                        Rest
                    </span>

                </div>

            </div>

            <div class="exercise-modal-instructions">

                <p>
                    Instructions
                </p>

                <p id="exModalInstruction">
                    How to perform this exercise.
                </p>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    overlay.addEventListener(
        "click",
        function (e) {

            if (
                e.target === overlay
            ) {

                closeExerciseModal();

            }

        }
    );


    overlay
        .querySelector(
            "#exModalClose"
        )
        .addEventListener(
            "click",
            closeExerciseModal
        );


    document.addEventListener(
        "keydown",
        function (e) {

            if (
                e.key === "Escape"
            ) {

                closeExerciseModal();

            }

        }
    );


    return overlay;

}


function openExerciseModal(
    exercise,
    muscle,
    sets,
    reps,
    rest
) {

    if (!exerciseModal) {

        exerciseModal =
            createExerciseModal();

    }


    document.getElementById(
        "exModalName"
    ).textContent =
        exercise.name;


    document.getElementById(
        "exModalMuscle"
    ).textContent =
        muscle;


    document.getElementById(
        "exModalSets"
    ).textContent =
        sets;


    document.getElementById(
        "exModalReps"
    ).textContent =
        reps;


    document.getElementById(
        "exModalRest"
    ).textContent =
        rest;


    document.getElementById(
        "exModalInstruction"
    ).textContent =
        exercise.instruction;


    exerciseModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


function closeExerciseModal() {

    if (exerciseModal) {

        exerciseModal.classList.remove(
            "active"
        );

        document.body.style.overflow =
            "";

    }

}


// =========================================
// SHORT INSTRUCTION
// =========================================

function getShortInstruction(
    instruction
) {

    if (!instruction) {
        return "";
    }


    if (
        instruction.length <= 80
    ) {

        return instruction;

    }


    return (
        instruction.substring(
            0,
            80
        ) +
        "..."
    );

}


// =========================================
// RENDER PLAN
// =========================================

function renderPlan(plan) {

    if (
        !Array.isArray(plan)
    ) {

        showMessage(
            "Invalid workout plan."
        );

        return;

    }


    currentPlan =
        plan;


    const duration =
        parseInt(
            document.getElementById(
                "planDuration"
            )?.value
        ) || 45;


    const trainingDays =
        plan.filter(
            function (day) {
                return !day.isRestDay;
            }
        );


    const totalExercises =
        trainingDays.reduce(
            function (sum, day) {

                return (
                    sum +
                    (
                        Array.isArray(
                            day.exercises
                        )
                            ? day.exercises.length
                            : 0
                    )
                );

            },
            0
        );


    const totalDuration =
        trainingDays.reduce(
            function (sum, day) {

                return (
                    sum +
                    (
                        day.estimatedTime ||
                        duration
                    )
                );

            },
            0
        );


    const averageDuration =
        trainingDays.length > 0
            ? Math.round(
                totalDuration /
                trainingDays.length
            )
            : duration;


    if (summaryDays) {

        summaryDays.textContent =
            trainingDays.length;

    }


    if (summaryExercises) {

        summaryExercises.textContent =
            totalExercises;

    }


    if (summaryDuration) {

        summaryDuration.textContent =
            averageDuration +
            " min";

    }


    if (!planDaysContainer) {
        return;
    }


    planDaysContainer.innerHTML =
        "";


    plan.forEach(
        function (slot, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "training-day-card";


            // -----------------------------------------
            // REST DAY
            // -----------------------------------------

            if (slot.isRestDay) {

                card.innerHTML = `

                    <div class="day-header">

                        <div class="day-header-left">

                            <div class="day-number">
                                ${slot.dayNumber}
                            </div>

                            <div>

                                <h3>
                                    ${slot.dayName} — Rest Day
                                </h3>

                                <p>
                                    Rest and recover before your next workout.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div class="rest-day-content">

                        <i class="fa-solid fa-bed"></i>

                        <h4>
                            Recovery Day
                        </h4>

                        <p>
                            Stay hydrated, eat well, and get quality sleep.
                        </p>

                    </div>

                `;


                planDaysContainer.appendChild(
                    card
                );


                return;

            }


            const focusStr =
                slot.focus &&
                slot.focus.length > 0
                    ? slot.focus.join(", ")
                    : slot.category ||
                      "Workout";


            let tableRows =
                "";


            const exercises =
                Array.isArray(
                    slot.exercises
                )
                    ? slot.exercises
                    : [];


            exercises.forEach(
                function (
                    ex,
                    exerciseIndex
                ) {

                    tableRows += `

                        <tr
                            class="exercise-row"
                            data-day-index="${index}"
                            data-ex-index="${exerciseIndex}">

                            <td>

                                <div class="exercise-name-cell">

                                    <span class="exercise-num">
                                        ${exerciseIndex + 1}
                                    </span>

                                    <div>

                                        <div class="exercise-name-text">
                                            ${ex.name}
                                        </div>

                                        <div class="exercise-instruction">
                                            ${getShortInstruction(ex.instruction)}
                                        </div>

                                    </div>

                                </div>

                            </td>

                            <td>

                                <span class="muscle-tag">
                                    ${ex.muscle}
                                </span>

                            </td>

                            <td>

                                <span class="exercise-stat">
                                    ${ex.sets} sets
                                </span>

                            </td>

                            <td>

                                <span class="exercise-stat">
                                    ${ex.reps}
                                </span>

                            </td>

                            <td>

                                <span class="rest-badge">
                                    ${ex.rest}
                                </span>

                            </td>

                            <td>

                                <button
                                    class="planner-replace-btn"
                                    data-day-index="${index}"
                                    data-ex-index="${exerciseIndex}"
                                    type="button">

                                    <i class="fa-solid fa-shuffle"></i>
                                    Replace

                                </button>

                            </td>

                        </tr>

                    `;

                }
            );


            card.innerHTML = `

                <div class="day-header">

                    <div class="day-header-left">

                        <div class="day-number">
                            ${slot.dayNumber}
                        </div>

                        <div>

                            <h3>
                                ${slot.dayName} — ${slot.name}
                            </h3>

                            <p>
                                ${focusStr}
                            </p>

                        </div>

                    </div>

                    <div class="day-meta">

                        <span>

                            <i class="fa-solid fa-dumbbell"></i>

                            ${exercises.length}
                            exercises

                        </span>

                        <span>

                            <i class="fa-solid fa-layer-group"></i>

                            ${slot.totalSets}
                            sets

                        </span>

                        <span>

                            <i class="fa-regular fa-clock"></i>

                            ~${slot.estimatedTime}
                            min

                        </span>

                    </div>

                </div>

                <table class="exercise-table">

                    <thead>

                        <tr>

                            <th>
                                Exercise
                            </th>

                            <th>
                                Muscle
                            </th>

                            <th>
                                Sets
                            </th>

                            <th>
                                Reps
                            </th>

                            <th>
                                Rest
                            </th>

                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        ${tableRows}

                    </tbody>

                </table>

            `;


            planDaysContainer.appendChild(
                card
            );


            // -----------------------------------------
            // EXERCISE DETAILS
            // -----------------------------------------

            card.querySelectorAll(
                ".exercise-row"
            ).forEach(
                function (row) {

                    row.style.cursor =
                        "pointer";


                    row.addEventListener(
                        "click",
                        function (e) {

                            if (
                                e.target.closest(
                                    ".planner-replace-btn"
                                )
                            ) {

                                return;

                            }


                            const dayIndex =
                                parseInt(
                                    row.dataset.dayIndex
                                );


                            const exerciseIndex =
                                parseInt(
                                    row.dataset.exIndex
                                );


                            const exercise =
                                currentPlan[
                                    dayIndex
                                ]?.exercises[
                                    exerciseIndex
                                ];


                            if (!exercise) {
                                return;
                            }


                            openExerciseModal(
                                exercise,
                                exercise.muscle,
                                exercise.sets,
                                exercise.reps,
                                exercise.rest
                            );

                        }
                    );

                }
            );


            // -----------------------------------------
            // REPLACE BUTTON
            // -----------------------------------------

            card.querySelectorAll(
                ".planner-replace-btn"
            ).forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function (e) {

                            e.stopPropagation();


                            const dayIndex =
                                parseInt(
                                    this.dataset.dayIndex
                                );


                            const exerciseIndex =
                                parseInt(
                                    this.dataset.exIndex
                                );


                            if (
                                !currentPlan ||
                                !currentPlan[
                                    dayIndex
                                ]
                            ) {

                                return;

                            }


                            const exercise =
                                currentPlan[
                                    dayIndex
                                ].exercises[
                                    exerciseIndex
                                ];


                            if (!exercise) {
                                return;
                            }


                            if (
                                typeof openExerciseSubstitution ===
                                "undefined"
                            ) {

                                showMessage(
                                    "Substitution is not available."
                                );

                                return;

                            }


                            const settings =
                                getPlannerSettings();


                            const substitutionEquipment =
                                getSubstitutionEquipment(
                                    settings.equipment
                                );


                            openExerciseSubstitution({

                                exerciseName:
                                    exercise.name,

                                originalExercise:
                                    exercise,

                                workoutId:
                                    currentPlan[
                                        dayIndex
                                    ].workoutId ||
                                    "planner-day-" +
                                    dayIndex,

                                userEquipment:
                                    substitutionEquipment,

                                userLevel:
                                    settings.level ||
                                    "intermediate",

                                onSelect:
                                    function (
                                        replacement
                                    ) {

                                        currentPlan[
                                            dayIndex
                                        ].exercises[
                                            exerciseIndex
                                        ] = {

                                            name:
                                                replacement.name,

                                            muscle:
                                                exercise.muscle,

                                            sets:
                                                replacement.sets,

                                            reps:
                                                replacement.reps,

                                            rest:
                                                replacement.rest,

                                            instruction:
                                                replacement.instruction ||
                                                exercise.instruction

                                        };


                                        renderPlan(
                                            currentPlan
                                        );


                                        saveCurrentPlanSilently();

                                    }

                            });

                        }
                    );

                }
            );

        }
    );

}


// =========================================
// SAVE PLAN
// =========================================

function savePlan() {

    if (!currentPlan) {
        return;
    }


    const settings =
        getPlannerSettings();


    const planData = {

        plan:
            currentPlan,

        settings: {

            goal:
                settings.goal,

            level:
                settings.level,

            experience:
                settings.experience,

            daysPerWeek:
                settings.days,

            duration:
                settings.duration,

            equipment:
                settings.equipment,

            muscles:
                [...selectedMuscles]

        },

        savedAt:
            new Date().toISOString()

    };


    saveData(
        PLANNER_STORAGE_KEY,
        planData
    );


    if (savePlanBtn) {

        savePlanBtn.classList.add(
            "saved"
        );

        savePlanBtn.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Plan Saved
        `;

    }


    renderSavedPlan();


    showMessage(
        "Your workout plan has been saved.",
        "success"
    );

}


// =========================================
// SILENT SAVE
// =========================================

function saveCurrentPlanSilently() {

    if (!currentPlan) {
        return;
    }


    const oldData =
        loadSavedPlan();


    if (!oldData) {
        return;
    }


    oldData.plan =
        currentPlan;


    oldData.savedAt =
        new Date().toISOString();


    saveData(
        PLANNER_STORAGE_KEY,
        oldData
    );

}


// =========================================
// LOAD SAVED PLAN
// =========================================

function loadSavedPlan() {

    try {

        const data =
            getData(
                PLANNER_STORAGE_KEY,
                null
            );


        if (
            data &&
            data.plan &&
            Array.isArray(data.plan)
        ) {

            return data;

        }

    } catch (error) {

        console.error(
            "Could not load saved plan:",
            error
        );

    }


    return null;

}


// =========================================
// LOAD SAVED SETTINGS
// =========================================

function loadSavedSettings(data) {

    if (
        !data ||
        !data.settings
    ) {

        return;

    }


    const settings =
        data.settings;


    const goal =
        document.getElementById(
            "planGoal"
        );

    const level =
        document.getElementById(
            "planLevel"
        );

    const experience =
        document.getElementById(
            "planExperience"
        );

    const days =
        document.getElementById(
            "planDays"
        );

    const duration =
        document.getElementById(
            "planDuration"
        );

    const equipment =
        document.getElementById(
            "planEquipment"
        );


    if (goal) {

        goal.value =
            settings.goal ||
            "stay-fit";

    }


    if (level) {

        level.value =
            settings.level ||
            "beginner";

    }


    if (experience) {

        experience.value =
            settings.experience ||
            "beginner";

    }


    if (days) {

        days.value =
            settings.daysPerWeek ||
            3;

    }


    if (duration) {

        duration.value =
            settings.duration ||
            45;

    }


    if (equipment) {

        equipment.value =
            settings.equipment ||
            "full-gym";

    }


    selectedEquipment =
        settings.equipment ||
        "full-gym";


    selectedMuscles =
        settings.muscles ||
        [];


    document
        .querySelectorAll(
            "#muscleChipGroup .chip[data-muscle]"
        )
        .forEach(
            function (chip) {

                chip.classList.toggle(
                    "active",
                    selectedMuscles.includes(
                        chip.dataset.muscle
                    )
                );

            }
        );

}


// =========================================
// SAVED PLAN CARD
// =========================================

function renderSavedPlan() {

    if (!savedPlansContainer) {
        return;
    }


    const data =
        loadSavedPlan();


    if (!data) {

        savedPlansContainer.innerHTML = `
            <p>
                No saved plans yet.
            </p>
        `;

        return;

    }


    const trainingDays =
        data.plan.filter(
            function (day) {
                return !day.isRestDay;
            }
        ).length;


    const savedDate =
        data.savedAt
            ? new Date(
                data.savedAt
            ).toLocaleDateString()
            : "";


    savedPlansContainer.innerHTML = `

        <div class="saved-plan-card">

            <div>

                <i class="fa-solid fa-calendar-check"></i>

            </div>

            <div>

                <h3>
                    My Workout Plan
                </h3>

                <p>
                    ${trainingDays} training days
                </p>

                <small>
                    Saved ${savedDate}
                </small>

            </div>

        </div>

    `;

}


// =========================================
// GENERATE BUTTON
// =========================================

async function handleGenerateClick() {

    console.log(
        "GENERATE BUTTON CLICKED"
    );


    const plan =
        await generatePlanFromAI();


    if (!plan) {
        return;
    }


    const settings =
        getPlannerSettings();


    selectedEquipment =
        settings.equipment;


    currentPlan =
        plan;


    // -----------------------------------------
    // SAVE PLAN
    // -----------------------------------------

    saveData(
        PLANNER_STORAGE_KEY,
        {

            plan:
                currentPlan,

            settings: {

                goal:
                    settings.goal,

                level:
                    settings.level,

                experience:
                    settings.experience,

                daysPerWeek:
                    settings.days,

                duration:
                    settings.duration,

                equipment:
                    settings.equipment,

                muscles:
                    [...selectedMuscles]

            },

            savedAt:
                new Date().toISOString()

        }
    );


    // -----------------------------------------
    // SHOW PLAN
    // -----------------------------------------

    renderPlan(
        currentPlan
    );


    if (planResult) {

        planResult.classList.add(
            "active"
        );


        planResult.scrollIntoView({
            behavior: "smooth"
        });

    }


    if (savePlanBtn) {

        savePlanBtn.classList.remove(
            "saved"
        );

        savePlanBtn.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Save Plan
        `;

    }


    renderSavedPlan();


    if (lastPlanSource === "local") {

        showMessage(
            "Plan created from your real workouts (AI was offline).",
            "loading"
        );

    } else {

        showMessage(
            "Your personalized plan is ready.",
            "success"
        );

    }

}


// =========================================
// REGENERATE
// =========================================

async function handleRegenerateClick() {

    const plan =
        await generatePlanFromAI();


    if (!plan) {
        return;
    }


    currentPlan =
        plan;


    renderPlan(
        currentPlan
    );


    if (planResult) {

        planResult.classList.add(
            "active"
        );

    }


    if (savePlanBtn) {

        savePlanBtn.classList.remove(
            "saved"
        );

        savePlanBtn.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Save Plan
        `;

    }


    showMessage(
        "A new plan has been generated.",
        "success"
    );

}


// =========================================
// EXPORT PLAN
// =========================================

function exportPlan() {

    if (!currentPlan) {
        return;
    }


    let text =
        "VIVAFIT WORKOUT PLAN\n";


    text +=
        "====================\n\n";


    currentPlan.forEach(
        function (slot) {

            text +=
                slot.dayName +
                " — " +
                slot.name +
                "\n";


            if (slot.isRestDay) {

                text +=
                    "Rest and recover.\n\n";

                return;

            }


            slot.exercises.forEach(
                function (
                    exercise,
                    index
                ) {

                    text +=
                        "  " +
                        (index + 1) +
                        ". " +
                        exercise.name +
                        " — " +
                        exercise.sets +
                        " sets x " +
                        exercise.reps +
                        " (rest " +
                        exercise.rest +
                        ")\n";

                }
            );


            text +=
                "\n";

        }
    );


    const blob =
        new Blob(
            [text],
            {
                type:
                    "text/plain"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const a =
        document.createElement(
            "a"
        );


    a.href =
        url;


    a.download =
        "vivafit-workout-plan.txt";


    document.body.appendChild(
        a
    );


    a.click();


    document.body.removeChild(
        a
    );


    URL.revokeObjectURL(
        url
    );

}


// =========================================
// INITIALIZE EVERYTHING
// =========================================

function initializePlanner() {

    console.log(
        "VIVAFIT PLANNER JS LOADED"
    );


    initializeDOM();


    initializeMuscleChips();


    // -----------------------------------------
    // GENERATE
    // -----------------------------------------

    if (generateBtn) {

        generateBtn.addEventListener(
            "click",
            handleGenerateClick
        );

    } else {

        console.error(
            "Generate button not found: #generatePlanBtn"
        );

    }


    // -----------------------------------------
    // SAVE
    // -----------------------------------------

    if (savePlanBtn) {

        savePlanBtn.addEventListener(
            "click",
            savePlan
        );

    }


    // -----------------------------------------
    // REGENERATE
    // -----------------------------------------

    if (regenerateBtn) {

        regenerateBtn.addEventListener(
            "click",
            handleRegenerateClick
        );

    }


    // -----------------------------------------
    // EXPORT
    // -----------------------------------------

    if (exportBtn) {

        exportBtn.addEventListener(
            "click",
            exportPlan
        );

    }


    // -----------------------------------------
    // LOAD SAVED PLAN
    // -----------------------------------------

    const savedData =
        loadSavedPlan();


    if (savedData) {

        loadSavedSettings(
            savedData
        );


        currentPlan =
            savedData.plan;


        renderPlan(
            currentPlan
        );


        if (planResult) {

            planResult.classList.add(
                "active"
            );

        }


        if (savePlanBtn) {

            savePlanBtn.classList.add(
                "saved"
            );

            savePlanBtn.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Plan Saved
            `;

        }

    }


    renderSavedPlan();

}


// =========================================
// START
// =========================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePlanner
    );

} else {

    initializePlanner();

}