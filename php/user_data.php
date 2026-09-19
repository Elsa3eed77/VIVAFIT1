<?php

header("Content-Type: application/json");

require_once "db.php";

// Ensure per-user data table exists (idempotent).
$conn->query(
    "CREATE TABLE IF NOT EXISTS user_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        data_key VARCHAR(100) NOT NULL,
        data_value LONGTEXT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_key (user_id, data_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
);

$method = $_SERVER["REQUEST_METHOD"];

// ------------------------------------------------------------
// GET  php/user_data.php?userId=1
// Returns every stored key/value for that user.
// ------------------------------------------------------------
if ($method === "GET") {

    $userId = $_GET["userId"] ?? "";

    if (!ctype_digit($userId)) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid userId."
        ]);

        exit;
    }

    $stmt = $conn->prepare(
        "SELECT data_key, data_value FROM user_data WHERE user_id = ?"
    );

    $stmt->bind_param("i", $userId);

    $stmt->execute();

    $result = $stmt->get_result();

    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[$row["data_key"]] = $row["data_value"];
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

    $stmt->close();
    $conn->close();

    exit;
}

// ------------------------------------------------------------
// POST php/user_data.php   { userId, key, value }
// Upserts one data key for that user.
// ------------------------------------------------------------
if ($method === "POST") {

    $body = json_decode(file_get_contents("php://input"), true);

    $userId = trim($body["userId"] ?? "");
    $key = trim($body["key"] ?? "");
    $value = $body["value"] ?? null;

    if (!ctype_digit($userId) || $key === "" || strlen($key) > 100) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid input."
        ]);

        exit;
    }

    $stmt = $conn->prepare(
        "INSERT INTO user_data (user_id, data_key, data_value)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE data_value = ?"
    );

    $stmt->bind_param("isss", $userId, $key, $value, $value);

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => $conn->error
        ]);

    }

    $stmt->close();
    $conn->close();

    exit;
}

echo json_encode([
    "success" => false,
    "message" => "Method not allowed."
]);

$conn->close();

?>