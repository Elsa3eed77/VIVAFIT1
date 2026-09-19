<?php

header("Content-Type: application/json");

require_once "db.php";

$userId = $_GET["id"] ?? "";

if ($userId === "") {

    echo json_encode([
        "success" => false,
        "message" => "User ID is required."
    ]);

    exit;
}

$stmt = $conn->prepare(
    "SELECT id, name, phone, email, age, height, weight, goal, profileImage
     FROM users
     WHERE id = ?"
);

$stmt->bind_param("i", $userId);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);

    exit;
}

$user = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "user" => $user
]);

$stmt->close();
$conn->close();

?>