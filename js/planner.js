// =========================================
// AI WORKOUT PLANNER
// =========================================

const PLANNER_STORAGE_KEY = "vivafitWorkoutPlan";

// =========================================
// EXERCISE DATABASE
// =========================================

const exerciseDB = {

    chest: {
        fullGym: [
            { name: "Barbell Bench Press", instruction: "Lie on bench, grip bar slightly wider than shoulders. Lower to chest, press up powerfully." },
            { name: "Incline Dumbbell Press", instruction: "Set bench to 30-45 degrees. Press dumbbells up from chest level." },
            { name: "Cable Flyes", instruction: "Set cables high. Bring handles together in front of chest with slight elbow bend." },
            { name: "Dumbbell Bench Press", instruction: "Lie flat, press dumbbells up from chest, squeeze at the top." },
            { name: "Machine Chest Press", instruction: "Adjust seat height, press handles forward from chest level." },
            { name: "Decline Bench Press", instruction: "Set bench to decline angle. Lower bar to lower chest, press up." }
        ],
        homeGym: [
            { name: "Dumbbell Bench Press", instruction: "Lie on bench or floor, press dumbbells up from chest." },
            { name: "Incline Push-Ups", instruction: "Hands on elevated surface. Lower chest toward edge, push back up." },
            { name: "Dumbbell Flyes", instruction: "Lie flat, lower dumbbells out to sides with slight elbow bend, squeeze back up." },
            { name: "Push-Up Variations", instruction: "Standard, wide, or diamond push-ups. Keep core tight throughout." },
            { name: "Floor Press", instruction: "Lie on floor, press dumbbells up. Floor limits range of motion for tricep focus." }
        ],
        bodyweight: [
            { name: "Push-Ups", instruction: "Hands shoulder-width, lower chest to floor, push back up. Keep body straight." },
            { name: "Wide Push-Ups", instruction: "Hands wider than shoulders. Emphasizes outer chest. Lower slowly." },
            { name: "Diamond Push-Ups", instruction: "Hands together forming diamond shape. Targets inner chest and triceps." },
            { name: "Decline Push-Ups", instruction: "Feet elevated on chair or step. Increases difficulty and upper chest focus." },
            { name: "Archer Push-Ups", instruction: "Wide stance, lower to one side while other arm extends. Advanced unilateral work." }
        ],
        minimal: [
            { name: "Resistance Band Chest Press", instruction: "Anchor band behind back, press forward. Squeeze chest at peak." },
            { name: "Resistance Band Flyes", instruction: "Anchor band at chest height, bring hands together in front." },
            { name: "Push-Ups", instruction: "Standard push-ups with controlled tempo. 3 seconds down, 1 second up." },
            { name: "Close-Grip Push-Ups", instruction: "Hands close together, elbows tucked. Focus on inner chest and triceps." },
            { name: "Plyometric Push-Ups", instruction: "Explosive push-ups with hands leaving the ground. Advanced power builder." }
        ]
    },

    back: {
        fullGym: [
            { name: "Barbell Deadlift", instruction: "Feet hip-width, grip bar just outside knees. Drive through heels, keep bar close." },
            { name: "Pull-Ups", instruction: "Grip bar overhand, wider than shoulders. Pull chin over bar, lower with control." },
            { name: "Barbell Row", instruction: "Hinge at hips, grip bar overhand. Pull to lower chest, squeeze shoulder blades." },
            { name: "Seated Cable Row", instruction: "Sit upright, pull handle to abdomen. Squeeze back muscles, don't lean back." },
            { name: "Lat Pulldown", instruction: "Grip bar wide, pull to upper chest. Focus on lats, not arms." },
            { name: "T-Bar Row", instruction: "Straddle bar, grip handles. Pull to chest keeping back flat." }
        ],
        homeGym: [
            { name: "Dumbbell Bent-Over Row", instruction: "Hinge at hips, pull dumbbell to hip. Squeeze shoulder blade at top." },
            { name: "Pull-Up Bar Rows", instruction: "Use pull-up bar for inverted rows. Body at angle, pull chest to bar." },
            { name: "Single-Arm Dumbbell Row", instruction: "Knee on bench, pull dumbbell to hip. Full range of motion." },
            { name: "Resistance Band Pulldown", instruction: "Anchor band overhead, kneel and pull to chest." },
            { name: "Reverse Flyes", instruction: "Bend forward, raise dumbbells out to sides. Targets rear delts and upper back." }
        ],
        bodyweight: [
            { name: "Pull-Ups", instruction: "Overhand grip, pull chin over bar. Use band for assistance if needed." },
            { name: "Chin-Ups", instruction: "Underhand grip, pull chin over bar. More bicep involvement." },
            { name: "Inverted Rows", instruction: "Lie under sturdy table or bar, pull chest to edge. Adjust difficulty with foot position." },
            { name: "Superman Hold", instruction: "Lie face down, lift arms and legs off ground. Hold for time. Targets lower back." },
            { name: "Doorframe Rows", instruction: "Grip doorframe edges, lean back, pull yourself forward. Control the movement." }
        ],
        minimal: [
            { name: "Resistance Band Lat Pulldown", instruction: "Anchor band high, kneel and pull to chest. Squeeze lats." },
            { name: "Resistance Band Rows", instruction: "Anchor band at waist height, pull to torso. Keep shoulders down." },
            { name: "Inverted Rows (Table)", instruction: "Lie under table, grip edges, pull chest to tabletop." },
            { name: "Towel Rows", instruction: "Loop towel over door, grip both ends, lean back and row." },
            { name: "Back Extensions", instruction: "Lie face down, hands behind head. Lift chest off floor using lower back." }
        ]
    },

    shoulders: {
        fullGym: [
            { name: "Overhead Press", instruction: "Stand with bar at shoulder height. Press overhead to lockout. Core tight." },
            { name: "Dumbbell Lateral Raises", instruction: "Raise dumbbells out to sides until parallel with floor. Control the descent." },
            { name: "Arnold Press", instruction: "Start with palms facing you, rotate and press overhead. Full rotation at top." },
            { name: "Face Pulls", instruction: "Set cable at face height, pull rope to face. Squeeze rear delts." },
            { name: "Upright Row", instruction: "Pull barbell up to chin level. Keep elbows higher than wrists." },
            { name: "Rear Delt Flyes", instruction: "Bend forward, raise dumbbells out to sides. Focus on rear delts." }
        ],
        homeGym: [
            { name: "Dumbbell Overhead Press", instruction: "Sit or stand, press dumbbells overhead. Full lockout at top." },
            { name: "Dumbbell Lateral Raises", instruction: "Raise to shoulder height, slight lean forward. Control the negative." },
            { name: "Dumbbell Front Raises", instruction: "Alternate raising dumbbells to eye level. Don't swing or use momentum." },
            { name: "Pike Push-Ups", instruction: "Inverted V position, lower head toward floor. Targets shoulders heavily." },
            { name: "Dumbbell Rear Delt Flyes", instruction: "Bend forward, raise dumbbells laterally. Squeeze at the top." }
        ],
        bodyweight: [
            { name: "Pike Push-Ups", instruction: "Feet on elevated surface, hands on floor. Lower head to ground, push up." },
            { name: "Handstand Hold", instruction: "Against wall. Hold handstand position. Builds shoulder stability and strength." },
            { name: "Handstand Push-Ups", instruction: "Against wall, lower head to floor and push back up. Advanced movement." },
            { name: "Plank to Downward Dog", instruction: "Start in plank, push hips up and back. Alternates between positions." },
            { name: "Lateral Raises (Isometric)", instruction: "Hold arms at shoulder height with tension. Hold for time intervals." }
        ],
        minimal: [
            { name: "Resistance Band Overhead Press", instruction: "Stand on band, press handles overhead. Full extension at top." },
            { name: "Resistance Band Lateral Raises", instruction: "Stand on band, raise handles to sides. Control the movement." },
            { name: "Pike Push-Ups", instruction: "Elevate feet, lower head toward floor. Great shoulder bodyweight builder." },
            { name: "Resistance Band Front Raises", instruction: "Stand on band, raise handles to front. Alternate arms or together." },
            { name: "Band Pull-Aparts", instruction: "Hold band at chest height, pull apart until arms are straight. Rear delts." }
        ]
    },

    arms: {
        fullGym: [
            { name: "Barbell Curls", instruction: "Stand with bar, curl up squeezing biceps. Don't swing the weight." },
            { name: "Skull Crushers", instruction: "Lie on bench, lower EZ bar to forehead. Extend arms using triceps." },
            { name: "Hammer Curls", instruction: "Curl dumbbells with neutral grip. Targets brachialis and forearms." },
            { name: "Tricep Pushdowns", instruction: "Push cable bar down to full extension. Squeeze triceps at bottom." },
            { name: "Preacher Curls", instruction: "Arms on preacher pad, curl up. Eliminates cheating, isolates biceps." },
            { name: "Overhead Tricep Extension", instruction: "Hold dumbbell overhead, lower behind head. Extend using triceps." }
        ],
        homeGym: [
            { name: "Dumbbell Bicep Curls", instruction: "Curl dumbbells up, supinate at the top. Control the negative." },
            { name: "Dumbbell Skull Crushers", instruction: "Lie on bench, lower dumbbells to temples. Extend using triceps." },
            { name: "Concentration Curls", instruction: "Elbow on inner thigh, curl dumbbell. Full contraction at top." },
            { name: "Tricep Kickbacks", instruction: "Hinge forward, extend dumbbell behind you. Squeeze tricep at lockout." },
            { name: "Hammer Curls", instruction: "Neutral grip curls. Great for overall arm development and grip." }
        ],
        bodyweight: [
            { name: "Diamond Push-Ups", instruction: "Hands together forming diamond. Elbows close to body for tricep focus." },
            { name: "Chin-Ups (Close Grip)", instruction: "Underhand grip, shoulder width. Pull chin over bar." },
            { name: "Bicep Curl Isometric", instruction: "Press palm against other hand, create resistance. Hold for time." },
            { name: "Tricep Dips", instruction: "Hands on chair or bench edge, lower body and push back up." },
            { name: "Plank Up-Downs", instruction: "Alternate from plank on hands to elbows. Tricep and core work." }
        ],
        minimal: [
            { name: "Resistance Band Curls", instruction: "Stand on band, curl handles up. Squeeze at the top." },
            { name: "Resistance Band Pushdowns", instruction: "Anchor band high, push down to full extension." },
            { name: "Resistance Band Hammer Curls", instruction: "Neutral grip band curls. Focus on contraction." },
            { name: "Towel Bicep Curls", instruction: "Step on towel, curl up with both hands. Self-resistance exercise." },
            { name: "Tricep Dips (Chair)", instruction: "Hands on chair edge, lower and push up. Feet further = harder." }
        ]
    },

    legs: {
        fullGym: [
            { name: "Barbell Back Squat", instruction: "Bar on upper back, squat to parallel or below. Drive through heels." },
            { name: "Romanian Deadlift", instruction: "Hold bar at hip level, hinge forward lowering bar along legs. Feel hamstring stretch." },
            { name: "Leg Press", instruction: "Feet shoulder-width on platform, lower weight, press up. Don't lock knees." },
            { name: "Walking Lunges", instruction: "Step forward into lunge, back knee nearly touches ground. Alternate legs." },
            { name: "Leg Curl", instruction: "Lie face down, curl weight toward glutes. Squeeze hamstrings." },
            { name: "Leg Extension", instruction: "Sit upright, extend legs to lockout. Squeeze quads at top." },
            { name: "Hack Squat", instruction: "Shoulders under pads, squat down, press up. Good quad isolation." }
        ],
        homeGym: [
            { name: "Dumbbell Goblet Squat", instruction: "Hold dumbbell at chest, squat deep. Keep chest up and knees tracking toes." },
            { name: "Dumbbell Romanian Deadlift", instruction: "Hold dumbbells at sides, hinge at hips. Feel stretch in hamstrings." },
            { name: "Bulgarian Split Squat", instruction: "Rear foot on bench, lunge down. Excellent for single-leg strength." },
            { name: "Dumbbell Lunges", instruction: "Hold dumbbells, step forward into lunge. Alternate legs each rep." },
            { name: "Step-Ups", instruction: "Step onto bench or box with one leg, drive knee up. Alternate legs." }
        ],
        bodyweight: [
            { name: "Bodyweight Squats", instruction: "Feet shoulder-width, squat to parallel. Keep chest up, weight in heels." },
            { name: "Bulgarian Split Squat", instruction: "Rear foot elevated, lunge down. Bodyweight only is still challenging." },
            { name: "Walking Lunges", instruction: "Step into lunge, alternate legs. Great for quads and glutes." },
            { name: "Jump Squats", instruction: "Squat down, explode up into jump. Land softly. Power and cardio." },
            { name: "Wall Sit", instruction: "Back against wall, thighs parallel to floor. Hold for time." }
        ],
        minimal: [
            { name: "Resistance Band Squats", instruction: "Stand on band, hold handles at shoulders. Squat and stand." },
            { name: "Resistance Band Leg Curls", instruction: "Anchor band low, curl toward glutes. Squeeze hamstrings." },
            { name: "Bulgarian Split Squat", instruction: "Rear foot on chair, lunge down. Add band for more resistance." },
            { name: "Band Walks", instruction: "Band around ankles, walk sideways. Targets glute medius." },
            { name: "Single-Leg Deadlift", instruction: "Stand on one leg, hinge forward. Hold dumbbell or band for resistance." }
        ]
    },

    glutes: {
        fullGym: [
            { name: "Barbell Hip Thrust", instruction: "Upper back on bench, bar on hips. Drive hips up, squeeze glutes at top." },
            { name: "Cable Pull-Through", instruction: "Face away from cable, hinge at hips, thrust forward. Squeeze glutes." },
            { name: "Sumo Deadlift", instruction: "Wide stance, toes out. Grip bar between legs. Drive hips forward." },
            { name: "Glute Kickbacks (Cable)", instruction: "Ankle cuff on low cable, kick back and up. Squeeze at top." },
            { name: "Bulgarian Split Squat", instruction: "Rear foot elevated, deep lunge. Glute-dominant when leaning forward slightly." }
        ],
        homeGym: [
            { name: "Dumbbell Hip Thrust", instruction: "Upper back on bench, dumbbell on hips. Drive up, squeeze glutes." },
            { name: "Dumbbell Sumo Squat", instruction: "Wide stance, toes out, dumbbell between legs. Deep squat, squeeze glutes." },
            { name: "Single-Leg Hip Thrust", instruction: "One foot on bench, drive hips up. Unilateral glute builder." },
            { name: "Dumbbell Romanian Deadlift", instruction: "Hinge at hips, dumbbells along legs. Feel deep glute and hamstring stretch." },
            { name: "Frog Pumps", instruction: "Lie on back, soles of feet together, knees out. Bridge up and squeeze." }
        ],
        bodyweight: [
            { name: "Glute Bridge", instruction: "Lie on back, feet flat, drive hips up. Squeeze glutes hard at top." },
            { name: "Single-Leg Glute Bridge", instruction: "One foot flat, other leg extended. Drive up with working leg." },
            { name: "Donkey Kicks", instruction: "On all fours, kick one leg back and up. Squeeze glute at top." },
            { name: "Fire Hydrants", instruction: "On all fours, lift knee out to side. Targets glute medius." },
            { name: "Bulgarian Split Squat", instruction: "Rear foot elevated, deep lunge. Bodyweight glute builder." }
        ],
        minimal: [
            { name: "Resistance Band Hip Thrust", instruction: "Band across hips, upper back on bench. Drive up against band." },
            { name: "Band Pull-Through", instruction: "Band anchored low, hinge at hips, thrust forward. Squeeze at top." },
            { name: "Band Squats (Wide Stance)", instruction: "Wide stance on band, squat deep. Emphasize glutes." },
            { name: "Band Clamshells", instruction: "Band above knees, lie on side, open knees. Glute medius isolation." },
            { name: "Single-Leg Glute Bridge", instruction: "Band above knees, one foot flat. Drive hips up with band tension." }
        ]
    },

    core: {
        fullGym: [
            { name: "Cable Crunches", instruction: "Kneel facing cable, crunch down bringing elbows to knees. Squeeze abs." },
            { name: "Hanging Leg Raises", instruction: "Hang from bar, raise legs to parallel or higher. Control the descent." },
            { name: "Ab Rollout", instruction: "Kneel with ab wheel, roll forward as far as possible. Pull back using core." },
            { name: "Cable Woodchops", instruction: "Set cable high, pull diagonally across body. Rotate through core." },
            { name: "Weighted Plank", instruction: "Standard plank position with weight on back. Hold for time." }
        ],
        homeGym: [
            { name: "Hanging Knee Raises", instruction: "Hang from pull-up bar, raise knees to chest. Control the movement." },
            { name: "Dumbbell Side Bends", instruction: "Hold dumbbell in one hand, bend sideways. Targets obliques." },
            { name: "Dead Bug", instruction: "Lie on back, extend opposite arm and leg. Keep lower back pressed down." },
            { name: "Mountain Climbers", instruction: "Plank position, drive knees to chest alternating. Keep hips low." },
            { name: "Flutter Kicks", instruction: "Lie on back, legs extended. Alternate small kicks up and down." }
        ],
        bodyweight: [
            { name: "Plank", instruction: "Forearms on ground, body straight. Hold for time. Don't let hips sag." },
            { name: "Bicycle Crunches", instruction: "Lie on back, alternate elbow to opposite knee. Full rotation." },
            { name: "Leg Raises", instruction: "Lie on back, raise legs to 90 degrees. Lower slowly without touching floor." },
            { name: "Mountain Climbers", instruction: "Plank position, drive knees to chest rapidly. Cardio and core." },
            { name: "Russian Twists", instruction: "Sit with knees bent, lean back slightly. Rotate torso side to side." }
        ],
        minimal: [
            { name: "Resistance Band Pallof Press", instruction: "Anchor band at chest height, press forward. Resist rotation." },
            { name: "Band Crunches", instruction: "Kneel on band, crunch down. Resistance through full range." },
            { name: "Plank", instruction: "Standard plank with band around wrists for added tension." },
            { name: "Band Woodchops", instruction: "Anchor band high, pull diagonally across body. Core rotation work." },
            { name: "Dead Bug (Band)", instruction: "Band around hands and knees, extend opposite limbs against resistance." }
        ]
    },

    calves: {
        fullGym: [
            { name: "Standing Calf Raise", instruction: "Shoulders under pads, raise up on toes. Hold peak, lower slowly." },
            { name: "Seated Calf Raise", instruction: "Sit with knees under pad, raise heels. Targets soleus." },
            { name: "Donkey Calf Raise", instruction: "Bend forward at hips, raise on toes. Deep stretch at bottom." },
            { name: "Leg Press Calf Raise", instruction: "Toes on edge of leg press platform, press through toes." },
            { name: "Smith Machine Calf Raise", instruction: "Bar on shoulders, raise on toes. Good for heavy loading." }
        ],
        homeGym: [
            { name: "Dumbbell Calf Raises", instruction: "Hold dumbbells, raise up on toes. Slow negative for growth." },
            { name: "Single-Leg Calf Raise", instruction: "Stand on one leg on edge of step. Raise and lower with control." },
            { name: "Step Calf Raises", instruction: "Toes on step edge, lower heel below step, raise up. Full range." },
            { name: "Seated Calf Raises", instruction: "Sit on chair, dumbbell on knee, raise heel. Targets soleus." },
            { name: "Jump Rope", instruction: "Bounce on balls of feet. Cardio and calf endurance builder." }
        ],
        bodyweight: [
            { name: "Standing Calf Raises", instruction: "Raise up on toes, hold 2 seconds at top. Slow and controlled." },
            { name: "Single-Leg Calf Raises", instruction: "One leg at a time on step edge. Full range of motion." },
            { name: "Donkey Calf Raises", instruction: "Bend forward, raise on toes. Great stretch and contraction." },
            { name: "Jump Rope", instruction: "Stay on balls of feet. Continuous bouncing builds calf endurance." },
            { name: "Box Jumps", instruction: "Explosive jump onto box. Landing absorbs through calves." }
        ],
        minimal: [
            { name: "Resistance Band Calf Raises", instruction: "Stand on band, raise up on toes against resistance." },
            { name: "Single-Leg Calf Raise", instruction: "On step edge, one leg. Full range. Band adds resistance." },
            { name: "Jump Rope", instruction: "Bounce on toes continuously. Excellent calf endurance builder." },
            { name: "Towel Calf Stretch", instruction: "Loop towel around foot, pull toward you. Hold stretch for flexibility." },
            { name: "Wall Calf Raises", instruction: "Hands on wall for balance, raise on toes. Slow tempo work." }
        ]
    }
};


