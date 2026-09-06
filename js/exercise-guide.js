// =========================================
// EXERCISE FORM GUIDANCE DATA
// =========================================

const exerciseGuideData = {
    "Bench Press": {
        muscles: ["Chest", "Triceps", "Front Delts"],
        steps: [
            "Lie flat on the bench with eyes under the bar. Grip the bar slightly wider than shoulder-width.",
            "Unrack the bar and lower it to mid-chest with control.",
            "Press the bar back up until arms are fully extended.",
            "Keep your shoulder blades pinched together and feet flat on the floor."
        ],
        mistakes: [
            "Bouncing the bar off your chest",
            "Flaring elbows out too wide (keep ~45° angle)",
            "Lifting your hips off the bench"
        ],
        tips: [
            "Use a spotter for heavy sets",
            "Keep a slight arch in your lower back",
            "Drive through your heels for stability"
        ]
    },
    "Overhead Press": {
        muscles: ["Shoulders", "Triceps", "Upper Chest"],
        steps: [
            "Stand with feet shoulder-width apart, gripping the bar at collarbone height.",
            "Brace your core and press the bar straight overhead.",
            "Lock out your arms at the top, bringing your head slightly forward.",
            "Lower the bar back to collarbone with control."
        ],
        mistakes: [
            "Excessive back lean to compensate for weight",
            "Pressing the bar forward instead of straight up",
            "Using leg drive (strict press = no leg help)"
        ],
        tips: [
            "Squeeze your glutes to protect your lower back",
            "Keep the bar path close to your face",
            "Start light to master the movement pattern"
        ]
    },
    "Barbell Row": {
        muscles: ["Back", "Biceps", "Rear Delts"],
        steps: [
            "Hinge at the hips with a slight knee bend, gripping the bar shoulder-width.",
            "Pull the bar toward your lower chest/upper abdomen.",
            "Squeeze your shoulder blades together at the top.",
            "Lower the bar back down with control."
        ],
        mistakes: [
            "Standing too upright (reduces back engagement)",
            "Using momentum to swing the weight up",
            "Rounding your lower back"
        ],
        tips: [
            "Keep your spine neutral throughout",
            "Think about pulling with your elbows, not your hands",
            "Brace your core before each rep"
        ]
    },
    "Bicep Curls": {
        muscles: ["Biceps", "Forearms"],
        steps: [
            "Stand holding a barbell or dumbbells with palms facing forward.",
            "Curl the weight up by bending your elbows, keeping upper arms still.",
            "Squeeze your biceps at the top of the movement.",
            "Lower the weight back down slowly."
        ],
        mistakes: [
            "Swinging your body to generate momentum",
            "Moving your elbows forward during the curl",
            "Rushing through the negative (lowering) phase"
        ],
        tips: [
            "Keep your elbows pinned to your sides",
            "Control the lowering phase for 2-3 seconds",
            "Choose a weight you can curl with strict form"
        ]
    },
    "Tricep Dips": {
        muscles: ["Triceps", "Chest", "Front Delts"],
        steps: [
            "Grip parallel bars and push yourself up with arms straight.",
            "Lean slightly forward and lower your body by bending your elbows.",
            "Descend until your elbows are at about 90 degrees.",
            "Push yourself back up to the starting position."
        ],
        mistakes: [
            "Going too deep (stresses shoulder joints)",
            "Flaring elbows outward",
            "Not maintaining a controlled tempo"
        ],
        tips: [
            "Keep your core engaged throughout",
            "Add weight only after mastering bodyweight reps",
            "For chest emphasis, lean more forward"
        ]
    },
    "Barbell Squat": {
        muscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
        steps: [
            "Position the bar on your upper traps, feet shoulder-width apart.",
            "Brace your core and push your hips back and down.",
            "Descend until thighs are at least parallel to the floor.",
            "Drive through your heels to stand back up."
        ],
        mistakes: [
            "Knees caving inward (push them out over toes)",
            "Rising onto your toes",
            "Rounding your lower back at the bottom"
        ],
        tips: [
            "Look straight ahead, not down",
            "Take a deep breath and brace before each rep",
            "Start with just the bar to warm up your form"
        ]
    },
    "Romanian Deadlift": {
        muscles: ["Hamstrings", "Glutes", "Lower Back"],
        steps: [
            "Stand holding a barbell at hip height with a slight knee bend.",
            "Hinge at your hips, pushing them backward while lowering the bar.",
            "Lower until you feel a deep stretch in your hamstrings.",
            "Drive your hips forward to return to standing."
        ],
        mistakes: [
            "Rounding your back (keep it flat)",
            "Bending your knees too much (turns it into a regular deadlift)",
            "Letting the bar drift away from your legs"
        ],
        tips: [
            "Keep the bar close to your legs throughout",
            "Think about pushing your butt toward the wall behind you",
            "Start with lighter weight to feel the hamstring stretch"
        ]
    },
    "Leg Press": {
        muscles: ["Quadriceps", "Glutes", "Hamstrings"],
        steps: [
            "Sit in the leg press machine with your back flat against the pad.",
            "Place your feet shoulder-width apart on the platform.",
            "Lower the weight by bending your knees toward your chest.",
            "Push the platform back up without fully locking your knees."
        ],
        mistakes: [
            "Placing feet too high or too low (adjust for target muscle)",
            "Locking knees at the top (keeps tension on joints)",
            "Letting your lower back round off the pad"
        ],
        tips: [
            "Feet lower on platform = more quad emphasis",
            "Feet higher on platform = more glute/hamstring emphasis",
            "Control the negative for better muscle growth"
        ]
    },
    "Walking Lunges": {
        muscles: ["Quadriceps", "Glutes", "Hamstrings"],
        steps: [
            "Stand tall, then step forward with one leg into a lunge position.",
            "Lower your back knee toward the ground until both knees are at 90°.",
            "Push off your front foot and step forward into the next lunge.",
            "Alternate legs as you walk forward."
        ],
        mistakes: [
            "Letting your front knee go past your toes excessively",
            "Leaning too far forward",
            "Taking steps that are too short (limits range of motion)"
        ],
        tips: [
            "Keep your torso upright throughout",
            "Take controlled, moderate-length steps",
            "Hold dumbbells at your sides for added resistance"
        ]
    },
    "Calf Raises": {
        muscles: ["Calves (Gastrocnemius, Soleus)"],
        steps: [
            "Stand on the edge of a step or calf raise machine, heels hanging off.",
            "Lower your heels below the platform for a full stretch.",
            "Push up onto your toes as high as possible.",
            "Hold the top position for a brief squeeze."
        ],
        mistakes: [
            "Bouncing at the bottom instead of a controlled stretch",
            "Rushing through reps without a pause at the top",
            "Using too much weight too soon"
        ],
        tips: [
            "Point toes slightly inward to target the inner calf",
            "Point toes slightly outward for the outer calf",
            "Calves respond well to higher reps (15-20 range)"
        ]
    },
    "Deadlift": {
        muscles: ["Back", "Glutes", "Hamstrings", "Core", "Forearms"],
        steps: [
            "Stand with feet hip-width apart, bar over mid-foot. Grip the bar just outside your knees.",
            "Drop your hips, lift your chest, and brace your core.",
            "Drive through the floor, extending hips and knees simultaneously.",
            "Lock out at the top with shoulders back, then lower with control."
        ],
        mistakes: [
            "Rounding your lower back (most common and dangerous error)",
            "Jerking the bar off the floor instead of building tension first",
            "Letting the bar drift forward away from your body"
        ],
        tips: [
            "\"Pull the slack out\" of the bar before lifting",
            "Think of it as pushing the floor away, not pulling the bar up",
            "Use chalk or straps if grip is the limiting factor"
        ]
    },
    "Pull-Ups": {
        muscles: ["Back (Lats)", "Biceps", "Rear Delts"],
        steps: [
            "Hang from a bar with palms facing away, slightly wider than shoulder-width.",
            "Engage your lats and pull yourself up until your chin clears the bar.",
            "Lower yourself back down with control to a full hang.",
            "Repeat without swinging or kipping."
        ],
        mistakes: [
            "Using momentum or swinging your body",
            "Not going to a full hang at the bottom",
            "Shrugging your shoulders up toward your ears"
        ],
        tips: [
            "Start with assisted pull-ups or negatives if you can't do full reps",
            "Think about driving your elbows down and back",
            "Keep your core tight to reduce swinging"
        ]
    },
    "Plank": {
        muscles: ["Core", "Shoulders", "Glutes"],
        steps: [
            "Start in a forearm position with elbows directly under your shoulders.",
            "Extend your legs back, resting on your toes.",
            "Keep your body in a straight line from head to heels.",
            "Hold the position while breathing steadily."
        ],
        mistakes: [
            "Letting your hips sag toward the floor",
            "Piking your hips up too high",
            "Holding your breath"
        ],
        tips: [
            "Squeeze your glutes and brace your abs like you're about to be punched",
            "Look at the floor slightly ahead of your hands",
            "Quality over time — hold perfect form, not maximum duration"
        ]
    },
    "Jump Rope": {
        muscles: ["Calves", "Shoulders", "Core"],
        steps: [
            "Hold the rope handles at hip height with elbows close to your body.",
            "Rotate the rope using your wrists, not your arms.",
            "Jump just high enough to clear the rope (1-2 inches).",
            "Land softly on the balls of your feet."
        ],
        mistakes: [
            "Jumping too high (wastes energy)",
            "Using your whole arms to turn the rope",
            "Landing flat-footed"
        ],
        tips: [
            "Keep your knees slightly bent to absorb impact",
            "Start with a slow, steady rhythm before going fast",
            "Keep your gaze forward, not down at your feet"
        ]
    },
    "Burpees": {
        muscles: ["Full Body", "Chest", "Core", "Legs"],
        steps: [
            "Stand with feet shoulder-width apart.",
            "Drop into a squat, place hands on the floor, and jump your feet back into a push-up position.",
            "Perform a push-up, then jump your feet back toward your hands.",
            "Explode upward into a jump with arms overhead."
        ],
        mistakes: [
            "Skipping the push-up or not going chest-to-floor",
            "Rounding your back when jumping back",
            "Landing stiff-legged on the jump"
        ],
        tips: [
            "Break it into steps if needed: squat, kick back, push-up, jump in, jump up",
            "Move at your own pace — form first, speed second",
            "Modify by stepping back instead of jumping if needed"
        ]
    },
    "Mountain Climbers": {
        muscles: ["Core", "Hip Flexors", "Shoulders"],
        steps: [
            "Start in a push-up position with hands directly under your shoulders.",
            "Drive one knee toward your chest.",
            "Quickly switch legs, driving the opposite knee forward.",
            "Maintain a steady, running-like pace."
        ],
        mistakes: [
            "Letting your hips pike up too high",
            "Placing hands too far forward (strains shoulders)",
            "Moving too fast and losing form"
        ],
        tips: [
            "Keep your core tight and hips level throughout",
            "Focus on bringing your knee toward your chest, not your hand",
            "Breathe rhythmically — don't hold your breath"
        ]
    },
    "High Knees": {
        muscles: ["Hip Flexors", "Core", "Quadriceps"],
        steps: [
            "Stand with feet hip-width apart.",
            "Alternate driving your knees up toward your chest rapidly.",
            "Pump your arms in sync with your legs.",
            "Stay on the balls of your feet throughout."
        ],
        mistakes: [
            "Leaning backward to compensate",
            "Not lifting knees high enough (aim for hip height)",
            "Landing on flat feet"
        ],
        tips: [
            "Keep your chest up and core engaged",
            "Think about quick, light foot contacts with the ground",
            "Start slow to get the rhythm, then increase speed"
        ]
    },
    "Jumping Jacks": {
        muscles: ["Full Body", "Calves", "Shoulders"],
        steps: [
            "Stand with feet together and arms at your sides.",
            "Jump your feet out wide while raising your arms overhead.",
            "Jump your feet back together while lowering your arms.",
            "Maintain a steady, rhythmic pace."
        ],
        mistakes: [
            "Locking your knees on landing",
            "Only raising arms halfway (full range of motion is better)",
            "Landing heavily instead of softly"
        ],
        tips: [
            "Land softly on the balls of your feet",
            "Keep a slight bend in your knees throughout",
            "Use this as a warm-up or active recovery between sets"
        ]
    },
    "Incline Bench Press": {
        muscles: ["Upper Chest", "Shoulders", "Triceps"],
        steps: [
            "Set the bench to a 30-45 degree incline. Lie back and grip the bar wider than shoulder-width.",
            "Unrack the bar and lower it to your upper chest.",
            "Press the bar back up until arms are fully extended.",
            "Keep your shoulder blades pinched into the bench."
        ],
        mistakes: [
            "Setting the bench too steep (shifts focus to shoulders)",
            "Bouncing the bar off your chest",
            "Flaring elbows too wide"
        ],
        tips: [
            "A 30-degree incline targets the upper chest best",
            "Keep your feet flat and drive through them",
            "Use a spotter for heavier sets"
        ]
    },
    "Dumbbell Shoulder Press": {
        muscles: ["Shoulders", "Triceps"],
        steps: [
            "Sit or stand holding dumbbells at shoulder height, palms facing forward.",
            "Press the dumbbells overhead until arms are nearly straight.",
            "Lower them back to shoulder height with control.",
            "Keep your core braced throughout."
        ],
        mistakes: [
            "Arching your lower back excessively",
            "Pressing the dumbbells inward (keep them in a slight arc)",
            "Using momentum from your legs (strict press)"
        ],
        tips: [
            "Squeeze your glutes to protect your lower back",
            "Look straight ahead, not up at the dumbbells",
            "Start lighter than you think — stabilizer muscles work harder with dumbbells"
        ]
    },
    "Cable Flyes": {
        muscles: ["Chest", "Front Delts"],
        steps: [
            "Set cables to shoulder height and stand in the center.",
            "Grip the handles and step forward, arms slightly bent.",
            "Bring your hands together in front of your chest in a hugging motion.",
            "Slowly return to the starting position, feeling the chest stretch."
        ],
        mistakes: [
            "Using too much weight (flyes are an isolation exercise)",
            "Straightening your arms completely (keeps stress on joints)",
            "Letting your arms go too far behind your body"
        ],
        tips: [
            "Think about hugging a large tree — keep a slight bend in your elbows",
            "Control the negative for a deep chest stretch",
            "Squeeze your chest at the peak contraction"
        ]
    },
    "Lateral Raises": {
        muscles: ["Side Delts", "Traps"],
        steps: [
            "Stand holding light dumbbells at your sides, palms facing inward.",
            "Raise your arms out to the sides until they reach shoulder height.",
            "Pause briefly at the top, then lower with control.",
            "Keep a slight bend in your elbows throughout."
        ],
        mistakes: [
            "Using momentum to swing the weights up",
            "Raising your arms above shoulder height",
            "Gripping the dumbbells too tightly"
        ],
        tips: [
            "Lead with your elbows, not your hands",
            "Use a lighter weight than you think — this exercise is about precision",
            "Lean slightly forward to better target the side delts"
        ]
    },
    "Tricep Pushdowns": {
        muscles: ["Triceps"],
        steps: [
            "Stand at a cable machine with a straight or rope attachment.",
            "Grip the attachment and pull it down to about chest height.",
            "Push the weight down by extending your elbows fully.",
            "Slowly return to the starting position without letting your elbows drift."
        ],
        mistakes: [
            "Moving your elbows forward or backward during the rep",
            "Using your shoulders to push the weight down",
            "Leaning too far forward over the attachment"
        ],
        tips: [
            "Pin your elbows to your sides throughout the movement",
            "Squeeze your triceps hard at the bottom of each rep",
            "With a rope attachment, spread the ends apart at the bottom for extra contraction"
        ]
    },
    "Seated Cable Row": {
        muscles: ["Back", "Biceps", "Rear Delts"],
        steps: [
            "Sit at the cable row station with feet on the foot plates, knees slightly bent.",
            "Grip the handle and sit upright with a slight lean forward.",
            "Pull the handle toward your lower abdomen, squeezing your shoulder blades.",
            "Slowly extend your arms back to the starting position."
        ],
        mistakes: [
            "Using excessive momentum by swinging your torso",
            "Rounding your lower back at the start",
            "Shrugging your shoulders up toward your ears"
        ],
        tips: [
            "Keep your chest up and core braced throughout",
            "Think about pulling with your back, not your arms",
            "Pause for 1 second at the peak contraction"
        ]
    },
    "Face Pulls": {
        muscles: ["Rear Delts", "Rotator Cuff", "Traps"],
        steps: [
            "Set a cable rope attachment to face height.",
            "Grip the rope with palms facing each other and step back.",
            "Pull the rope toward your face, separating the ends around your ears.",
            "Squeeze your rear delts and upper back at the end position."
        ],
        mistakes: [
            "Using too much weight (this is a corrective exercise)",
            "Pulling too low (aim for face/ear height)",
            "Letting your elbows drop below shoulder height"
        ],
        tips: [
            "Keep your elbows high and out to the sides",
            "Use this as a warm-up or finisher, not a heavy lift",
            "Great for shoulder health — do them regularly"
        ]
    },
    "Hammer Curls": {
        muscles: ["Biceps", "Brachialis", "Forearms"],
        steps: [
            "Stand holding dumbbells at your sides with palms facing each other.",
            "Curl the dumbbells up by bending your elbows, keeping palms facing inward.",
            "Squeeze at the top, then lower with control.",
            "Keep your upper arms stationary throughout."
        ],
        mistakes: [
            "Swinging your body to generate momentum",
            "Rotating your wrists during the curl",
            "Letting your elbows drift forward"
        ],
        tips: [
            "Keep your elbows pinned to your sides",
            "Great for building arm thickness along with standard curls",
            "Control the lowering phase for maximum benefit"
        ]
    },
    "Back Squat": {
        muscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
        steps: [
            "Position the bar on your upper traps (not your neck), feet shoulder-width apart.",
            "Brace your core, then push your hips back and descend.",
            "Go to at least parallel (thighs parallel to floor) or deeper if mobility allows.",
            "Drive through your whole foot to stand back up."
        ],
        mistakes: [
            "Letting your knees cave inward on the way up",
            "Rising onto your toes during the ascent",
            "Letting your chest drop forward excessively"
        ],
        tips: [
            "Take a big breath and brace before each rep",
            "Push your knees out in the direction of your toes",
            "Keep your gaze forward, not at the floor"
        ]
    },
    "Front Squat": {
        muscles: ["Quadriceps", "Core", "Upper Back", "Glutes"],
        steps: [
            "Rest the bar on the front of your shoulders with elbows high (clean grip or cross-arm).",
            "Stand with feet shoulder-width apart, toes slightly out.",
            "Descend by sitting straight down, keeping your torso upright.",
            "Drive back up, keeping elbows high throughout."
        ],
        mistakes: [
            "Letting your elbows drop (causes the bar to roll forward)",
            "Leaning too far forward",
            "Not going deep enough (front squats reward depth)"
        ],
        tips: [
            "Wrist mobility matters — stretch your wrists before loading",
            "Keep your core extremely tight to maintain an upright torso",
            "Start light — this is technically demanding"
        ]
    },
    "Bulgarian Split Squat": {
        muscles: ["Quadriceps", "Glutes", "Hamstrings"],
        steps: [
            "Stand a few feet in front of a bench. Place one foot behind you on the bench.",
            "Lower your body by bending your front knee until your back knee nearly touches the floor.",
            "Push through your front foot to return to standing.",
            "Complete all reps on one side before switching."
        ],
        mistakes: [
            "Standing too close to the bench (reduces range of motion)",
            "Leaning too far forward",
            "Letting your front knee cave inward"
        ],
        tips: [
            "Take a moment to find your balance before descending",
            "Keep your torso upright throughout the movement",
            "Hold dumbbells at your sides for added resistance"
        ]
    },
    "Leg Curl": {
        muscles: ["Hamstrings"],
        steps: [
            "Lie face down on the leg curl machine with the pad behind your ankles.",
            "Grip the handles for stability.",
            "Curl your legs up by bending your knees toward your glutes.",
            "Lower the weight back down with control."
        ],
        mistakes: [
            "Lifting your hips off the pad (cheating the movement)",
            "Using too much weight and sacrificing form",
            "Not going through the full range of motion"
        ],
        tips: [
            "Keep your hips pressed into the pad throughout",
            "Pause at the top for a peak contraction",
            "Control the negative — don't just let the weight drop"
        ]
    },
    "Leg Extension": {
        muscles: ["Quadriceps"],
        steps: [
            "Sit in the leg extension machine with the pad on your shins.",
            "Grip the handles for stability.",
            "Extend your legs until they are straight, squeezing your quads at the top.",
            "Lower the weight back down with control."
        ],
        mistakes: [
            "Locking your knees too aggressively at the top",
            "Using momentum to swing the weight up",
            "Not controlling the lowering phase"
        ],
        tips: [
            "Squeeze your quads hard at the top for 1 second",
            "Great as a finisher after compound leg exercises",
            "Keep your back pressed firmly against the pad"
        ]
    }
};

