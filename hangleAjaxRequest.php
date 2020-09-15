<?php

include './includes/config.php';

if(isset($_POST['cities'])){
    global $conn;
    $stmt = $conn->prepare('UPDATE users SET cities=:cities where id=:id');
    $stmt->bindParam('cities', $_POST['cities']);
    $stmt->bindParam('id', $_SESSION['user']['id']);
    $stmt->execute();
    echo json_encode(['status'=>$_POST['cities']]);
    exit;
}

echo json_encode(['code'=>'404', 'post'=>$_POST]);

unset($_SESSION); 
session_destroy();