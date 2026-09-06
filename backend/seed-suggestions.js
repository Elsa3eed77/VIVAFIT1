// ============================================
// SEED AI SUGGESTIONS FOR ALL WORKOUT EXERCISES
// Run after the server is up:
//   node seed-suggestions.js
// It asks the running server once per unique exercise and writes the
// results to ai-seed-cache.json so every Replace works instantly,
// even after a server restart (no Gemini call needed).
// ============================================

const fs = require("fs");
const path = require("path");

const API = "http://localhost:3000/api/replace-exercise";
const OUT = path.join(__dirname, "ai-seed-cache.json");
const EQUIPMENT = "full-gym";
const LEVEL = "intermediate";

// All unique exercises across the 7 workouts in workouts.js
const EXERCISES = [
    "Bench Press",
    "Overhead Press",
    "Barbell Row",
    "Bicep Curls",
    "Tricep Dips",
    "Barbell Squat",
    "Romanian Deadlift",
    "Leg Press",
    "Walking Lunges",
    "Calf Raises",
    "Deadlift",
    "Pull-Ups",
    "Plank",
    "Jump Rope",
    "Burpees",
    "Mountain Climbers",
    "High Knees",
    "Jumping Jacks",
    "Incline Bench Press",
    "Dumbbell Shoulder Press",
    "Cable Flyes",
    "Lateral Raises",
    "Tricep Pushdowns",
    "Seated Cable Row",
    "Face Pulls",
    "Hammer Curls",
    "Back Squat",
    "Front Squat",
    "Bulgarian Split Squat",
    "Leg Curl",
    "Leg Extension"
];

function keyFor(name) {
    return (name + "|" + EQUIPMENT + "|" + LEVEL).toLowerCase();
}

function loadSeed() {
    try {
        return JSON.parse(fs.readFileSync(OUT, "utf8"));
    } catch (e) {
        return {};
    }
}

function saveSeed(seed) {
    fs.writeFileSync(OUT, JSON.stringify(seed, null, 2));
}

async function main() {
    const seed = loadSeed();

    console.log("Seed file: " + OUT);
    console.log("Exercises to process: " + EXERCISES.length);

    for (let i = 0; i < EXERCISES.length; i++) {
        const name = EXERCISES[i];
        const key = keyFor(name);

        if (seed[key]) {
            console.log("[" + (i + 1) + "/" + EXERCISES.length + "] SKIP (already seeded) - " + name);
            continue;
        }

        const started = Date.now();
        try {
            const resp = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    exerciseName: name,
                    userEquipment: EQUIPMENT,
                    userLevel: LEVEL
                }),
                signal: AbortSignal.timeout(90000)
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error((data && data.message) || ("HTTP " + resp.status));
            }

            const suggestions = data && data.suggestions;
            if (!suggestions || !suggestions.alternatives || !suggestions.alternatives.length) {
                throw new Error("No alternatives returned");
            }

            seed[key] = suggestions;
            saveSeed(seed);

            console.log(
                "[" + (i + 1) + "/" + EXERCISES.length + "] OK - " + name +
                " (" + suggestions.alternatives.length + " alts, " + (Date.now() - started) + "ms, cached=" + (data.cached === true) + ")"
            );
        } catch (err) {
            console.log(
                "[" + (i + 1) + "/" + EXERCISES.length + "] FAIL - " + name + " - " + err.message
            );
        }
    }

    console.log("");
    console.log("DONE. Seeded entries: " + Object.keys(seed).length + " / " + EXERCISES.length);
}

main();