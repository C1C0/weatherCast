<button class="logout PC" onclick="window.location.href='/logout.php'">Log out</button>

<div class="cardsHolder" id="cards">
    <script type="text/javascript">
        _cities = onGetCertainData(<?php print_r(getCertainData('cities')) ?>, 'array');
        _lastUpdate = new Date(`${onGetCertainData(<?php print_r(getCertainData('lastUpdate'))?>)}`);
        _citiesData = onGetCertainData(<?php print_r(getCertainData('citiesData'))?>, 'array');
        showWeatherForAllCities(_cities, _citiesData);
    </script>
</div>