// =========================================
// PROFILE ELEMENTS
// =========================================

const imageInput = document.getElementById("imageInput");
const profileImage = document.getElementById("profileImage");

const saveButton = document.getElementById("saveProfile");
const saveText = document.getElementById("saveText");
const saveMessage = document.getElementById("saveMessage");

const logoutButton = document.getElementById("logoutBtn");


// =========================================
// LOAD SAVED PROFILE
// =========================================

window.addEventListener("load", function () {

    const savedProfile =
        JSON.parse(localStorage.getItem("vivafitProfile"));

    if (!savedProfile) {
        return;
    }

    document.getElementById("name").value =
        savedProfile.name || "";

    document.getElementById("phone").value =
        savedProfile.phone || "";

    document.getElementById("email").value =
        savedProfile.email || "";

    document.getElementById("age").value =
        savedProfile.age || "";

    document.getElementById("height").value =
        savedProfile.height || "";

    document.getElementById("weight").value =
        savedProfile.weight || "";

    document.getElementById("goal").value =
        savedProfile.goal || "";

    if (savedProfile.image) {

        profileImage.src =
            savedProfile.image;

    }

});


// =========================================
// CHANGE PROFILE PICTURE
// =========================================

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        profileImage.src =
            event.target.result;

    };

    reader.readAsDataURL(file);

});


// =========================================
// SAVE PROFILE
// =========================================

saveButton.addEventListener("click", function () {

    const profile = {

        name:
            document.getElementById("name").value,

        phone:
            document.getElementById("phone").value,

        email:
            document.getElementById("email").value,

        age:
            document.getElementById("age").value,

        height:
            document.getElementById("height").value,

        weight:
            document.getElementById("weight").value,

        goal:
            document.getElementById("goal").value,

        image:
            profileImage.src

    };


    localStorage.setItem(
        "vivafitProfile",
        JSON.stringify(profile)
    );


    // Success message

    saveText.textContent =
        "Saved! ✓";

    saveMessage.textContent =
        "Your profile has been saved successfully.";


    setTimeout(function () {

        saveText.textContent =
            "Save Changes";

        saveMessage.textContent =
            "";

    }, 2000);

});


// =========================================
// LOGOUT
// =========================================

logoutButton.addEventListener("click", function () {

    window.location.href =
        "login.html";

});


// =========================================
// SAVED WORKOUTS
// =========================================

const savedWorkoutsContainer =
    document.getElementById("savedWorkouts");


function getSavedWorkouts() {

    try {
        return JSON.parse(
            localStorage.getItem("vivafitWorkouts")
        ) || [];
    } catch {
        return [];
    }

}


function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {

        month: "short",

        day: "numeric",

        year: "numeric"

    });

}


function renderSavedWorkouts() {

    const workouts = getSavedWorkouts();


    if (workouts.length === 0) {

        savedWorkoutsContainer.innerHTML = `
            <div class="workouts-empty">
                <i class="fa-solid fa-dumbbell"></i>
                No saved workouts yet.<br>
                Go to Workouts to add some!
            </div>
        `;

        return;

    }


    savedWorkoutsContainer.innerHTML = workouts.map(function (w) {

        return `
            <div class="saved-workout-card" data-id="${w.id}">
                <button
                    class="remove-workout-btn"
                    data-id="${w.id}"
                    title="Remove workout">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="card-icon">
                    <i class="${w.icon || 'fa-solid fa-dumbbell'}"></i>
                </div>
                <div class="card-name">${w.name}</div>
                <div class="card-category">${w.category}</div>
                <div class="card-date">Added ${formatDate(w.addedAt)}</div>
            </div>
        `;

    }).join("");

}


function removeWorkout(id) {

    let workouts = getSavedWorkouts();

    workouts = workouts.filter(function (w) {

        return w.id !== id;

    });

    localStorage.setItem(
        "vivafitWorkouts",
        JSON.stringify(workouts)
    );

    renderSavedWorkouts();

}


savedWorkoutsContainer.addEventListener("click", function (e) {

    const btn = e.target.closest(".remove-workout-btn");

    if (!btn) {
        return;
    }

    removeWorkout(btn.dataset.id);

});


renderSavedWorkouts();