// =========================================
// EXERCISE VIDEO MAPPING (YouTube IDs)
// =========================================

const exerciseVideoMap = {
    "Bench Press":              "8ayErjKZovc",
    "Overhead Press":           "2yjwXTZQDDI",
    "Barbell Row":              "FWJR5Ve8bnQ",
    "Bicep Curls":              "ykJmrZ5v0Oo",
    "Tricep Dips":              "2z8JmcrW-As",
    "Barbell Squat":            "bEv6CCg2BC8",
    "Romanian Deadlift":        "JCXUYuzwNrM",
    "Leg Press":                "fn-jtDvJjwg",
    "Walking Lunges":           "QOVaHnm-e7Q",
    "Calf Raises":              "gwLzBJYoWlI",
    "Deadlift":                 "ZaTM37cfiDs",
    "Pull-Ups":                 "eGo4IYlbE5g",
    "Plank":                    "ASdvN_XEl_c",
    "Jump Rope":                "FJmRQ5iTXKE",
    "Burpees":                  "TU8QYVW0gDU",
    "Mountain Climbers":        "nmwgirgXLYM",
    "High Knees":               "txF6wctU7Bo",
    "Jumping Jacks":            "c4DAnQ6DtF8",
    "Incline Bench Press":      "8iPEnn-ltC8",
    "Dumbbell Shoulder Press":  "qEwKCR5JCog",
    "Cable Flyes":              "taI4XduLpTk",
    "Lateral Raises":           "3VcKaXpzqRo",
    "Tricep Pushdowns":         "2-LAMcpzODU",
    "Seated Cable Row":         "GZbfZ033f74",
    "Face Pulls":               "rep-qVOkqgk",
    "Hammer Curls":             "zC3nLlEvin4",
    "Back Squat":               "bEv6CCg2BC8",
    "Front Squat":             "v-mQg_dEHze",
    "Bulgarian Split Squat":    "2C-uNgKwPLE",
    "Leg Curl":                 "1THE3vPnrRo",
    "Leg Extension":            "YyvSfVjQeL0"
};

