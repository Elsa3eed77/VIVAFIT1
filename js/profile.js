console.log("PROFILE JS LOADED");
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
// GET LOGGED-IN USER
// =========================================

const userId = localStorage.getItem("userId");

console.log("Logged in user ID:", userId);


// If no user is logged in
if (!userId) {

    window.location.href = "login.html";

}


// =========================================
// LOAD PROFILE FROM DATABASE
// =========================================

async function loadProfile() {

    try {

        const response = await fetch(
    "php/get_profile.php?id=" + userId
);

console.log("Profile response status:", response.status);

const result = await response.json();

console.log("Profile result:", result);

        


        if (!result.success) {

            alert(result.message);

            window.location.href = "login.html";

            return;
        }


        const user = result.user;


        document.getElementById("name").value =
            user.name || "";

        document.getElementById("phone").value =
            user.phone || "";

        document.getElementById("email").value =
            user.email || "";

        document.getElementById("age").value =
            user.age || "";

        document.getElementById("height").value =
            user.height || "";

        document.getElementById("weight").value =
            user.weight || "";

        document.getElementById("goal").value =
            user.goal || "";

// Show saved profile image
if (user.profileImage) {

    profileImage.src =
        user.profileImage;

}
        


    } catch (error) {

        console.error(error);

        saveMessage.textContent =
            "Could not load your profile.";

    }

}


// Load profile when page opens
window.addEventListener("load", function () {

    loadProfile();

    renderSavedWorkouts();

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
// SAVE PROFILE TO DATABASE
// =========================================

saveButton.addEventListener("click", async function () {

    saveText.textContent =
        "Saving...";


    saveMessage.textContent =
        "";


    const formData = new FormData();


    formData.append(
        "id",
        userId
    );


    formData.append(
        "name",
        document.getElementById("name").value.trim()
    );


    formData.append(
        "phone",
        document.getElementById("phone").value.trim()
    );


    formData.append(
        "age",
        document.getElementById("age").value
    );


    formData.append(
        "height",
        document.getElementById("height").value
    );


    formData.append(
        "weight",
        document.getElementById("weight").value
    );


    formData.append(
        "goal",
        document.getElementById("goal").value
    );


    // Add image only if user selected one
    if (imageInput.files[0]) {

        formData.append(
            "profileImage",
            imageInput.files[0]
        );

    }


    try {

        const response = await fetch(
            "php/update_profile.php",
            {
                method: "POST",
                body: formData
            }
        );


        const result = await response.json();


        if (result.success) {

            saveText.textContent =
                "Saved! ✓";

            saveMessage.textContent =
                "Your profile has been saved successfully.";


            // Update stored name
            localStorage.setItem(
                "userName",
                document.getElementById("name").value.trim()
            );


            setTimeout(function () {

                saveText.textContent =
                    "Save Changes";

                saveMessage.textContent =
                    "";

            }, 2000);


        } else {

            saveText.textContent =
                "Save Changes";

            saveMessage.textContent =
                result.message;

        }


    } catch (error) {

        console.error(error);

        saveText.textContent =
            "Save Changes";

        saveMessage.textContent =
            "Something went wrong. Please try again.";

    }

});


// =========================================
// LOGOUT
// =========================================

logoutButton.addEventListener("click", function () {

    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

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

        return getData("vivafitWorkouts", []) || [];

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


    savedWorkoutsContainer.innerHTML =
        workouts.map(function (w) {

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

                    <div class="card-name">
                        ${w.name}
                    </div>

                    <div class="card-category">
                        ${w.category}
                    </div>

                    <div class="card-date">
                        Added ${formatDate(w.addedAt)}
                    </div>

                </div>
            `;

        }).join("");

}


function removeWorkout(id) {

    let workouts =
        getSavedWorkouts();


    workouts =
        workouts.filter(function (w) {

            return w.id !== id;

        });


    saveData(
        "vivafitWorkouts",
        workouts
    );


    renderSavedWorkouts();

}


savedWorkoutsContainer.addEventListener(
    "click",
    function (e) {

        const btn =
            e.target.closest(".remove-workout-btn");


        if (!btn) {
            return;
        }


        removeWorkout(btn.dataset.id);

    }
);