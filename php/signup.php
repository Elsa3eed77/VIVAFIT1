<?php

header("Content-Type: application/json");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";


if ($name === "" || $email === "" || $password === "") {

    echo json_encode([
        "success" => false,
        "message" => "Please fill in all required fields."
    ]);

    exit;
}


/* Check if email already exists */

$check = $conn->prepare(
    "SELECT id FROM users WHERE email = ?"
);

$check->bind_param("s", $email);

$check->execute();

$check->store_result();


if ($check->num_rows > 0) {

    echo json_encode([
        "success" => false,
        "message" => "This email is already registered."
    ]);

    exit;
}


/* Hash password */

$hashedPassword =
    password_hash($password, PASSWORD_DEFAULT);


/* Create account */

$stmt = $conn->prepare(
    "INSERT INTO users (name, email, password)
     VALUES (?, ?, ?)"
);

$stmt->bind_param(
    "sss",
    $name,
    $email,
    $hashedPassword
);


if ($stmt->execute()) {

    /* Get new user's ID */

    $userId = $stmt->insert_id;


    echo json_encode([

        "success" => true,

        "message" => "Account created successfully.",

        "user" => [

            "id" => $userId,

            "name" => $name,

            "email" => $email

        ]

    ]);

} else {

    echo json_encode([

        "success" => false,

        "message" => "Could not create account."

    ]);

}


$stmt->close();
$check->close();
$conn->close();

?>