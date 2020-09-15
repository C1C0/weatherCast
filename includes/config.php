<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbName = "weathercast";

$conn = new PDO("mysql:host=$servername;dbname=$dbName", $username, $password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
