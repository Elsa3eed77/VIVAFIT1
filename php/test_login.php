<?php

require_once "db.php";

$email = "mariemelfarm997@gmail.com";

$stmt = $conn->prepare(
    "SELECT id, name, email, password FROM users WHERE email = ?"
);

$stmt->bind_param("s", $email);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    echo "Email NOT found";

} else {

    $user = $result->fetch_assoc();

    echo "Email found<br>";
    echo "User ID: " . $user["id"] . "<br>";

    if (password_verify("wrong123456", $user["password"])) {

        echo "Password MATCHES";

    } else {

        echo "Password DOES NOT MATCH";

    }
}

?>