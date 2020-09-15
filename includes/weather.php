<button class="logout" onclick="window.location.href='/logout.php';">Log out</button>

<div class="cardsHolder" id="cards">
    <script type="text/javascript">
        onGetCities(<?php print_r(getCities()) ?>);
        showWeatherForAllCities();
    </script>


</div>