<?php

function login()
{
    global $dangerMessages;

    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    //Check email and Password
    if (empty($email) || empty($password)) {
        empty($email) ? array_push($dangerMessages, 'Email Required') : '';
        empty($password) ? array_push($dangerMessages, 'Password Required') : '';
        return;
    }

    //Select user
    $result = connectToDB(
        'SELECT * FROM users WHERE email="' . $email . '"',
        'SELECT'
    );

    //check presence of record in DB
    if (!count($result)) {
        array_push($dangerMessages, 'This email address has not been found in database');
        return;
    };

    //Check whether correct password provided; if so - redirect and upload to Session
    if (password_verify($password, $result[0]['password'])) {
        $_SESSION['user'] = $result[0];
        header('Location: index.php');
    } else {
        array_push($dangerMessages, 'This email address has not been found in database');
    }

    exit;
}

function signup()
{
    global $conn;
    global $dangerMessages;

    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $passwordConfirm = trim($_POST['passwordConfirm']);

    //Check input data presence
    if (empty($email) || empty($password) || empty($passwordConfirm)) {
        empty($email) ? array_push($dangerMessages, 'Email Required') : '';
        empty($password) ? array_push($dangerMessages, 'Password Required') : '';
        empty($passwordConfirm) ? array_push($dangerMessages, 'Confirming password Required') : '';
        return;
    }

    //check if are passwords equal
    if ($password !== $passwordConfirm) {
        array_push($dangerMessages, 'Passwords have to be identical');
        return;
    }

    //check email address if not already registered
    $result = connectToDB(
        'SELECT email FROM users WHERE email="' . $email . '"',
        'SELECT'
    );

    if ($result != []) {
        array_push($dangerMessages, "This email address has been already used.");
        return;
    }

    //Hash password
    $password = password_hash($password, PASSWORD_DEFAULT);

    //Create new user
    connectToDB(
        'INSERT INTO users(id, email, password) VALUES ("", "' . $email . '","' . $password . '")'
    );

    //Get newly added user by ID
    $result = connectToDB(
        'SELECT * FROM users WHERE id=' . $conn->lastInsertId(),
        'SELECT'
    );

    //start session and redirect
    $_SESSION['user'] = $result[0];
    header('Location: index.php');
    exit;
}

function connectToDB($queryString, $type = '')
{
    global $conn;

    //prepare query
    $stmt = $conn->prepare($queryString);

    //execute
    $stmt->execute();

    if ($type === 'SELECT')
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getCertainData($column)
{
    //get certain data from DB and insert them into JS script
    return json_encode(connectToDB(
        'SELECT ' . $column . ' FROM users WHERE id=' . $_SESSION['user']['id'],
        'SELECT'
    )[0]);
}

//show notification
function notifDanger($messages)
{
    foreach ($messages as $message) {
        echo "<p class='danger'>$message</p>";
    }
}
