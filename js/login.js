console.log("LOGIN JS LOADED");

const form = document.getElementById("loginForm");

const email = document.getElementById("email");
const password = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const spinner = document.getElementById("spinner");
const signText = document.getElementById("signText");

const showPassword = document.getElementById("showPassword");


// SHOW / HIDE PASSWORD

showPassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        this.innerHTML =
            '<i class="fa-regular fa-eye-slash"></i>';

    } else {

        password.type = "password";

        this.innerHTML =
            '<i class="fa-regular fa-eye"></i>';

    }

});


// LOGIN

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    console.log("LOGIN BUTTON WORKED");


    // Clear old data first

    localStorage.removeItem("userId");
    localStorage.removeItem("userName");


    // Clear errors

    emailError.textContent = "";
    passwordError.textContent = "";


    const userEmail = email.value.trim();
    const userPassword = password.value;


    // Validation

    if (userEmail === "") {

        emailError.textContent =
            "Please enter your email.";

        return;
    }


    if (!userEmail.includes("@")) {

        emailError.textContent =
            "Please enter a valid email.";

        return;
    }


    if (userPassword === "") {

        passwordError.textContent =
            "Please enter your password.";

        return;
    }


    if (userPassword.length < 6) {

        passwordError.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    // Loading

    spinner.style.display = "inline-block";

    signText.textContent = "Signing in...";


    try {

        const response = await fetch(
            "php/login.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email: userEmail,

                    password: userPassword

                })
            }
        );


        const result = await response.json();

        console.log("PHP RESULT:", result);


        // WRONG EMAIL OR PASSWORD

        if (!result.success) {

            spinner.style.display = "none";

            signText.textContent = "Sign In";

            passwordError.textContent =
                result.message;

            return;
        }


        // CORRECT LOGIN

        localStorage.setItem(
            "userId",
            result.user.id
        );

        localStorage.setItem(
            "userName",
            result.user.name
        );


        spinner.style.display = "none";

        signText.textContent =
            "Welcome back! ✓";


        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 500);


    } catch (error) {

        console.error("LOGIN ERROR:", error);

        spinner.style.display = "none";

        signText.textContent = "Sign In";

        emailError.textContent =
            "Something went wrong. Please try again.";

    }

});