const fallbackSearchQuery = "how to do exercise proper form tutorial";

// =========================================
// EXERCISE GUIDE MODAL (YouTube Player)
// =========================================

let guideOverlay = null;

function openExerciseGuide(exerciseName) {
    const videoId = exerciseVideoMap[exerciseName];

    if (!guideOverlay) {
        guideOverlay = createGuideModal();
    }

    guideOverlay.querySelector(".guide-title").textContent = exerciseName;

    const iframe = guideOverlay.querySelector(".guide-video-iframe");
    const fallback = guideOverlay.querySelector(".guide-fallback");

    if (videoId) {
        iframe.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&modestbranding=1";
        iframe.style.display = "block";
        fallback.style.display = "none";
    } else {
        iframe.style.display = "none";
        iframe.src = "";
        const query = encodeURIComponent(exerciseName + " " + fallbackSearchQuery);
        fallback.querySelector("a").href = "https://www.youtube.com/results?search_query=" + query;
        fallback.style.display = "flex";
    }

    guideOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeExerciseGuide() {
    if (guideOverlay) {
        guideOverlay.classList.remove("active");
        document.body.style.overflow = "";
        const iframe = guideOverlay.querySelector(".guide-video-iframe");
        if (iframe) iframe.src = "";
    }
}

function createGuideModal() {
    const overlay = document.createElement("div");
    overlay.className = "guide-overlay";
    overlay.id = "exerciseGuideModal";

    overlay.innerHTML = `
        <div class="guide-card">
            <div class="guide-header">
                <div class="guide-header-left">
                    <div class="guide-icon">
                        <i class="fa-solid fa-circle-info"></i>
                    </div>
                    <div class="guide-header-text">
                        <h2 class="guide-title">Exercise Name</h2>
                    </div>
                </div>
                <button class="guide-close" id="guideClose">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="guide-video-wrapper">
                <iframe class="guide-video-iframe"
                    src=""
                    title="Exercise Form Guide"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
                <div class="guide-fallback" style="display:none;">
                    <i class="fa-brands fa-youtube"></i>
                    <p>Video not available inline.</p>
                    <a href="#" target="_blank" rel="noopener noreferrer" class="btn-guide-youtube">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Watch on YouTube
                    </a>
                </div>
            </div>

            <div class="guide-footer">
                <button class="btn-guide-close" id="guideFooterClose">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#guideClose").addEventListener("click", closeExerciseGuide);
    overlay.querySelector("#guideFooterClose").addEventListener("click", closeExerciseGuide);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeExerciseGuide();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeExerciseGuide();
    });

    return overlay;
}