// =========================================
// WORKOUT SPLIT TEMPLATES
// =========================================

const splitTemplates = {

    2: [
        { day: "Day 1", focus: ["chest", "back", "shoulders", "core"], name: "Upper Body" },
        { day: "Rest", focus: [] },
        { day: "Day 2", focus: ["legs", "glutes", "calves", "core"], name: "Lower Body" },
        { day: "Rest", focus: [] },
        { day: "Rest", focus: [] },
        { day: "Rest", focus: [] },
        { day: "Rest", focus: [] }
    ],

    3: [
        { day: "Day 1", focus: ["chest", "shoulders", "arms"], name: "Push" },
        { day: "Rest", focus: [] },
        { day: "Day 2", focus: ["back", "arms"], name: "Pull" },
        { day: "Rest", focus: [] },
        { day: "Day 3", focus: ["legs", "glutes", "core"], name: "Legs" },
        { day: "Rest", focus: [] },
        { day: "Rest", focus: [] }
    ],

    4: [
        { day: "Day 1", focus: ["chest", "shoulders"], name: "Upper Push" },
        { day: "Day 2", focus: ["back", "arms"], name: "Upper Pull" },
        { day: "Rest", focus: [] },
        { day: "Day 3", focus: ["legs", "glutes"], name: "Lower Body" },
        { day: "Day 4", focus: ["chest", "back", "core"], name: "Full Body" },
        { day: "Rest", focus: [] },
        { day: "Rest", focus: [] }
    ],

    5: [
        { day: "Day 1", focus: ["chest"], name: "Chest Day" },
        { day: "Day 2", focus: ["back"], name: "Back Day" },
        { day: "Day 3", focus: ["shoulders", "arms"], name: "Shoulders & Arms" },
        { day: "Rest", focus: [] },
        { day: "Day 4", focus: ["legs", "glutes"], name: "Leg Day" },
        { day: "Day 5", focus: ["core", "calves"], name: "Core & Calves" },
        { day: "Rest", focus: [] }
    ],

    6: [
        { day: "Day 1", focus: ["chest", "shoulders"], name: "Push" },
        { day: "Day 2", focus: ["back", "arms"], name: "Pull" },
        { day: "Day 3", focus: ["legs", "glutes", "core"], name: "Legs" },
        { day: "Day 4", focus: ["chest", "shoulders"], name: "Push" },
        { day: "Day 5", focus: ["back", "arms"], name: "Pull" },
        { day: "Day 6", focus: ["legs", "glutes", "core"], name: "Legs" },
        { day: "Rest", focus: [] }
    ]
};


