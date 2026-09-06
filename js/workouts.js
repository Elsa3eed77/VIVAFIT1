// =========================================
// WORKOUTS DATA
// =========================================

const workouts = [
    {
        id: "upper-body",
        name: "Upper Body",
        category: "strength",
        icon: "fa-solid fa-dumbbell",
        description: "Build stronger arms, chest and back.",
        duration: "40 min",
        difficulty: "Medium",
        exercises: [
            { name: "Bench Press", sets: 4, reps: "10", rest: "90s" },
            { name: "Overhead Press", sets: 3, reps: "12", rest: "60s" },
            { name: "Barbell Row", sets: 4, reps: "10", rest: "90s" },
            { name: "Bicep Curls", sets: 3, reps: "15", rest: "45s" },
            { name: "Tricep Dips", sets: 3, reps: "12", rest: "45s" }
        ]
    },
    {
        id: "lower-body",
        name: "Lower Body",
        category: "strength",
        icon: "fa-solid fa-person-running",
        description: "Stronger legs and glutes for a fitter you.",
        duration: "45 min",
        difficulty: "Medium",
        exercises: [
            { name: "Barbell Squat", sets: 4, reps: "10", rest: "90s" },
            { name: "Romanian Deadlift", sets: 4, reps: "8", rest: "90s" },
            { name: "Leg Press", sets: 3, reps: "12", rest: "60s" },
            { name: "Walking Lunges", sets: 3, reps: "12 each", rest: "60s" },
            { name: "Calf Raises", sets: 4, reps: "15", rest: "45s" }
        ]
    },
    {
        id: "full-body",
        name: "Full Body",
        category: "full-body",
        icon: "fa-solid fa-heart-pulse",
        description: "A complete workout for total fitness.",
        duration: "50 min",
        difficulty: "Hard",
        exercises: [
            { name: "Deadlift", sets: 4, reps: "8", rest: "120s" },
            { name: "Barbell Squat", sets: 4, reps: "10", rest: "90s" },
            { name: "Bench Press", sets: 4, reps: "10", rest: "90s" },
            { name: "Pull-Ups", sets: 3, reps: "Max", rest: "60s" },
            { name: "Plank", sets: 3, reps: "60s", rest: "45s" }
        ]
    },
    {
        id: "cardio-blast",
        name: "Cardio Blast",
        category: "cardio",
        icon: "fa-solid fa-person-running",
        description: "Boost endurance and burn calories.",
        duration: "30 min",
        difficulty: "Easy",
        exercises: [
            { name: "Jump Rope", sets: 1, reps: "3 min", rest: "30s" },
            { name: "Burpees", sets: 3, reps: "15", rest: "45s" },
            { name: "Mountain Climbers", sets: 3, reps: "30s", rest: "30s" },
            { name: "High Knees", sets: 3, reps: "30s", rest: "30s" },
            { name: "Jumping Jacks", sets: 1, reps: "3 min", rest: "30s" }
        ]
    },
    {
        id: "push",
        name: "Push Day",
        category: "strength",
        icon: "fa-solid fa-arrows-up-down",
        description: "Chest, shoulders and triceps focus.",
        duration: "45 min",
        difficulty: "Medium",
        exercises: [
            { name: "Incline Bench Press", sets: 4, reps: "10", rest: "90s" },
            { name: "Dumbbell Shoulder Press", sets: 4, reps: "10", rest: "60s" },
            { name: "Cable Flyes", sets: 3, reps: "12", rest: "45s" },
            { name: "Lateral Raises", sets: 3, reps: "15", rest: "45s" },
            { name: "Tricep Pushdowns", sets: 3, reps: "12", rest: "45s" }
        ]
    },
    {
        id: "pull",
        name: "Pull Day",
        category: "strength",
        icon: "fa-solid fa-hand-fist",
        description: "Back and biceps for a powerful pull.",
        duration: "42 min",
        difficulty: "Medium",
        exercises: [
            { name: "Deadlift", sets: 4, reps: "6", rest: "120s" },
            { name: "Pull-Ups", sets: 4, reps: "8", rest: "90s" },
            { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s" },
            { name: "Face Pulls", sets: 3, reps: "15", rest: "45s" },
            { name: "Hammer Curls", sets: 3, reps: "12", rest: "45s" }
        ]
    },
    {
        id: "legs",
        name: "Leg Day",
        category: "strength",
        icon: "fa-solid fa-shoe-prints",
        description: "Heavy legs workout for serious gains.",
        duration: "50 min",
        difficulty: "Hard",
        exercises: [
            { name: "Back Squat", sets: 5, reps: "5", rest: "120s" },
            { name: "Front Squat", sets: 3, reps: "8", rest: "90s" },
            { name: "Bulgarian Split Squat", sets: 3, reps: "10 each", rest: "60s" },
            { name: "Leg Curl", sets: 3, reps: "12", rest: "45s" },
            { name: "Leg Extension", sets: 3, reps: "15", rest: "45s" }
        ]
    }
];

const STORAGE_KEY = "vivafitWorkouts";
const SUBSTITUTION_KEY = "vivafitSubstitutionHistory";

// =========================================
// DOM REFERENCES
// =========================================

const workoutGrid = document.querySelector(".workout-grid");
const filterButtons = document.querySelectorAll(".filter");
const modal = document.getElementById("workoutModal");
const modalClose = document.getElementById("modalClose");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const modalSaveBtn = document.getElementById("modalSaveBtn");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalIcon = document.getElementById("modalIcon");
const modalDuration = document.getElementById("modalDuration");
const modalDifficulty = document.getElementById("modalDifficulty");
const modalCategory = document.getElementById("modalCategory");
const modalExerciseList = document.getElementById("modalExerciseList");

let currentWorkout = null;
let currentWorkoutExercises = null;

// =========================================
// RENDER WORKOUT CARDS
// =========================================

function renderWorkoutCards(filter = "all") {
    workoutGrid.innerHTML = "";

    const filtered = filter === "all"
        ? workouts
        : workouts.filter(w => w.category === filter);

    if (filtered.length === 0) {
        workoutGrid.innerHTML = '<p style="color:#a6a9b5;text-align:center;grid-column:1/-1;padding:40px 0;">No workouts found for this filter.</p>';
        return;
    }

    filtered.forEach(workout => {
        const card = document.createElement("div");
        card.className = "workout-card";
        card.dataset.id = workout.id;

        const difficultyClass = workout.difficulty === "Hard" ? "hard" : workout.difficulty === "Easy" ? "easy" : "";

        card.innerHTML = `
            <div class="icon-box">
                <i class="${workout.icon}"></i>
            </div>
            <div class="card-body">
                <h3>${workout.name}</h3>
                <p>${workout.description}</p>
                <div class="meta">
                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${workout.duration}
                    </span>
                    <span class="${difficultyClass}">
                        <i class="fa-solid fa-chart-simple"></i>
                        ${workout.difficulty}
                    </span>
                </div>
            </div>
            <button class="btn-red">
                Start Workout
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        `;

        card.querySelector(".btn-red").addEventListener("click", () => openModal(workout));
        workoutGrid.appendChild(card);
    });
}

// =========================================
// FILTER LOGIC
// =========================================

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const tag = btn.textContent.trim().toLowerCase().replace(/\s+/g, "-");
        const filterMap = {
            "all": "all",
            "strength": "strength",
            "cardio": "cardio",
            "full-body": "full-body"
        };
        const filter = filterMap[tag] || "all";
        renderWorkoutCards(filter);
    });
});

