// PASSWORD SHOW / HIDE

const password =
    document.getElementById("password");

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


// CONFIRM PASSWORD SHOW / HIDE

const confirmPassword =
    document.getElementById("confirmPassword");

const showConfirmPassword =
    document.getElementById("showConfirmPassword");


showConfirmPassword.addEventListener("click", function () {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";

        this.innerHTML =
            '<i class="fa-regular fa-eye-slash"></i>';

    } else {

        confirmPassword.type = "password";

        this.innerHTML =
            '<i class="fa-regular fa-eye"></i>';

    }

});


// FORM

const form =
    document.getElementById("signupForm");


const name =
    document.getElementById("name");


const email =
    document.getElementById("email");


const nameError =
    document.getElementById("nameError");


const emailError =
    document.getElementById("emailError");


const passwordError =
    document.getElementById("passwordError");


const confirmPasswordError =
    document.getElementById("confirmPasswordError");


const spinner =
    document.getElementById("spinner");


const signText =
    document.getElementById("signText");


// SUBMIT

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Clear errors

    nameError.textContent = "";

    emailError.textContent = "";

    passwordError.textContent = "";

    confirmPasswordError.textContent = "";


    let valid = true;


    // NAME

    if (name.value.trim() === "") {

        nameError.textContent =
            "Please enter your name.";

        valid = false;

    }


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


    // CONFIRM PASSWORD

    if (confirmPassword.value.trim() === "") {

        confirmPasswordError.textContent =
            "Please confirm your password.";

        valid = false;

    } else if (
        confirmPassword.value !== password.value
    ) {

        confirmPasswordError.textContent =
            "Passwords do not match.";

        valid = false;

    }


    // Stop if invalid

    if (!valid) {

        return;

    }


    // LOADING

    spinner.style.display =
        "inline-block";

    signText.textContent =
        "Creating account...";


    try {

        const response = await fetch(
            "php/signup.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name:
                        name.value.trim(),

                    email:
                        email.value.trim(),

                    password:
                        password.value

                })

            }
        );


        const result =
            await response.json();


        // SUCCESS

        if (result.success) {

            // Save new user's ID

            localStorage.setItem(
                "userId",
                result.user.id
            );


            // Save user's name

            localStorage.setItem(
                "userName",
                result.user.name
            );


            spinner.style.display =
                "none";


            signText.textContent =
                "Account Created! ✓";


            // Go directly to Dashboard

            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 800);


        } else {

            // ACCOUNT NOT CREATED

            spinner.style.display =
                "none";


            signText.textContent =
                "Create Account";


            emailError.textContent =
                result.message;

        }


    } catch (error) {

        spinner.style.display =
            "none";


        signText.textContent =
            "Create Account";


        emailError.textContent =
            "Something went wrong. Please try again.";


        console.error(error);

    }

});