<?php

header("Content-Type: application/json");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";


// Check empty fields
if ($email === "" || $password === "") {

    echo json_encode([
        "success" => false,
        "message" => "Please enter email and password."
    ]);

    exit;
}


// Find user by email
$stmt = $conn->prepare(
    "SELECT id, name, email, password FROM users WHERE email = ?"
);

$stmt->bind_param("s", $email);

$stmt->execute();

$result = $stmt->get_result();


// Email not found
if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Email or password is incorrect."
    ]);

    exit;
}


$user = $result->fetch_assoc();


// Check password
if (!password_verify($password, $user["password"])) {

    echo json_encode([
        "success" => false,
        "message" => "Email or password is incorrect."
    ]);

    exit;
}


// Login successful
echo json_encode([

    "success" => true,

    "message" => "Login successful.",

    "user" => [
        "id" => $user["id"],
        "name" => $user["name"],
        "email" => $user["email"]
    ]

]);


$stmt->close();
$conn->close();

?>