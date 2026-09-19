<?php

header("Content-Type: application/json");

require_once "db.php";


$userId = $_POST["id"] ?? "";

$name = trim($_POST["name"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$age = $_POST["age"] ?? "";
$height = $_POST["height"] ?? "";
$weight = $_POST["weight"] ?? "";
$goal = trim($_POST["goal"] ?? "");


if ($userId === "" || $name === "") {

    echo json_encode([
        "success" => false,
        "message" => "Name and user ID are required."
    ]);

    exit;
}


// Convert empty values to NULL
$phone = $phone === "" ? null : $phone;
$age = $age === "" ? null : $age;
$height = $height === "" ? null : $height;
$weight = $weight === "" ? null : $weight;
$goal = $goal === "" ? null : $goal;


$profileImage = null;


// Check if user selected a new image
if (isset($_FILES["profileImage"]) &&
    $_FILES["profileImage"]["error"] === UPLOAD_ERR_OK) {

    $uploadDir = "../images/profile/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }


    $fileName = time() . "_" . basename($_FILES["profileImage"]["name"]);

    $targetFile = $uploadDir . $fileName;


    $allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ];


    if (!in_array($_FILES["profileImage"]["type"], $allowedTypes)) {

        echo json_encode([
            "success" => false,
            "message" => "Please upload a valid image."
        ]);

        exit;
    }


    if (!move_uploaded_file(
        $_FILES["profileImage"]["tmp_name"],
        $targetFile
    )) {

        echo json_encode([
            "success" => false,
            "message" => "Could not upload image."
        ]);

        exit;
    }


    $profileImage = "images/profile/" . $fileName;
}


// Update without changing image
if ($profileImage === null) {

    $stmt = $conn->prepare(
        "UPDATE users
         SET name = ?, phone = ?, age = ?, height = ?, weight = ?, goal = ?
         WHERE id = ?"
    );

    $stmt->bind_param(
        "ssiddsi",
        $name,
        $phone,
        $age,
        $height,
        $weight,
        $goal,
        $userId
    );


// Update with new image
} else {

    $stmt = $conn->prepare(
        "UPDATE users
         SET name = ?, phone = ?, age = ?, height = ?, weight = ?, goal = ?, profileImage= ?
         WHERE id = ?"
    );

    $stmt->bind_param(
        "ssiddssi",
        $name,
        $phone,
        $age,
        $height,
        $weight,
        $goal,
        $profileImage,
        $userId
    );
}


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Profile updated successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Could not update profile."
    ]);
}


$stmt->close();
$conn->close();

?>