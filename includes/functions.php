<?php

function login()
{
    global $conn;
    if ($_POST && isset($_POST['login'])) {

        $stmt = $conn->prepare('SELECT * FROM users WHERE email=:email AND password=:password');
        $stmt->bindParam(':email', $_POST['email']);
        $stmt->bindParam(':password', $_POST['password']);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!count($result)) {
            return ("Incorect credentials");
        }

        $_SESSION['user'] = $result[0];
        header('Location: index.php');
        exit;
    }
}


function signup()
{
    global $conn;
    if ($_POST && isset($_POST['signup'])) {
        //check passwords
        if ($_POST['password'] != $_POST['passwordConfirm'])
            return "Passwords are not matching";

        //check email address
        $stmt = $conn->prepare('SELECT email FROM users WHERE email=:email');
        $stmt->bindParam('email', $_POST['email']);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($result != [])
            return "This email address has been already used.";

        //Create new user
        $stmt = $conn->prepare('INSERT INTO users(id, email, password) VALUES ("", :email, :password)');
        $stmt->bindParam('email', $_POST['email']);
        $stmt->bindParam('password', $_POST['password']);
        $stmt->execute();

        $stmt = $conn->prepare('SELECT * FROM users WHERE id=:id');
        $stmt->bindParam('id', $conn->lastInsertId());
        $stmt->execute();

        $_SESSION['user'] = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];

        header('Location: index.php');
        exit;
    }
}

function getCities(){
    global $conn;
    $stmt = $conn->prepare('SELECT cities FROM users WHERE id=:id');
    $userId = $_SESSION['user']['id'];
    $stmt->bindParam('id', $userId);
    $stmt->execute();
    return json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)[0]);
}