// =========================================
// MODAL LOGIC
// =========================================

function openModal(workout) {
    currentWorkout = workout;
    currentWorkoutExercises = workout.exercises.map(ex => ({ ...ex }));

    modalTitle.textContent = workout.name;
    modalDescription.textContent = workout.description;
    modalIcon.innerHTML = `<i class="${workout.icon}"></i>`;
    modalDuration.textContent = workout.duration;
    modalDifficulty.textContent = workout.difficulty;
    modalCategory.textContent = workout.category.replace("-", " ");

    renderExerciseList();

    const bannerContainer = document.getElementById("adaptiveBannerContainer");
    if (bannerContainer && typeof renderAdaptiveBanner === "function") {
        renderAdaptiveBanner(workout, "adaptiveBannerContainer");
    }

    updateSaveButton();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function renderExerciseList() {
    modalExerciseList.innerHTML = "";

    currentWorkoutExercises.forEach((ex, i) => {
        const li = document.createElement("li");
        li.className = "exercise-item" + (ex._substituted ? " substituted" : "");
        li.innerHTML = `
            <div class="exercise-number">${i + 1}</div>
            <div class="exercise-info">
                <p class="exercise-name">${ex.name}</p>
                <p class="exercise-details">${ex.sets} sets x ${ex.reps}</p>
                ${ex._substituted ? '<span class="substituted-badge"><i class="fa-solid fa-shuffle"></i> Substituted</span>' : ''}
            </div>
            <button class="exercise-guide-btn" data-exercise-name="${ex.name}">
                <i class="fa-solid fa-circle-info"></i> Guide
            </button>
            <button class="exercise-replace-btn" data-exercise-index="${i}">
                <i class="fa-solid fa-shuffle"></i> Replace
            </button>
        `;
        modalExerciseList.appendChild(li);
    });

    modalExerciseList.querySelectorAll(".exercise-guide-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const name = this.dataset.exerciseName;
            if (typeof openExerciseGuide === "function") {
                openExerciseGuide(name);
            }
        });
    });

    modalExerciseList.querySelectorAll(".exercise-replace-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const idx = parseInt(this.dataset.exerciseIndex);
            const ex = currentWorkoutExercises[idx];
            if (!ex || typeof openExerciseSubstitution === "undefined") return;

            openExerciseSubstitution({
                exerciseName: ex.name,
                originalExercise: ex,
                workoutId: currentWorkout.id,
                userEquipment: getUserEquipment(),
                userLevel: getUserLevel(),
                onSelect: function (replacement) {
                    currentWorkoutExercises[idx] = replacement;
                    currentWorkout.exercises = currentWorkoutExercises;
                    renderExerciseList();
                }
            });
        });
    });
}