// =========================================
// PARAMETERS
// =========================================

const levelParams = {
    beginner: { sets: [2, 3], reps: "12-15", rest: "60s", exercisesPerMuscle: 1 },
    intermediate: { sets: [3, 4], reps: "8-12", rest: "90s", exercisesPerMuscle: 2 },
    advanced: { sets: [4, 5], reps: "6-10", rest: "120s", exercisesPerMuscle: 2 }
};

const goalParams = {
    "build-muscle": { volumeMod: 1, intensityMod: "hypertrophy" },
    "lose-weight": { volumeMod: 0.8, intensityMod: "endurance" },
    "strength": { volumeMod: 0.7, intensityMod: "strength" },
    "endurance": { volumeMod: 1.2, intensityMod: "endurance" },
    "general-fitness": { volumeMod: 1, intensityMod: "balanced" }
};

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const muscleIcons = {
    chest: "fa-solid fa-heart",
    back: "fa-solid fa-arrows-up-down",
    shoulders: "fa-solid fa-person",
    arms: "fa-solid fa-hand-fist",
    legs: "fa-solid fa-shoe-prints",
    glutes: "fa-solid fa-person-running",
    core: "fa-solid fa-circle-dot",
    calves: "fa-solid fa-shoe-prints"
};


// =========================================
// STATE
// =========================================

