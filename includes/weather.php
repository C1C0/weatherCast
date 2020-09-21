<button class="logout" onclick="window.location.href='/logout.php';">Log out</button>

<div class="cardsHolder" id="cards">
    <script type="text/javascript">
        _cities = onGetCertainData(<?php print_r(getCertainData('cities')) ?>);
        _lastUpdate = new Date(onGetCertainData(<?php print_r(getCertainData('lastUpdate'))?>));
        _citiesData = showWeatherForAllCities(_cities, _citiesData);
    </script>
</div>