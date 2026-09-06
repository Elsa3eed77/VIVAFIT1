
const password = document.getElementById("password");
const showPassword = document.getElementById("showPassword");

showPassword.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        this.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    } else {
        password.type = "password";
        this.innerHTML = '<i class="fa-regular fa-eye"></i>';
    }
});

const confirmPassword = document.getElementById("confirmPassword");
const showConfirmPassword = document.getElementById("showConfirmPassword");

showConfirmPassword.addEventListener("click", function () {
    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        this.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    } else {
        confirmPassword.type = "password";
        this.innerHTML = '<i class="fa-regular fa-eye"></i>';
    }
});
const form = document.getElementById("signupForm");

const name = document.getElementById("name");
const email = document.getElementById("email");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const spinner = document.getElementById("spinner");
const signText = document.getElementById("signText");


form.addEventListener("submit", function (event) {

    event.preventDefault();

    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let valid = true;

    if (name.value.trim() === "") {
        nameError.textContent = "Please enter your name.";
        valid = false;
    }

    if (email.value.trim() === "") {
        emailError.textContent = "Please enter your email.";
        valid = false;
    } else if (!email.value.includes("@")) {
        emailError.textContent = "Please enter a valid email.";
        valid = false;
    }

    if (password.value.trim() === "") {
        passwordError.textContent = "Please enter your password.";
        valid = false;
    } else if (password.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        valid = false;
    }

    if (confirmPassword.value.trim() === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        valid = false;
    } else if (confirmPassword.value !== password.value) {
        confirmPasswordError.textContent = "Passwords do not match.";
        valid = false;
    }


    if (!valid) {
        return;
    }


    spinner.style.display = "inline-block";
    signText.textContent = "Creating account...";


    setTimeout(function () {

        spinner.style.display = "none";
        signText.textContent = "Account Created! ✓";

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 500);

    }, 1500);

});