let selectedEquipment = "full-gym";
let selectedMuscles = ["chest", "back", "shoulders", "arms", "legs", "glutes", "core"];
let currentPlan = null;
let exerciseModal = null;


// =========================================
// DOM REFERENCES
// =========================================

const planResult = document.getElementById("planResult");
const planDaysContainer = document.getElementById("planDaysContainer");
const generateBtn = document.getElementById("generatePlanBtn");
const savePlanBtn = document.getElementById("savePlanBtn");
const regenerateBtn = document.getElementById("regeneratePlanBtn");
const exportBtn = document.getElementById("exportPlanBtn");
const summaryDays = document.getElementById("summaryDays");
const summaryExercises = document.getElementById("summaryExercises");
const summaryDuration = document.getElementById("summaryDuration");
const savedPlansContainer = document.getElementById("savedPlansContainer");
const plannerMessage = document.getElementById("plannerMessage");
const selectAllMusclesBtn = document.getElementById("selectAllMuscles");
const clearAllMusclesBtn = document.getElementById("clearAllMuscles");


// =========================================
// MUSCLE CHIPS
// =========================================

document.getElementById("muscleChipGroup").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip || chip.id === "selectAllMuscles" || chip.id === "clearAllMuscles") return;

    chip.classList.toggle("active");
    selectedMuscles = Array.from(document.querySelectorAll("#muscleChipGroup .chip.active"))
        .map(c => c.dataset.muscle);
});

