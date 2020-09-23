let _api = "3d6c0c474c7e420596383154201509";
let _cities = [];
let _citiesData = [];
let _lastUpdate;
let _lastAddedCity = {};

let APIFetchingPromisies = [];

let leftColumn;
let locationForm;

let updatingLSInterval;

/**
 * Return string or JSON parsed object
 * @param {String} parseableObject String which might contain parsable object
 * @param {string} type What type of variable return if unable to parse object
 * @returns {any[] | any{} | string }
 */
function onGetCertainData(parseableObject, type = "") {
  let stringValue = Object.entries(parseableObject)[0][1];
  console.log(stringValue);
  try {
    if (stringValue === undefined || stringValue === null) {
      switch (type) {
        case "array":
          return [];
        case "object":
          return {};
        default:
          return "";
      }
    }
    return JSON.parse(stringValue);
  } catch (e) {
    return stringValue;
  }
}

/**
 * Initialize DOM Elements
 */
function initLocationForm() {
  leftColumn = document.getElementById("leftColumn");
  locationForm = document.getElementById("locationForm");
  locationForm.addEventListener("submit", onAddCity);
}

/**
 * Creates alert element and shows it on screen
 * @param {HTMLElement} parent DOM element into which will be alert implemented
 * @param {HTMLElement} referenced DOM element before which will be alert implemented
 * @param {string} alertID ID of the alert element
 * @param {string} message Message which will be included inside alert
 * @param {string} type CSS class which styles the alert
 */
function showAlert(parent, referenced, alertID, message, type = "danger") {
  //ID is used for removing element from screen with removeAlert()
  let p = document
    .createRange()
    .createContextualFragment(
      `<p class="notification ${type}" id="${alertID}">${message}</p>`
    );
  parent.insertBefore(p, referenced);

  setTimeout(removeAlert, 3500);
}

/**
 * Remove all warning messages
 */
function removeAlert() {
  let notifications = Array.from(
    document.getElementsByClassName("notification")
  );
  notifications.forEach((notification) => {
    notification.remove();
  });
  return;
}

/**
 * Loops through all visible cities and start individual fething
 * @param {string[]} cities Array of cities
 * @param {Object} citiesData Data which are included in Local Storage
 */
function showWeatherForAllCities(cities = [], citiesData) {
  //one hour
  let minUpdateTime = 3600000;
  let timeDifference = Math.abs(_lastUpdate.getTime() - new Date().getTime());

  //if no cities provided, no need to run the function
  if (!cities) return;

  citiesData = getFromLS("citiesData");

  if (timeDifference > minUpdateTime || !citiesData) {
    //clear citiesData
    citiesData = [];

    if (_cities.length !== 0) {
      console.log(_cities);
      showAlert(
        leftColumn,
        locationForm,
        "locationFormMessage",
        "Getting data from <b>WeatherAPI</b> server...",
        "warn"
      );
      //loop through _cities and fetch data
      _cities.forEach((city) => {
        APIFetchingPromisies.push(fetchCityData(city, citiesData));
      });
    }

    //when all data from API fetched, execute
    Promise.all(APIFetchingPromisies).then(() => {
      // add to LS
      addToLS("citiesData", citiesData);

      //then loop through data from _citiesData and getOnScreen()
      citiesData.forEach((locationData) => {
        getOnScreen("cards", htmlResponseCard(locationData));
      });

      sendToServer("lastUpdate", "true");
    });
  }

  //then update "lastUpdate" on server
  citiesData.forEach((locationData) => {
    getOnScreen("cards", htmlResponseCard(locationData));
  });

  return citiesData;
}

/**
 * Get data from local storage
 * @param {string} name Name of property in localStorage
 * @returns {any} Returns null or parsed item from LocalStorage if found some
 */
function getFromLS(name) {
  try {
    return JSON.parse(localStorage.getItem(name));
  } catch {
    return null;
  }
}

/**
 * Stringifies data and pushes to localStorage
 * @param {string} name Name of property in localStorage
 * @param {any} data Data to stringify and pass to localStorage
 */
