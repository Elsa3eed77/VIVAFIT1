// =========================================
// SMART EXERCISE SUBSTITUTION
// =========================================

var SUBSTITUTION_STORAGE_KEY = "vivafitSubstitutionHistory";

// =========================================
// EXERCISE MAPPING — name -> metadata
// =========================================

var exerciseMapping = {
    // === CHEST ===
    "Bench Press":               { muscle: "chest",     pattern: "horizontal-push", equipment: "full-gym",  difficulty: "intermediate" },
    "Incline Bench Press":       { muscle: "chest",     pattern: "horizontal-push", equipment: "full-gym",  difficulty: "intermediate" },
    "Decline Bench Press":       { muscle: "chest",     pattern: "horizontal-push", equipment: "full-gym",  difficulty: "intermediate" },
    "Cable Flyes":               { muscle: "chest",     pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Dumbbell Bench Press":      { muscle: "chest",     pattern: "horizontal-push", equipment: "home-gym",  difficulty: "beginner" },
    "Incline Dumbbell Press":    { muscle: "chest",     pattern: "horizontal-push", equipment: "home-gym",  difficulty: "intermediate" },
    "Machine Chest Press":       { muscle: "chest",     pattern: "horizontal-push", equipment: "full-gym",  difficulty: "beginner" },
    "Push-Ups":                  { muscle: "chest",     pattern: "horizontal-push", equipment: "bodyweight", difficulty: "beginner" },
    "Wide Push-Ups":             { muscle: "chest",     pattern: "horizontal-push", equipment: "bodyweight", difficulty: "beginner" },
    "Diamond Push-Ups":          { muscle: "chest",     pattern: "horizontal-push", equipment: "bodyweight", difficulty: "intermediate" },
    "Decline Push-Ups":          { muscle: "chest",     pattern: "horizontal-push", equipment: "bodyweight", difficulty: "intermediate" },
    "Archer Push-Ups":           { muscle: "chest",     pattern: "horizontal-push", equipment: "bodyweight", difficulty: "advanced" },
    "Dumbbell Flyes":            { muscle: "chest",     pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Push-Up Variations":        { muscle: "chest",     pattern: "horizontal-push", equipment: "home-gym",  difficulty: "intermediate" },
    "Floor Press":               { muscle: "chest",     pattern: "horizontal-push", equipment: "home-gym",  difficulty: "intermediate" },
    "Incline Push-Ups":          { muscle: "chest",     pattern: "horizontal-push", equipment: "bodyweight", difficulty: "beginner" },
    "Resistance Band Chest Press":{ muscle: "chest",    pattern: "horizontal-push", equipment: "minimal",   difficulty: "beginner" },
    "Resistance Band Flyes":     { muscle: "chest",     pattern: "isolation",       equipment: "minimal",   difficulty: "beginner" },
    "Close-Grip Push-Ups":       { muscle: "chest",     pattern: "horizontal-push", equipment: "minimal",   difficulty: "intermediate" },
    "Plyometric Push-Ups":       { muscle: "chest",     pattern: "horizontal-push", equipment: "minimal",   difficulty: "advanced" },

    // === BACK ===
    "Barbell Deadlift":          { muscle: "back",      pattern: "hinge",           equipment: "full-gym",  difficulty: "advanced" },
    "Deadlift":                  { muscle: "back",      pattern: "hinge",           equipment: "full-gym",  difficulty: "advanced" },
    "Pull-Ups":                  { muscle: "back",      pattern: "vertical-pull",   equipment: "bodyweight", difficulty: "intermediate" },
    "Barbell Row":               { muscle: "back",      pattern: "horizontal-pull", equipment: "full-gym",  difficulty: "intermediate" },
    "Seated Cable Row":          { muscle: "back",      pattern: "horizontal-pull", equipment: "full-gym",  difficulty: "beginner" },
    "Lat Pulldown":              { muscle: "back",      pattern: "vertical-pull",   equipment: "full-gym",  difficulty: "beginner" },
    "T-Bar Row":                 { muscle: "back",      pattern: "horizontal-pull", equipment: "full-gym",  difficulty: "intermediate" },
    "Dumbbell Bent-Over Row":    { muscle: "back",      pattern: "horizontal-pull", equipment: "home-gym",  difficulty: "intermediate" },
    "Single-Arm Dumbbell Row":   { muscle: "back",      pattern: "horizontal-pull", equipment: "home-gym",  difficulty: "beginner" },
    "Chin-Ups":                  { muscle: "back",      pattern: "vertical-pull",   equipment: "bodyweight", difficulty: "intermediate" },
    "Inverted Rows":             { muscle: "back",      pattern: "horizontal-pull", equipment: "bodyweight", difficulty: "beginner" },
    "Superman Hold":             { muscle: "back",      pattern: "extension",       equipment: "bodyweight", difficulty: "beginner" },
    "Resistance Band Lat Pulldown":{ muscle: "back",    pattern: "vertical-pull",   equipment: "minimal",   difficulty: "beginner" },
    "Resistance Band Rows":      { muscle: "back",      pattern: "horizontal-pull", equipment: "minimal",   difficulty: "beginner" },

    // === SHOULDERS ===
    "Overhead Press":            { muscle: "shoulders", pattern: "vertical-push",   equipment: "full-gym",  difficulty: "intermediate" },
    "Dumbbell Shoulder Press":   { muscle: "shoulders", pattern: "vertical-push",   equipment: "home-gym",  difficulty: "intermediate" },
    "Arnold Press":              { muscle: "shoulders", pattern: "vertical-push",   equipment: "home-gym",  difficulty: "intermediate" },
    "Lateral Raises":            { muscle: "shoulders", pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Dumbbell Lateral Raises":   { muscle: "shoulders", pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Face Pulls":                { muscle: "shoulders", pattern: "horizontal-pull", equipment: "full-gym",  difficulty: "beginner" },
    "Upright Row":               { muscle: "shoulders", pattern: "vertical-pull",   equipment: "full-gym",  difficulty: "intermediate" },
    "Rear Delt Flyes":           { muscle: "shoulders", pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Pike Push-Ups":             { muscle: "shoulders", pattern: "vertical-push",   equipment: "bodyweight", difficulty: "intermediate" },
    "Handstand Hold":            { muscle: "shoulders", pattern: "vertical-push",   equipment: "bodyweight", difficulty: "advanced" },
    "Handstand Push-Ups":        { muscle: "shoulders", pattern: "vertical-push",   equipment: "bodyweight", difficulty: "advanced" },
    "Resistance Band Overhead Press":{ muscle: "shoulders", pattern: "vertical-push", equipment: "minimal", difficulty: "beginner" },
    "Band Pull-Aparts":          { muscle: "shoulders", pattern: "horizontal-pull", equipment: "minimal",   difficulty: "beginner" },

    // === ARMS ===
    "Bicep Curls":               { muscle: "arms",      pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Barbell Curls":             { muscle: "arms",      pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Hammer Curls":              { muscle: "arms",      pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Preacher Curls":            { muscle: "arms",      pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Concentration Curls":       { muscle: "arms",      pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Tricep Dips":               { muscle: "arms",      pattern: "vertical-push",   equipment: "bodyweight", difficulty: "intermediate" },
    "Tricep Pushdowns":          { muscle: "arms",      pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Skull Crushers":            { muscle: "arms",      pattern: "isolation",       equipment: "full-gym",  difficulty: "intermediate" },
    "Overhead Tricep Extension": { muscle: "arms",      pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Tricep Kickbacks":          { muscle: "arms",      pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Dumbbell Bicep Curls":      { muscle: "arms",      pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Resistance Band Curls":     { muscle: "arms",      pattern: "isolation",       equipment: "minimal",   difficulty: "beginner" },
    "Resistance Band Pushdowns": { muscle: "arms",      pattern: "isolation",       equipment: "minimal",   difficulty: "beginner" },

    // === LEGS ===
    "Barbell Squat":             { muscle: "legs",      pattern: "squat",           equipment: "full-gym",  difficulty: "intermediate" },
    "Back Squat":                { muscle: "legs",      pattern: "squat",           equipment: "full-gym",  difficulty: "intermediate" },
    "Front Squat":               { muscle: "legs",      pattern: "squat",           equipment: "full-gym",  difficulty: "advanced" },
    "Romanian Deadlift":         { muscle: "legs",      pattern: "hinge",           equipment: "full-gym",  difficulty: "intermediate" },
    "Leg Press":                 { muscle: "legs",      pattern: "squat",           equipment: "full-gym",  difficulty: "beginner" },
    "Walking Lunges":            { muscle: "legs",      pattern: "squat",           equipment: "bodyweight", difficulty: "beginner" },
    "Calf Raises":               { muscle: "calves",    pattern: "isolation",       equipment: "bodyweight", difficulty: "beginner" },
    "Bulgarian Split Squat":     { muscle: "legs",      pattern: "squat",           equipment: "bodyweight", difficulty: "intermediate" },
    "Leg Curl":                  { muscle: "legs",      pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Leg Extension":             { muscle: "legs",      pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Hack Squat":                { muscle: "legs",      pattern: "squat",           equipment: "full-gym",  difficulty: "intermediate" },
    "Dumbbell Goblet Squat":     { muscle: "legs",      pattern: "squat",           equipment: "home-gym",  difficulty: "beginner" },
    "Dumbbell Romanian Deadlift":{ muscle: "legs",      pattern: "hinge",           equipment: "home-gym",  difficulty: "intermediate" },
    "Dumbbell Lunges":           { muscle: "legs",      pattern: "squat",           equipment: "home-gym",  difficulty: "beginner" },
    "Step-Ups":                  { muscle: "legs",      pattern: "squat",           equipment: "home-gym",  difficulty: "beginner" },
    "Bodyweight Squats":         { muscle: "legs",      pattern: "squat",           equipment: "bodyweight", difficulty: "beginner" },
    "Jump Squats":               { muscle: "legs",      pattern: "squat",           equipment: "bodyweight", difficulty: "intermediate" },
    "Wall Sit":                  { muscle: "legs",      pattern: "squat",           equipment: "bodyweight", difficulty: "beginner" },
    "Resistance Band Squats":    { muscle: "legs",      pattern: "squat",           equipment: "minimal",   difficulty: "beginner" },
    "Resistance Band Leg Curls": { muscle: "legs",      pattern: "isolation",       equipment: "minimal",   difficulty: "beginner" },
    "Single-Leg Deadlift":       { muscle: "legs",      pattern: "hinge",           equipment: "minimal",   difficulty: "intermediate" },

    // === GLUTES ===
    "Hip Thrust":                { muscle: "glutes",    pattern: "hinge",           equipment: "home-gym",  difficulty: "intermediate" },
    "Barbell Hip Thrust":        { muscle: "glutes",    pattern: "hinge",           equipment: "full-gym",  difficulty: "intermediate" },
    "Cable Pull-Through":        { muscle: "glutes",    pattern: "hinge",           equipment: "full-gym",  difficulty: "beginner" },
    "Sumo Deadlift":             { muscle: "glutes",    pattern: "hinge",           equipment: "full-gym",  difficulty: "advanced" },
    "Glute Kickbacks (Cable)":   { muscle: "glutes",    pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Dumbbell Hip Thrust":       { muscle: "glutes",    pattern: "hinge",           equipment: "home-gym",  difficulty: "intermediate" },
    "Dumbbell Sumo Squat":       { muscle: "glutes",    pattern: "squat",           equipment: "home-gym",  difficulty: "intermediate" },
    "Single-Leg Hip Thrust":     { muscle: "glutes",    pattern: "hinge",           equipment: "home-gym",  difficulty: "intermediate" },
    "Frog Pumps":                { muscle: "glutes",    pattern: "hinge",           equipment: "bodyweight", difficulty: "beginner" },
    "Glute Bridge":              { muscle: "glutes",    pattern: "hinge",           equipment: "bodyweight", difficulty: "beginner" },
    "Single-Leg Glute Bridge":   { muscle: "glutes",    pattern: "hinge",           equipment: "bodyweight", difficulty: "intermediate" },
    "Donkey Kicks":              { muscle: "glutes",    pattern: "isolation",       equipment: "bodyweight", difficulty: "beginner" },
    "Fire Hydrants":             { muscle: "glutes",    pattern: "isolation",       equipment: "bodyweight", difficulty: "beginner" },
    "Resistance Band Hip Thrust":{ muscle: "glutes",    pattern: "hinge",           equipment: "minimal",   difficulty: "beginner" },
    "Band Pull-Through":         { muscle: "glutes",    pattern: "hinge",           equipment: "minimal",   difficulty: "beginner" },
    "Band Clamshells":           { muscle: "glutes",    pattern: "isolation",       equipment: "minimal",   difficulty: "beginner" },

    // === CORE ===
    "Plank":                     { muscle: "core",      pattern: "anti-extension",  equipment: "bodyweight", difficulty: "beginner" },
    "Cable Crunches":            { muscle: "core",      pattern: "flexion",         equipment: "full-gym",  difficulty: "beginner" },
    "Hanging Leg Raises":        { muscle: "core",      pattern: "flexion",         equipment: "full-gym",  difficulty: "intermediate" },
    "Ab Rollout":                { muscle: "core",      pattern: "anti-extension",  equipment: "full-gym",  difficulty: "advanced" },
    "Cable Woodchops":           { muscle: "core",      pattern: "rotation",        equipment: "full-gym",  difficulty: "intermediate" },
    "Weighted Plank":            { muscle: "core",      pattern: "anti-extension",  equipment: "full-gym",  difficulty: "intermediate" },
    "Hanging Knee Raises":       { muscle: "core",      pattern: "flexion",         equipment: "home-gym",  difficulty: "intermediate" },
    "Dead Bug":                  { muscle: "core",      pattern: "anti-extension",  equipment: "bodyweight", difficulty: "beginner" },
    "Mountain Climbers":         { muscle: "core",      pattern: "flexion",         equipment: "bodyweight", difficulty: "beginner" },
    "Bicycle Crunches":          { muscle: "core",      pattern: "rotation",        equipment: "bodyweight", difficulty: "beginner" },
    "Leg Raises":                { muscle: "core",      pattern: "flexion",         equipment: "bodyweight", difficulty: "intermediate" },
    "Russian Twists":            { muscle: "core",      pattern: "rotation",        equipment: "bodyweight", difficulty: "intermediate" },
    "Flutter Kicks":             { muscle: "core",      pattern: "flexion",         equipment: "bodyweight", difficulty: "beginner" },
    "Resistance Band Pallof Press":{ muscle: "core",    pattern: "anti-rotation",   equipment: "minimal",   difficulty: "intermediate" },
    "Band Crunches":             { muscle: "core",      pattern: "flexion",         equipment: "minimal",   difficulty: "beginner" },
    "Band Woodchops":            { muscle: "core",      pattern: "rotation",        equipment: "minimal",   difficulty: "intermediate" },

    // === CALVES ===
    "Standing Calf Raise":       { muscle: "calves",    pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Seated Calf Raise":         { muscle: "calves",    pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Donkey Calf Raise":         { muscle: "calves",    pattern: "isolation",       equipment: "full-gym",  difficulty: "intermediate" },
    "Leg Press Calf Raise":      { muscle: "calves",    pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Smith Machine Calf Raise":  { muscle: "calves",    pattern: "isolation",       equipment: "full-gym",  difficulty: "beginner" },
    "Dumbbell Calf Raises":      { muscle: "calves",    pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Single-Leg Calf Raise":     { muscle: "calves",    pattern: "isolation",       equipment: "bodyweight", difficulty: "beginner" },
    "Step Calf Raises":          { muscle: "calves",    pattern: "isolation",       equipment: "home-gym",  difficulty: "beginner" },
    "Jump Rope":                 { muscle: "calves",    pattern: "isolation",       equipment: "minimal",   difficulty: "beginner" },
    "Box Jumps":                 { muscle: "calves",    pattern: "squat",           equipment: "home-gym",  difficulty: "intermediate" },
    "Resistance Band Calf Raises":{ muscle: "calves",   pattern: "isolation",       equipment: "minimal",   difficulty: "beginner" },
    "Towel Calf Stretch":        { muscle: "calves",    pattern: "isolation",       equipment: "minimal",   difficulty: "beginner" },
    "Wall Calf Raises":          { muscle: "calves",    pattern: "isolation",       equipment: "bodyweight", difficulty: "beginner" }
};

// =========================================
// EQUIPMENT TIER HIERARCHY
// (higher tier includes all lower tiers)
// =========================================

var equipmentTiers = {
    "full-gym":  4,
    "home-gym":  3,
    "minimal":   2,
    "bodyweight": 1
};

// =========================================
// MUSCLE GROUP LABELS
// =========================================

var muscleLabels = {
    chest: "Chest",
    back: "Back",
    shoulders: "Shoulders",
    arms: "Arms",
    legs: "Legs",
    glutes: "Glutes",
    core: "Core",
    calves: "Calves"
};

var patternLabels = {
    "horizontal-push": "Horizontal Push",
    "horizontal-pull": "Horizontal Pull",
    "vertical-push": "Vertical Push",
    "vertical-pull": "Vertical Pull",
    "squat": "Squat",
    "hinge": "Hip Hinge",
    "isolation": "Isolation",
    "flexion": "Core Flexion",
    "rotation": "Core Rotation",
    "anti-extension": "Anti-Extension",
    "anti-rotation": "Anti-Rotation",
    "extension": "Back Extension"
};

var equipmentLabels = {
    "full-gym": "Full Gym",
    "home-gym": "Home Gym",
    "bodyweight": "Bodyweight",
    "minimal": "Minimal Equipment"
};

var difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };

// =========================================
// STATE
// =========================================

var substitutionModal = null;
var currentSubstitutionContext = null;
var aiRequestId = 0;

// =========================================
// GEMINI AI — EXERCISE REPLACEMENT
// =========================================

function getApiBaseUrl() {
    try {
        if (
            typeof window !== "undefined" &&
            window.location &&
            (window.location.protocol === "http:" || window.location.protocol === "https:")
        ) {
            return window.location.origin;
        }
    } catch (e) {}
    return "http://localhost:3000";
}

var AI_REQUEST_TIMEOUT_MS = 15000;
var AI_CACHE_KEY = "vivafitAiSuggestionsCache";
var AI_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function getAiCache() {
    try {
        return JSON.parse(localStorage.getItem(AI_CACHE_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function aiCacheKeyFor(context) {
    return (context.originalName + "|" + (context.userEquipment || "full-gym"));
}

function getAiCacheHit(context) {
    try {
        var cache = getAiCache();
        var item = cache[aiCacheKeyFor(context)];
        if (!item || !item.data || !item.ts) return null;
        if (Date.now() - item.ts > AI_CACHE_TTL_MS) return null;
        return item.data;
    } catch (e) {
        return null;
    }
}

function cacheAiResult(context, alternatives) {
    try {
        var cache = getAiCache();
        cache[aiCacheKeyFor(context)] = { ts: Date.now(), data: alternatives };
        var keys = Object.keys(cache);
        if (keys.length > 100) {
            delete cache[keys[0]];
        }
        localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {}
}

function fetchAiAlternatives(context) {
    var payload = {
        exerciseName: context.originalName,
        userEquipment: context.userEquipment || "full-gym",
        userLevel: context.userLevel || "intermediate"
    };

    var controller = (typeof AbortController !== "undefined") ? new AbortController() : null;
    var timeoutId = null;

    var request = fetch(getApiBaseUrl() + "/api/replace-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
    }).then(function (response) {
        if (!response.ok) {
            return response.json().then(function (errData) {
                var err = new Error((errData && errData.message) || "AI request failed");
                err.code = (errData && errData.error) || "API_ERROR";
                throw err;
            });
        }
        return response.json();
    }).then(function (data) {
        var list = data && data.suggestions && data.suggestions.alternatives;
        if (!list || !list.length) {
            throw new Error("AI returned no alternatives");
        }
        return list;
    });

    var timeout = new Promise(function (resolve, reject) {
        timeoutId = setTimeout(function () {
            if (controller) controller.abort();
            reject(new Error("AI request timed out"));
        }, AI_REQUEST_TIMEOUT_MS);
    });

    var race = Promise.race([request, timeout]);
    race.then(
        function () { clearTimeout(timeoutId); },
        function () { clearTimeout(timeoutId); }
    );

    return race;
}

function renderAiThinking() {
    return '\
        <div class="ai-thinking">\
            <div class="ai-thinking-spinner">\
                <i class="fa-solid fa-wand-magic-sparkles"></i>\
            </div>\
            <p class="ai-thinking-title">AI is finding your replacement...</p>\
            <p class="ai-thinking-sub">Analyzing your exercise and available equipment to suggest the best alternative.</p>\
        </div>\
    ' + serverHintHtml();
}

function isFileProtocol() {
    try {
        return window.location.protocol === "file:";
    } catch (e) {
        return false;
    }
}

function serverHintHtml() {
    if (!isFileProtocol()) return "";
    return '\
        <p class="offline-ai-note"><i class="fa-solid fa-link"></i> You opened this page directly from the file. To use the AI suggestions, open it through the server instead: <a href="http://localhost:3000/workouts.html" target="_blank" rel="noopener" style="color:#ff9a76;font-weight:700;text-decoration:underline;">http://localhost:3000/workouts.html</a></p>\
    ';
}

function renderAiAlternatives(alternatives) {
    var container = document.getElementById("subAlternativesList");
    if (!container) return;

    var html = '';
    html += '<p class="substitution-list-label"><i class="fa-solid fa-wand-magic-sparkles"></i> AI SUGGESTIONS</p>';
    html += '<p class="ai-powered-note"><i class="fa-solid fa-robot"></i> Powered by AI — each suggestion includes form guidance.</p>';

    for (var i = 0; i < alternatives.length; i++) {
        var alt = alternatives[i];

        var diff = alt.difficulty || "intermediate";
        var diffClass = ["beginner", "intermediate", "advanced"].indexOf(diff) >= 0 ? diff : "intermediate";

        html += '<div class="substitution-alt-card ai-alt-card">';

        html += '  <div class="sub-alt-header">';
        html += '    <div class="sub-alt-rank ai-rank"><i class="fa-solid fa-wand-magic-sparkles"></i></div>';
        html += '    <div class="sub-alt-title">';
        html += '      <h4>' + escapeHtml(alt.name || "Suggested Exercise") + '</h4>';
        html += '      <span class="sub-alt-difficulty ' + diffClass + '">' + escapeHtml(diff) + '</span>';
        html += '    </div>';
        html += '  </div>';

        html += '  <div class="sub-alt-tags">';
        if (alt.muscle) {
            html += '    <span class="sub-tag muscle-tag"><i class="fa-solid fa-bullseye"></i> ' + escapeHtml(capitalize(String(alt.muscle))) + '</span>';
        }
        if (alt.equipment) {
            html += '    <span class="sub-tag equip-tag"><i class="fa-solid fa-dumbbell"></i> ' + escapeHtml(capitalize(String(alt.equipment).replace(/-/g, " "))) + '</span>';
        }
        html += '  </div>';

        if (alt.reason) {
            html += '  <div class="sub-alt-reason ai-reason">';
            html += '    <div class="sub-reason-header"><i class="fa-solid fa-sparkles"></i> Why this exercise?</div>';
            html += '    <p>' + escapeHtml(alt.reason) + '</p>';
            html += '  </div>';
        }

        var steps = Array.isArray(alt.steps) ? alt.steps : [];
        var tips = Array.isArray(alt.tips) ? alt.tips : [];
        var mistakes = Array.isArray(alt.commonMistakes) ? alt.commonMistakes : (Array.isArray(alt.mistakes) ? alt.mistakes : []);

        if (steps.length || tips.length || mistakes.length) {
            html += '  <div class="ai-form-guide">';
            html += '    <div class="ai-form-guide-header"><i class="fa-solid fa-clipboard-check"></i> FORM GUIDE</div>';

            if (steps.length) {
                html += '    <ol class="ai-steps">';
                for (var s = 0; s < steps.length; s++) {
                    html += '      <li>' + escapeHtml(steps[s]) + '</li>';
                }
                html += '    </ol>';
            }

            if (tips.length) {
                html += '    <ul class="ai-tips">';
                for (var t = 0; t < tips.length; t++) {
                    html += '      <li><i class="fa-solid fa-circle-check"></i> ' + escapeHtml(tips[t]) + '</li>';
                }
                html += '    </ul>';
            }

            if (mistakes.length) {
                html += '    <div class="ai-mistakes">';
                html += '      <div class="ai-mistakes-header"><i class="fa-solid fa-triangle-exclamation"></i> AVOID</div>';
                for (var m = 0; m < mistakes.length; m++) {
                    html += '      <p><i class="fa-solid fa-xmark"></i> ' + escapeHtml(mistakes[m]) + '</p>';
                }
                html += '    </div>';
            }

            html += '  </div>';
        }

        html += '  <button class="sub-select-btn" data-ai-index="' + i + '">';
        html += '    <i class="fa-solid fa-check"></i> Select This Exercise';
        html += '  </button>';
        html += '</div>';
    }

    container.innerHTML = html;

    var buttons = container.querySelectorAll(".sub-select-btn");
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].addEventListener("click", function () {
            var idx = parseInt(this.dataset.aiIndex);
            selectSubstitutionAi(alternatives[idx]);
        });
    }
}

function selectSubstitutionAi(alt) {
    var ctx = currentSubstitutionContext;
    if (!ctx) return;

    var replacement = {
        name: (alt && alt.name) || ctx.originalName,
        sets: (alt && alt.sets) || ctx.originalExercise.sets,
        reps: (alt && alt.reps) || ctx.originalExercise.reps,
        rest: (alt && alt.rest) || ctx.originalExercise.rest,
        _substituted: true,
        _originalName: ctx.originalName,
        _ai: true
    };

    logSubstitution(
        ctx.workoutId || "unknown",
        ctx.originalName,
        replacement.name,
        (alt && alt.reason) || "AI suggested alternative"
    );

    if (typeof ctx.onSelect === "function") {
        ctx.onSelect(replacement);
    }

    closeSubstitutionModal();
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// =========================================
// EXERCISE LOOKUP HELPERS
// =========================================

function getExerciseMeta(exerciseName) {
    if (exerciseMapping[exerciseName]) {
        return exerciseMapping[exerciseName];
    }
    var lower = exerciseName.toLowerCase();
    for (var key in exerciseMapping) {
        if (key.toLowerCase() === lower) {
            return exerciseMapping[key];
        }
    }
    return null;
}

function findExerciseInDB(exerciseName, muscle) {
    if (!exerciseDB || !muscle) return null;
    var tiers = exerciseDB[muscle];
    if (!tiers) return null;
    var allTiers = ["fullGym", "homeGym", "bodyweight", "minimal"];
    for (var t = 0; t < allTiers.length; t++) {
        var pool = tiers[allTiers[t]];
        if (!pool) continue;
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].name === exerciseName) {
                return { exercise: pool[i], tier: allTiers[t], muscle: muscle };
            }
        }
    }
    return null;
}

// =========================================
// SCORING ENGINE
// =========================================

function scoreAlternative(original, alternative, userEquipment) {
    var score = 0;
    var reasons = [];

    // 1. Primary muscle match (0-40 points)
    if (alternative.muscle === original.muscle) {
        score += 40;
        reasons.push("Targets the same primary muscle group (" + muscleLabels[alternative.muscle] + ")");
    } else {
        score += 10;
        reasons.push("Targets " + muscleLabels[alternative.muscle] + " (secondary muscle group)");
    }

    // 2. Movement pattern match (0-25 points)
    if (alternative.pattern === original.pattern) {
        score += 25;
        reasons.push("Uses the same movement pattern (" + patternLabels[alternative.pattern] + ")");
    } else if (arePatternsCompatible(original.pattern, alternative.pattern)) {
        score += 15;
        reasons.push("Uses a compatible movement pattern");
    } else {
        score += 0;
        reasons.push("Different movement pattern — may feel different");
    }

    // 3. Equipment compatibility (0-20 points)
    var userTier = equipmentTiers[userEquipment] || 4;
    var altTier = equipmentTiers[alternative.equipment] || 1;
    var origTier = equipmentTiers[original.equipment] || 1;

    if (alternative.equipment === original.equipment) {
        score += 20;
        reasons.push("Uses the same equipment (" + equipmentLabels[alternative.equipment] + ")");
    } else if (altTier <= userTier) {
        score += 15;
        reasons.push("Compatible with your available equipment (" + equipmentLabels[userEquipment] + ")");
    } else {
        score -= 10;
        reasons.push("Requires equipment you may not have (" + equipmentLabels[alternative.equipment] + ")");
    }

    // 4. Difficulty appropriateness (0-15 points)
    var origDiff = difficultyOrder[original.difficulty] || 2;
    var altDiff = difficultyOrder[alternative.difficulty] || 2;
    var diffDelta = Math.abs(altDiff - origDiff);

    if (diffDelta === 0) {
        score += 15;
        reasons.push("Same difficulty level (" + alternative.difficulty + ")");
    } else if (diffDelta === 1) {
        score += 10;
        reasons.push("Slightly different difficulty (" + alternative.difficulty + ")");
    } else {
        score += 5;
        reasons.push("Significantly different difficulty (" + alternative.difficulty + ")");
    }

    // 5. Not the same exercise bonus
    if (alternative.name === original.name) {
        score -= 100;
    }

    // 6. Filter out unsuitable: require at least 40 points
    return {
        score: score,
        reasons: reasons,
        suitable: score >= 40 && alternative.name !== original.name
    };
}

function arePatternsCompatible(a, b) {
    var groups = {
        "push": ["horizontal-push", "vertical-push"],
        "pull": ["horizontal-pull", "vertical-pull"],
        "squat-hinge": ["squat", "hinge"],
        "isometric": ["anti-extension", "anti-rotation", "extension"]
    };
    for (var key in groups) {
        var g = groups[key];
        if (g.indexOf(a) >= 0 && g.indexOf(b) >= 0) return true;
    }
    return false;
}

// =========================================
// FIND ALTERNATIVES
// =========================================
function findAlternatives(exerciseName, userEquipment, userLevel) {
    var original = getExerciseMeta(exerciseName);

    if (!original) {
        return [];
    }

    var candidates = [];
    var userTier = equipmentTiers[userEquipment] || 4;

    // Avoid recently used substitutions
    var history = getSubstitutionHistory();
    var recentNames = {};

    history.forEach(function (item) {
        if (item && item.replacement && item.date) {
            var diff = Date.now() - new Date(item.date).getTime();
            var days = diff / (1000 * 60 * 60 * 24);

            if (days <= 7) {
                recentNames[item.replacement] = true;
            }
        }
    });

    // Use exerciseMapping directly
    for (var name in exerciseMapping) {

        if (name === exerciseName) {
            continue;
        }

        var altMeta = exerciseMapping[name];

        if (!altMeta) {
            continue;
        }

        // Don't suggest equipment the user doesn't have
        var altTier = equipmentTiers[altMeta.equipment] || 1;

        if (altTier > userTier) {
            continue;
        }

        var alternative = {
            name: name,
            muscle: altMeta.muscle,
            pattern: altMeta.pattern,
            equipment: altMeta.equipment,
            difficulty: altMeta.difficulty
        };

        var scoring = scoreAlternative(
            original,
            alternative,
            userEquipment
        );

        if (!scoring.suitable) {
            continue;
        }

        // Slight penalty for recently used alternatives
        var finalScore = scoring.score;

        if (recentNames[name]) {
            finalScore -= 10;
        }

        // Get instruction from exerciseGuideData if available
        var instruction =
            "Use controlled movement and maintain proper form.";

        if (
            typeof exerciseGuideData !== "undefined" &&
            exerciseGuideData[name]
        ) {
            var guide = exerciseGuideData[name];

            if (
                guide.steps &&
                guide.steps.length > 0
            ) {
                instruction = guide.steps[0];
            }
        }

        candidates.push({
            name: name,
            muscle: altMeta.muscle,
            pattern: altMeta.pattern,
            equipment: altMeta.equipment,
            difficulty: altMeta.difficulty,
            instruction: instruction,
            score: finalScore,
            reasons: scoring.reasons
        });
    }

    // Highest score first
    candidates.sort(function (a, b) {
        return b.score - a.score;
    });

    // Remove duplicates
    var unique = [];
    var seen = {};

    candidates.forEach(function (item) {
        if (!seen[item.name]) {
            seen[item.name] = true;
            unique.push(item);
        }
    });

    return unique.slice(0, 5);
}
// =========================================
// VOLUME PRESERVATION
// =========================================

function preserveVolume(original, alternative) {
    var sets = original.sets;
    var reps = original.reps;
    var rest = original.rest;

    var origMeta = getExerciseMeta(original.name);
    var altMeta = getExerciseMeta(alternative.name);

    if (!origMeta || !altMeta) {
        return { sets: sets, reps: reps, rest: rest };
    }

    // Same equipment tier -> keep same reps
    if (alternative.equipment === origMeta.equipment)  {
        return { sets: sets, reps: reps, rest: rest };
    }

    // Bodyweight alternative for weighted exercise -> adjust reps up
    if (alternative.equipment === "bodyweight" && origMeta.equipment !== "bodyweight") {
        var parsedReps = parseRepsNumber(reps);
        if (parsedReps <= 8) {
            reps = Math.min(parsedReps + 4, 20) + "";
        } else if (parsedReps <= 12) {
            reps = Math.min(parsedReps + 3, 20) + "";
        } else {
            reps = Math.min(parsedReps + 2, 25) + "";
        }
        rest = "45s";
    }

    // Minimal equipment alternative -> slight rep increase
    if (alternative.equipment === "minimal" && origMeta.equipment === "full-gym") {
        var pr = parseRepsNumber(reps);
        if (pr <= 10) {
            reps = Math.min(pr + 2, 20) + "";
        }
        rest = "60s";
    }

    return { sets: sets, reps: reps, rest: rest };
}

function parseRepsNumber(repsStr) {
    if (typeof repsStr === "number") return repsStr;
    var match = String(repsStr).match(/\d+/);
    return match ? parseInt(match[0]) : 10;
}

// =========================================
// SUBSTITUTION HISTORY
// =========================================

function logSubstitution(workoutId, originalName, alternativeName, reason) {
    var history = getSubstitutionHistory();
    history.push({
        date: new Date().toISOString(),
        workoutId: workoutId,
        originalExercise: originalName,
        alternativeExercise: alternativeName,
        reason: reason
    });
    localStorage.setItem(SUBSTITUTION_STORAGE_KEY, JSON.stringify(history));
}

function getSubstitutionHistory() {
    try {
        return JSON.parse(localStorage.getItem(SUBSTITUTION_STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

// =========================================
// SUBSTITUTION MODAL — UI
// =========================================

function createSubstitutionModal() {
    var overlay = document.createElement("div");
    overlay.className = "substitution-overlay";
    overlay.id = "substitutionModal";
    overlay.innerHTML = '\
        <div class="substitution-card">\
            <div class="substitution-header">\
                <div class="substitution-header-left">\
                    <div class="substitution-header-icon">\
                        <i class="fa-solid fa-shuffle"></i>\
                    </div>\
                    <div>\
                        <h3>Replace Exercise</h3>\
                        <p class="substitution-header-sub" id="subOriginalName">Exercise</p>\
                    </div>\
                </div>\
                <button class="substitution-close" id="subModalClose">\
                    <i class="fa-solid fa-xmark"></i>\
                </button>\
            </div>\
            <div class="substitution-body" id="subAlternativesList">\
            </div>\
            <div class="substitution-footer">\
                <button class="substitution-cancel-btn" id="subCancelBtn">\
                    <i class="fa-solid fa-xmark"></i> Cancel\
                </button>\
            </div>\
        </div>\
    ';
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeSubstitutionModal();
    });
    overlay.querySelector("#subModalClose").addEventListener("click", closeSubstitutionModal);
    overlay.querySelector("#subCancelBtn").addEventListener("click", closeSubstitutionModal);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && substitutionModal && substitutionModal.classList.contains("active")) {
            closeSubstitutionModal();
        }
    });

    return overlay;
}

function openSubstitutionModal(context) {
    if (!substitutionModal) substitutionModal = createSubstitutionModal();

    currentSubstitutionContext = context;

    document.getElementById("subOriginalName").textContent = context.originalName;

    var requestId = ++aiRequestId;

    var container = document.getElementById("subAlternativesList");

    container.innerHTML = renderAiThinking();

    substitutionModal.classList.add("active");
    document.body.style.overflow = "hidden";

    var cacheHit = getAiCacheHit(context);
    if (cacheHit && cacheHit.length) {
        renderAiAlternatives(cacheHit);
        return;
    }

    fetchAiAlternatives(context).then(function (alternatives) {
        if (requestId !== aiRequestId || !substitutionModal.classList.contains("active")) return;
        cacheAiResult(context, alternatives);
        try {
            renderAiAlternatives(alternatives);
        } catch (err) {
            if (requestId !== aiRequestId) return;
            try {
                renderOfflineAlternatives(context);
            } catch (err2) {
                renderFatalError(context);
            }
        }
    }).catch(function () {
        if (requestId !== aiRequestId || !substitutionModal.classList.contains("active")) return;
        try {
            renderOfflineAlternatives(context);
        } catch (err) {
            renderFatalError(context);
        }
    });
}

function renderOfflineAlternatives(context) {
    var userEquipment = context.userEquipment || "full-gym";
    var userLevel = context.userLevel || "intermediate";

    var alternatives = findAlternatives(context.originalName, userEquipment, userLevel);

    var container = document.getElementById("subAlternativesList");

    if (alternatives.length === 0) {
        container.innerHTML = serverHintHtml() + '\
            <div class="substitution-empty">\
                <i class="fa-solid fa-circle-info"></i>\
                <p>No suitable alternatives found for <strong>' + escapeHtml(context.originalName) + '</strong> with your current equipment and settings.</p>\
            </div>\
        ';
    } else {
        var html = '';
        html += serverHintHtml();
        html += '<p class="offline-ai-note"><i class="fa-solid fa-wifi"></i> AI unavailable right now (server off or the free AI quota for today is used up) — showing smart offline suggestions instead.</p>';
        html += '<p class="substitution-list-label"><i class="fa-solid fa-wand-magic-sparkles"></i> RECOMMENDED ALTERNATIVES</p>';

        for (var i = 0; i < alternatives.length; i++) {
            var alt = alternatives[i];
            var volume = preserveVolume(context.originalExercise, alt);
            var bestReason = (alt.reasons && alt.reasons[0]) || "Suitable alternative";

            html += '<div class="substitution-alt-card" data-index="' + i + '">';
            html += '  <div class="sub-alt-header">';
            html += '    <div class="sub-alt-rank">' + (i + 1) + '</div>';
            html += '    <div class="sub-alt-title">';
            html += '      <h4>' + escapeHtml(alt.name) + '</h4>';
            html += '      <span class="sub-alt-difficulty ' + alt.difficulty + '">' + alt.difficulty + '</span>';
            html += '    </div>';
            html += '    <div class="sub-alt-score">';
            html += '      <span class="score-value">' + alt.score + '</span>';
            html += '      <span class="score-label">match</span>';
            html += '    </div>';
            html += '  </div>';

            html += '  <div class="sub-alt-tags">';
            html += '    <span class="sub-tag muscle-tag"><i class="fa-solid fa-bullseye"></i> ' + muscleLabels[alt.muscle] + '</span>';
            html += '    <span class="sub-tag pattern-tag"><i class="fa-solid fa-arrows-left-right"></i> ' + (patternLabels[alt.pattern] || alt.pattern) + '</span>';
            html += '    <span class="sub-tag equip-tag"><i class="fa-solid fa-dumbbell"></i> ' + equipmentLabels[alt.equipment] + '</span>';
            html += '  </div>';

            html += '  <div class="sub-alt-volume">';
            html += '    <div class="sub-vol-item"><span class="sub-vol-val">' + volume.sets + '</span><span class="sub-vol-lbl">Sets</span></div>';
            html += '    <div class="sub-vol-item"><span class="sub-vol-val">' + volume.reps + '</span><span class="sub-vol-lbl">Reps</span></div>';
            html += '    <div class="sub-vol-item"><span class="sub-vol-val">' + volume.rest + '</span><span class="sub-vol-lbl">Rest</span></div>';
            html += '  </div>';

            html += '  <div class="sub-alt-instruction">';
            html += '    <i class="fa-solid fa-circle-info"></i>';
            html += '    <span>' + escapeHtml(alt.instruction) + '</span>';
            html += '  </div>';

            html += '  <div class="sub-alt-reason">';
            html += '    <div class="sub-reason-header"><i class="fa-solid fa-wand-magic-sparkles"></i> Why this exercise?</div>';
            html += '    <p>' + escapeHtml(bestReason) + '</p>';
            html += '  </div>';

            html += '  <button class="sub-select-btn" data-index="' + i + '">';
            html += '    <i class="fa-solid fa-check"></i> Select This Exercise';
            html += '  </button>';
            html += '</div>';
        }

        container.innerHTML = html;

        var cards = container.querySelectorAll(".sub-select-btn");
        for (var j = 0; j < cards.length; j++) {
            cards[j].addEventListener("click", function (e) {
                var idx = parseInt(this.dataset.index);
                selectSubstitution(alternatives[idx]);
            });
        }
    }
}

function renderFatalError(context) {
    var container = document.getElementById("subAlternativesList");
    if (!container) return;
    container.innerHTML = serverHintHtml() + '\
        <div class="substitution-empty">\
            <i class="fa-solid fa-circle-exclamation"></i>\
            <p>Something went wrong while loading alternatives for <strong>' + escapeHtml(context.originalName) + '</strong>. Close the window and try again.</p>\
        </div>\
    ';
}

function closeSubstitutionModal() {
    if (substitutionModal) {
        substitutionModal.classList.remove("active");
        document.body.style.overflow = "";
    }
    currentSubstitutionContext = null;
}

function selectSubstitution(alternative) {
    var ctx = currentSubstitutionContext;
    if (!ctx) return;

    var volume = preserveVolume(ctx.originalExercise, alternative);

    var replacement = {
        name: alternative.name,
        sets: volume.sets,
        reps: volume.reps,
        rest: volume.rest,
        _substituted: true,
        _originalName: ctx.originalName
    };

    // Log to history
    logSubstitution(
        ctx.workoutId || "unknown",
        ctx.originalName,
        alternative.name,
        alternative.reasons && alternative.reasons[0] || "Selected by user"
    );

    // Callback to update the workout
    if (typeof ctx.onSelect === "function") {
        ctx.onSelect(replacement);
    }

    closeSubstitutionModal();
}

// =========================================
// UTILITY
// =========================================

function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// =========================================
// PUBLIC API — called from workouts.js / planner.js
// =========================================

function openExerciseSubstitution(options) {
    var exerciseName = options.exerciseName;
    var originalExercise = options.originalExercise;
    var workoutId = options.workoutId || "unknown";
    var userEquipment = options.userEquipment || "full-gym";
    var userLevel = options.userLevel || "intermediate";
    var onSelect = options.onSelect;

    openSubstitutionModal({
        originalName: exerciseName,
        originalExercise: originalExercise,
        workoutId: workoutId,
        userEquipment: userEquipment,
        userLevel: userLevel,
        onSelect: onSelect
    });
}

function getUserEquipment() {
    try {
        var planData = JSON.parse(localStorage.getItem("vivafitWorkoutPlan"));
        if (planData && planData.settings && planData.settings.equipment) {
            return planData.settings.equipment;
        }
    } catch (e) {}
    return "full-gym";
}

function getUserLevel() {
    try {
        var planData = JSON.parse(localStorage.getItem("vivafitWorkoutPlan"));
        if (planData && planData.settings && planData.settings.level) {
            return planData.settings.level;
        }
    } catch (e) {}
    try {
        var profile = JSON.parse(localStorage.getItem("vivafitProfile"));
        if (profile && profile.goal) {
            return "intermediate";
        }
    } catch (e) {}
    return "intermediate";
}