selectAllMusclesBtn.addEventListener("click", () => {
    document.querySelectorAll("#muscleChipGroup .chip[data-muscle]").forEach(c => c.classList.add("active"));
    selectedMuscles = ["chest", "back", "shoulders", "arms", "legs", "glutes", "core"];
});

clearAllMusclesBtn.addEventListener("click", () => {
    document.querySelectorAll("#muscleChipGroup .chip[data-muscle]").forEach(c => c.classList.remove("active"));
    selectedMuscles = [];
});


// =========================================
// EXERCISE MODAL
// =========================================

function createExerciseModal() {
    const overlay = document.createElement("div");
    overlay.className = "exercise-modal-overlay";
    overlay.id = "exerciseModal";
    overlay.innerHTML = `
        <div class="exercise-modal-card">
            <div class="exercise-modal-header">
                <h3 id="exModalName">Exercise</h3>
                <button class="exercise-modal-close" id="exModalClose">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="exercise-modal-muscle" id="exModalMuscle">Chest</div>
            <div class="exercise-modal-stats">
                <div class="exercise-modal-stat">
                    <span class="stat-val" id="exModalSets">4</span>
                    <span class="stat-label">Sets</span>
                </div>
                <div class="exercise-modal-stat">
                    <span class="stat-val" id="exModalReps">10</span>
                    <span class="stat-label">Reps</span>
                </div>
                <div class="exercise-modal-stat">
                    <span class="stat-val" id="exModalRest">90s</span>
                    <span class="stat-label">Rest</span>
                </div>
            </div>
            <div class="exercise-modal-instructions">
                <p>Instructions</p>
                <p id="exModalInstruction">How to perform this exercise.</p>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeExerciseModal();
    });

    overlay.querySelector("#exModalClose").addEventListener("click", closeExerciseModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeExerciseModal();
    });

    return overlay;
}

function openExerciseModal(exercise, muscle, sets, reps, rest) {
    if (!exerciseModal) exerciseModal = createExerciseModal();

    document.getElementById("exModalName").textContent = exercise.name;
    document.getElementById("exModalMuscle").textContent = muscle.charAt(0).toUpperCase() + muscle.slice(1);
    document.getElementById("exModalSets").textContent = sets;
    document.getElementById("exModalReps").textContent = reps;
    document.getElementById("exModalRest").textContent = rest;
    document.getElementById("exModalInstruction").textContent = exercise.instruction;

    exerciseModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeExerciseModal() {
    if (exerciseModal) {
        exerciseModal.classList.remove("active");
        document.body.style.overflow = "";
    }
}


// =========================================
// PLAN GENERATION ENGINE
// =========================================

function generatePlan() {
    const goal = document.getElementById("planGoal").value;
    const level = document.getElementById("planLevel").value;
    const experience = document.getElementById("planExperience").value;
    const daysPerWeek = parseInt(document.getElementById("planDays").value);
    const duration = parseInt(document.getElementById("planDuration").value);
    const equipment = document.getElementById("planEquipment").value;

    if (!goal || !level || !daysPerWeek || !duration) {
        plannerMessage.textContent = "Please fill in all required fields.";
        plannerMessage.style.color = "#ff4a60";
        return;
    }

    if (selectedMuscles.length === 0) {
        plannerMessage.textContent = "Please select at least one target muscle group.";
        plannerMessage.style.color = "#ff4a60";
        return;
    }

    plannerMessage.textContent = "";

    if (equipment) {
        selectedEquipment = equipment;
    }

    const params = levelParams[level];
    const goalParam = goalParams[goal];
    const split = splitTemplates[daysPerWeek];

    const plan = [];

    split.forEach((slot, i) => {
        if (slot.day === "Rest") {
            plan.push({
                dayNumber: i + 1,
                dayName: dayNames[i],
                isRestDay: true,
                name: "Rest Day",
                focus: [],
                exercises: []
            });
            return;
        }

        const focusMuscles = slot.focus.filter(m => selectedMuscles.includes(m));

        if (focusMuscles.length === 0) {
            plan.push({
                dayNumber: i + 1,
                dayName: dayNames[i],
                isRestDay: true,
                name: "Active Recovery",
                focus: [],
                exercises: []
            });
            return;
        }

        const exercises = [];
        const exercisesPerMuscle = params.exercisesPerMuscle;

        focusMuscles.forEach(muscle => {
            const pool = exerciseDB[muscle]?.[selectedEquipment] || [];
            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            const count = Math.min(exercisesPerMuscle, shuffled.length);

            for (let j = 0; j < count; j++) {
                const ex = shuffled[j];
                let sets = randomBetween(params.sets[0], params.sets[1]);
                let reps = params.reps;
                let rest = params.rest;

                if (goalParam.intensityMod === "strength") {
                    sets = Math.min(sets + 1, 6);
                    reps = "5-8";
                    rest = "120-180s";
                } else if (goalParam.intensityMod === "endurance") {
                    sets = Math.max(sets - 1, 2);
                    reps = "15-20";
                    rest = "30-45s";
                }

                exercises.push({
                    name: ex.name,
                    muscle: muscle,
                    sets: sets,
                    reps: reps,
                    rest: rest,
                    instruction: ex.instruction
                });
            }
        });

        const totalSets = exercises.reduce((sum, e) => sum + e.sets, 0);
        const estimatedTime = Math.round(totalSets * 2.5 + exercises.length * 1.5);

        plan.push({
            dayNumber: i + 1,
            dayName: dayNames[i],
            isRestDay: false,
            name: slot.name,
            focus: focusMuscles,
            exercises: exercises,
            estimatedTime: estimatedTime,
            totalSets: totalSets
        });
    });

    return plan;
}


function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// =========================================
// RENDER PLAN
// =========================================

function renderPlan(plan) {
    currentPlan = plan;

    const goal = document.getElementById("planGoal").value;
    const level = document.getElementById("planLevel").value;
    const daysPerWeek = document.getElementById("planDays").value;
    const duration = document.getElementById("planDuration").value;

    const goalLabels = {
        "build-muscle": "Build Muscle",
        "lose-weight": "Lose Weight",
        "stay-fit": "Stay Fit",
        "improve-fitness": "Improve Fitness"
    };

    const levelLabels = {
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced"
    };

    const equipLabels = {
        "full-gym": "Full Gym",
        "home-gym": "Home Gym",
        bodyweight: "Bodyweight",
        "dumbbells": "Dumbbells",
        "barbell": "Barbell & Dumbbells",
        "none": "No Equipment",
        minimal: "Minimal Equipment"
    };

    const totalExercises = plan.filter(d => !d.isRestDay).reduce((sum, d) => sum + d.exercises.length, 0);
    const totalSets = plan.filter(d => !d.isRestDay).reduce((sum, d) => sum + d.totalSets, 0);
    const trainingDays = plan.filter(d => !d.isRestDay).length;

    summaryDays.textContent = trainingDays;
    summaryExercises.textContent = totalExercises;
    summaryDuration.textContent = duration + " min";

    planDaysContainer.innerHTML = "";

    plan.forEach((slot, idx) => {
        const card = document.createElement("div");
        card.className = "training-day-card";

        if (slot.isRestDay) {
            card.innerHTML = `
                <div class="day-header">
                    <div class="day-header-left">
                        <div class="day-number">${slot.dayNumber}</div>
                        <div>
                            <h3>${slot.dayName} — ${slot.name}</h3>
                            <p>Rest and recover. Your muscles grow during recovery.</p>
                        </div>
                    </div>
                </div>
                <div class="rest-day-content">
                    <i class="fa-solid fa-bed"></i>
                    <h4>Recovery Day</h4>
                    <p>Stay hydrated, eat well, and get quality sleep.</p>
                </div>
            `;
        } else {
            const focusStr = slot.focus.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(", ");

            let tableRows = "";
            slot.exercises.forEach((ex, j) => {
                tableRows += `
                    <tr class="exercise-row" data-exercise='${JSON.stringify(ex).replace(/'/g, "&#39;")}' data-day-index="${idx}" data-ex-index="${j}">
                        <td>
                            <div class="exercise-name-cell">
                                <span class="exercise-num">${j + 1}</span>
                                <div>
                                    <div class="exercise-name-text">${ex.name}</div>
                                    <div class="exercise-instruction">${ex.instruction.substring(0, 80)}${ex.instruction.length > 80 ? "..." : ""}</div>
                                </div>
                            </div>
                        </td>
                        <td><span class="muscle-tag">${ex.muscle.charAt(0).toUpperCase() + ex.muscle.slice(1)}</span></td>
                        <td><span class="exercise-stat">${ex.sets} sets</span></td>
                        <td><span class="exercise-stat">${ex.reps}</span></td>
                        <td><span class="rest-badge">${ex.rest}</span></td>
                        <td><button class="planner-replace-btn" data-day-index="${idx}" data-ex-index="${j}"><i class="fa-solid fa-shuffle"></i> Replace</button></td>
                    </tr>
                `;
            });

            card.innerHTML = `
                <div class="day-header">
                    <div class="day-header-left">
                        <div class="day-number">${slot.dayNumber}</div>
                        <div>
                            <h3>${slot.dayName} — ${slot.name}</h3>
                            <p>${focusStr}</p>
                        </div>
                    </div>
                    <div class="day-meta">
                        <span>
                            <i class="fa-solid fa-dumbbell"></i>
                            ${slot.exercises.length} exercises
                        </span>
                        <span>
                            <i class="fa-solid fa-layer-group"></i>
                            ${slot.totalSets} sets
                        </span>
                        <span>
                            <i class="fa-regular fa-clock"></i>
                            ~${slot.estimatedTime} min
                        </span>
                    </div>
                </div>
                <table class="exercise-table">
                    <thead>
                        <tr>
                            <th>Exercise</th>
                            <th>Muscle</th>
                            <th>Sets</th>
                            <th>Reps</th>
                            <th>Rest</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
        }

        planDaysContainer.appendChild(card);

        if (!slot.isRestDay) {
            card.querySelectorAll(".exercise-row").forEach(row => {
                row.style.cursor = "pointer";
                row.addEventListener("click", (e) => {
                    if (e.target.closest(".planner-replace-btn")) return;
                    try {
                        const exData = JSON.parse(row.dataset.exercise);
                        openExerciseModal(
                            { name: exData.name, instruction: exData.instruction },
                            exData.muscle,
                            exData.sets,
                            exData.reps,
                            exData.rest
                        );
                    } catch (e) {}
                });
            });

            card.querySelectorAll(".planner-replace-btn").forEach(btn => {
                btn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    var dayIdx = parseInt(this.dataset.dayIndex);
                    var exIdx = parseInt(this.dataset.exIndex);
                    if (!currentPlan || !currentPlan[dayIdx]) return;
                    var ex = currentPlan[dayIdx].exercises[exIdx];
                    if (!ex || typeof openExerciseSubstitution === "undefined") return;

                    openExerciseSubstitution({
                        exerciseName: ex.name,
                        originalExercise: ex,
                        workoutId: "planner-day-" + dayIdx,
                        userEquipment: selectedEquipment,
                        userLevel: document.getElementById("planLevel") ? document.getElementById("planLevel").value : "intermediate",
                        onSelect: function (replacement) {
                            currentPlan[dayIdx].exercises[exIdx] = {
                                name: replacement.name,
                                muscle: ex.muscle,
                                sets: replacement.sets,
                                reps: replacement.reps,
                                rest: replacement.rest,
                                instruction: ex.instruction
                            };
                            renderPlan(currentPlan);
                        }
                    });
                });
            });
        }
    });
}