function addToLS(name, data) {
  try {
    localStorage.setItem(name, JSON.stringify(data));
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Removes specified city from LocalStorage
 * @param {string} nameOfKey LocalStorage key
 * @param {*} specificCity City name which should be removed
 */
function deleteSpecificFromLS(nameOfKey, specificCity) {
  try {
    _citiesData = _citiesData.filter((location) => {
      return location.name.toLowerCase() != specificCity.toLowerCase();
    });
    addToLS(nameOfKey, _citiesData);
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Function tries to find and add city on the screen and to DB
 * @param {Event} e EventListener Event
 */
function onAddCity(e) {
  e.preventDefault();

  //Remove Warnings
  removeAlert("locationFormMessage");

  let requestedCity = e.target.location.value;

  //check if requested city value is provided
  if (!requestedCity) {
    showAlert(
      leftColumn,
      locationForm,
      "locationFormMessage",
      "Please, enter the valid city name"
    );
    return;
  }

  //check if requested city is not already in cities array
  if (_cities.length !== 0) {
    let lowercasedCities = _cities.map((city) => city.toLowerCase());
    console.log(lowercasedCities);
    if (lowercasedCities.includes(requestedCity.toLowerCase())) {
      showAlert(
        leftColumn,
        locationForm,
        "locationFormMessage",
        `You already see data for '${requestedCity}'`
      );
      return;
    }
  }

  //create call to weatherAPI server
  //find out, whether requested location exists
  //if exists, set to DB and add to _cities array
  fetchCityData(requestedCity, _citiesData).then((city) => {
    _cities.push(city);
    getOnScreen("cards", htmlResponseCard(_lastAddedCity));
    sendToServer("cities", _cities);
    //add to LS
    addToLS("citiesData", _citiesData);
  });

  //clear input value
  e.target.location.value = "";
}

/**
 * Function removes element from the screen and executes function to remove city name from DB
 * @param {Event} e EventListener Event
 */
function onDeleteCity(e) {
  e.preventDefault();

  removeAlert("locationFormMessage");

  //remove locally
  e.target.parentElement.remove();

  //get city name
  let city = e.target.nextElementSibling.innerText.split(",")[0];

  //remove from _cities array
  _cities = _cities.filter((_city) => {
    return _city.toLowerCase() !== city.toLowerCase();
  });

  //delete from LS
  deleteSpecificFromLS("citiesData", city);

  //send server new array
  sendToServer("cities", _cities);
}

/**
 * Fetch data from weatherAPI
 * @param {string} city Name of the city
 * @returns {Promise<string>} Resolving with name of city
 */
function fetchCityData(city, citiesData) {
  return new Promise((resolve, reject) => {
    let url = `http://api.weatherapi.com/v1/current.json?key=${_api}&q=${city}`;

    //make request to API
    fetch(url, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "api.weather.com",
      },
    })
      .then((response) => {
        //throw exception
        //e.g. if data for selected city not provided
        if (!response.ok) throw response.json();
        return response.json();
      })
      .then((weatherApi) => {
        _lastAddedCity = {
          name: weatherApi.location.name,
          temp: weatherApi.current.temp_c,
          condition: weatherApi.current.condition.text,
          icon: weatherApi.current.condition.icon,
        };

        citiesData.push(_lastAddedCity);

        //push searched city to the next promise
        resolve(weatherApi.location.name);
      })
      .catch((err) => {
        console.log(err);
        err.then((errObject) => {
          reject(errObject);
          showAlert(
            leftColumn,
            locationForm,
            "locationFormMessage",
            errObject.error.message
          );
        });
      });
  });
}

/**
 * Send string array to PHP server with FormData
 * @param {string} paramName name for sending data
 * @param {string[]} data
 */
function sendToServer(paramName, data) {
  //create form data object
  //php can hanlde this with $_POST['cities']
  let formData = new FormData();
  formData.append(paramName, JSON.stringify(data));

  //make a call
  fetch("api/hangleAjaxRequest.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((responseBody) => {
      showAlert(
        leftColumn,
        locationForm,
        "locationFormMessage",
        responseBody.message,
        "success"
      );
    });
}

/**
 * Insert HTML into element
 * @param {string} elementId ID of element into which will be element passed
 * @param {string} htmlString String with HTML elements
 */
function getOnScreen(elementId, htmlString) {
  document.getElementById(elementId).innerHTML += htmlString;
}

/**
 * @param {object} weatherData
 * @returns {string} Returns HTML card in string form
 */
function htmlResponseCard(weatherData) {
  return `
            <div class="card">
                <span class="removeCard" onclick="onDeleteCity(event)">X</span>
                <h2>${weatherData.name},&nbsp;<span class="temp">${weatherData.temp}</span></h2>
                <div class="content">
                    <p>${weatherData.condition}</p>
                    <img src="${weatherData.icon}" alt="Weather like image">
                </div>
            </div>`;
}
