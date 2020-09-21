<?php

include '../includes/config.php';
include '../includes/functions.php';


if (isset($_POST['cities']) && !empty($_POST['cities'])) {
    //updates cities in DB
    $cities = $_POST['cities'];

    //! DO NOT MESS WITH BRACKETS
    connectToDB(
        "UPDATE users SET cities='" . $cities . "' WHERE id=" . $_SESSION['user']['id']
    );

    http_response_code(200);
    echo json_encode(['code' => '200', 'message' => 'Data successfully uploaded to server']);
    exit;
}

if (isset($_POST['lastUpdate']) && !empty($_POST['lastUpdate'])) {
    //updates lastUpdate
    //2020-09-15 00:00:00

    connectToDB(
        "UPDATE users SET lastUpdate='" . date("Y-m-d H:i:s") . "' WHERE id=" . $_SESSION['user']['id']
    );

    http_response_code(200);
    echo json_encode(['code' => '200', 'message' => '"Last Update" time updated on server']);
    exit;
}

http_response_code(404);
echo json_encode(['code' => '404', 'message' => 'Request could not be handled']);

unset($_SESSION);
session_destroy();