// =========================================
// SAVE / LOAD PLAN
// =========================================

function savePlan() {
    if (!currentPlan) return;

    const goal = document.getElementById("planGoal").value;
    const level = document.getElementById("planLevel").value;
    const daysPerWeek = document.getElementById("planDays").value;
    const duration = document.getElementById("planDuration").value;

    const planData = {
        plan: currentPlan,
        settings: {
            goal,
            level,
            daysPerWeek: parseInt(daysPerWeek),
            duration: parseInt(duration),
            equipment: selectedEquipment,
            muscles: [...selectedMuscles]
        },
        savedAt: new Date().toISOString()
    };

    localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(planData));

    savePlanBtn.classList.add("saved");
    savePlanBtn.innerHTML = '<i class="fa-solid fa-check"></i> Plan Saved';
}

function loadSavedPlan() {
    try {
        const data = JSON.parse(localStorage.getItem(PLANNER_STORAGE_KEY));
        if (data && data.plan) {
            return data;
        }
    } catch {}
    return null;
}


// =========================================
// EVENT HANDLERS
// =========================================

generateBtn.addEventListener("click", () => {
    const plan = generatePlan();
    if (plan) {
        renderPlan(plan);
        planResult.classList.add("active");
        planResult.scrollIntoView({ behavior: "smooth" });

        const savedData = loadSavedPlan();
        if (savedData) {
            savePlanBtn.classList.remove("saved");
            savePlanBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Plan';
        }
    }
});