function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    currentWorkout = null;
    currentWorkoutExercises = null;
}

function updateSaveButton() {
    const saved = getSavedWorkouts();
    const alreadySaved = saved.some(w => w.id === currentWorkout.id);

    if (alreadySaved) {
        modalSaveBtn.classList.add("saved");
        modalSaveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Already Saved';
    } else {
        modalSaveBtn.classList.remove("saved");
        modalSaveBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add to My Workouts';
    }
}

modalClose.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

// =========================================
// LOCALSTORAGE — SAVE / LOAD
// =========================================

function getSavedWorkouts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveWorkouts(workoutsList) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workoutsList));
}

modalSaveBtn.addEventListener("click", () => {
    if (!currentWorkout) return;

    const saved = getSavedWorkouts();

    if (saved.some(w => w.id === currentWorkout.id)) {
        return;
    }

    saved.push({
        id: currentWorkout.id,
        name: currentWorkout.name,
        category: currentWorkout.category,
        addedAt: new Date().toISOString()
    });

    saveWorkouts(saved);
    updateSaveButton();
});

// =========================================
// SUBSTITUTION HISTORY DISPLAY
// =========================================

function renderSubstitutionHistory(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(SUBSTITUTION_KEY)) || [];
    } catch (e) {
        history = [];
    }

    if (history.length === 0) {
        container.innerHTML = '<div class="adaptive-history-empty"><i class="fa-solid fa-shuffle"></i><p>No exercise substitutions yet. Use the "Replace" button in workout modals to swap exercises.</p></div>';
        return;
    }

    let html = '<div class="adaptive-history-list">';

    var recentHistory = history.slice(-10).reverse();

    recentHistory.forEach(function (entry) {
        var date = new Date(entry.date);
        var dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        html += '<div class="adaptive-history-item">';
        html += '<div class="adaptive-history-date">' + dateStr + '</div>';
        html += '<div class="adaptive-history-workout">' + entry.originalExercise + ' → ' + entry.alternativeExercise + '</div>';
        html += '<div class="adaptive-history-adjustments">';
        html += '<span class="history-adj badge-keep">' + (entry.reason || 'User selected') + '</span>';
        html += '</div>';
        html += '</div>';
    });

    html += '</div>';

    container.innerHTML = html;
}

// =========================================
// INIT
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    renderWorkoutCards();

    if (typeof renderAdaptiveHistory === "function") {
        renderAdaptiveHistory("adaptiveHistoryContainer");
    }

    renderSubstitutionHistory("substitutionHistoryContainer");

    const todayBtn = document.getElementById("todayStartBtn");
    if (todayBtn) {
        todayBtn.addEventListener("click", () => {
            const fullBody = workouts.find(w => w.id === "full-body");
            if (fullBody) openModal(fullBody);
        });
    }
});
