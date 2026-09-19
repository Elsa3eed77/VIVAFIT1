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
        return getData(STORAGE_KEY, []);
    } catch {
        return [];
    }
}

function saveWorkouts(workoutsList) {
    saveData(STORAGE_KEY, workoutsList);
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
        history = getData(SUBSTITUTION_KEY, []);
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