savePlanBtn.addEventListener("click", savePlan);

regenerateBtn.addEventListener("click", () => {
    const plan = generatePlan();
    if (plan) {
        renderPlan(plan);
        planResult.classList.add("active");

        savePlanBtn.classList.remove("saved");
        savePlanBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Plan';
    }
});

exportBtn.addEventListener("click", () => {
    if (!currentPlan) return;

    let text = "VIVAFIT Workout Plan\n";
    text += "====================\n\n";

    currentPlan.forEach(slot => {
        text += slot.dayName + " — " + slot.name + "\n";
        if (slot.isRestDay) {
            text += "Rest and recover.\n\n";
        } else {
            slot.exercises.forEach((ex, i) => {
                text += "  " + (i + 1) + ". " + ex.name + " — " + ex.sets + " sets x " + ex.reps + " (rest " + ex.rest + ")\n";
            });
            text += "\n";
        }
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vivafit-workout-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
});


// =========================================
// INIT — Load saved plan if exists
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const savedData = loadSavedPlan();

    if (savedData) {
        const s = savedData.settings;

        document.getElementById("planGoal").value = s.goal || "build-muscle";
        document.getElementById("planLevel").value = s.level || "intermediate";
        document.getElementById("planDays").value = s.daysPerWeek || 4;
        document.getElementById("planDuration").value = s.duration || 45;
        document.getElementById("planEquipment").value = s.equipment || "full-gym";

        selectedMuscles = s.muscles || ["chest", "back", "shoulders", "arms", "legs", "glutes", "core"];
        document.querySelectorAll("#muscleChipGroup .chip[data-muscle]").forEach(chip => {
            chip.classList.toggle("active", selectedMuscles.includes(chip.dataset.muscle));
        });

        renderPlan(savedData.plan);
        planResult.classList.add("active");

        savePlanBtn.classList.add("saved");
        savePlanBtn.innerHTML = '<i class="fa-solid fa-check"></i> Plan Saved';
    }
});
