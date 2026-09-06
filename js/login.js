// PASSWORD SHOW / HIDE
const password = document.getElementById("password");

const showPassword =
    document.getElementById("showPassword");
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
// LOGIN VALIDATION
const form =
    document.getElementById("loginForm");

const email =
    document.getElementById("email");

const emailError =
    document.getElementById("emailError");

const passwordError =
    document.getElementById("passwordError");

const spinner =
    document.getElementById("spinner");

const signText =
    document.getElementById("signText");


form.addEventListener("submit", function (event) {

    event.preventDefault();
    // Reset errors
    emailError.textContent = "";

    passwordError.textContent = "";


    let valid = true;
    // EMAIL
    if (email.value.trim() === "") {

        emailError.textContent =
            "Please enter your email.";

        valid = false;

    } else if (!email.value.includes("@")) {

        emailError.textContent =
            "Please enter a valid email.";

        valid = false;

    }
    // PASSWORD

    if (password.value.trim() === "") {

        passwordError.textContent =
            "Please enter your password.";

        valid = false;

    } else if (password.value.length < 6) {

        passwordError.textContent =
            "Password must be at least 6 characters.";

        valid = false;

    }
    if (!valid) {

        return;

    }
    // LOADING
    spinner.style.display =
        "inline-block";

    signText.textContent =
        "Signing in...";
    setTimeout(function () {

        spinner.style.display =
            "none";

        signText.textContent =
            "Welcome back! ✓";
        
        window.location.href = "dashboard.html";

    }, 1500);

});
// SOCIAL BUTTON EFFECT
document
    .querySelectorAll(".social-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                this.style.transform =
                    "scale(.95)";

                setTimeout(() => {

                    this.style.transform =
                        "";

                }, 150);
            }
        );
    });