<?php
include './includes/config.php';
include './includes/functions.php';

$dangerMessages = array();

// print_r($_SESSION['user']);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WEATHERCAST</title>

    <link rel="stylesheet" href="assets/style.css">
    <script src="assets/main.js"></script>
</head>

<body>
<button class="<?php if(!isset($_SESSION['user'])){echo 'loginMode';}?> logout mobile" onclick="window.location.href='/logout.php'; localStorage.clear()">Log out</button>
    <section class="left" id="leftColumn">
        <?php
        if (isset($_SESSION['user'])) {
            include './includes/addLocation.php';
        } else {
            if (isset($_GET['signup']) && $_GET['signup']) {
                include './includes/signup.php';
            } else {
                include './includes/login.php';
            }
        }
        ?>
        <p class="apiContribution">

            Powered by <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
            <a href="https://www.weatherapi.com/" title="Free Weather API"><img src='//cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com" border="0"></a>
        </p>
    </section>
    <section class="right" <?php if (isset($_SESSION['user'])) {
                                echo "style='background: white'";
                            } ?>>
        <?php
        if (!isset($_SESSION['user'])) {
            echo '<a href="https://www.freepik.com/vectors/cloud" class="contribution">Cloud vector created by starline - www.freepik.com</a>';
        } else {
            include './includes/weather.php';
        }
        ?>

    </section>
</body>

</html>