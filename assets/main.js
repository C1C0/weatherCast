let _api = '3d6c0...'; //set up before use
let _cities = [];

let leftColumn;
let locationForm;


function onGetCities(cities){
    let parsedCities = JSON.parse(cities.cities);

    _cities = parsedCities === null ? [] : parsedCities;
}

function initLocationForm(){
    leftColumn = document.getElementById('leftColumn');
    locationForm = document.getElementById('locationForm');
    locationForm.addEventListener('submit', onAddCity);
}

function initDataHolder(){
    removesElArray = document.getElementsByClassName('removeCard');
    removesElArray.forEach(removeEl => { 
        removeEl.addEventListener('click', onDeleteCity);
    })
}

function onAddCity(e){
    e.preventDefault();
    removeAlert();
    
    let requestedCity = e.target.location.value;
    
    //check if city doesn't exist
    if(_cities.includes(requestedCity)){
        showAlert(leftColumn, locationForm, 'locationFormMessage', `You already see data for ${requestedCity}`);
        return;
    }

    //create warning mesasge
    if(!requestedCity){
        showAlert(leftColumn, locationForm, 'locationFormMessage', 'Please, enter the valid city name');
        return;
    }

    //create call to weatherAPI server
    //find out, whether requested location exists
    //set to DB and add on 
    fetchCityData(requestedCity)
    .then(city => {_cities.push(city); sendToServer()});
    

    //clear input value
    e.target.location.value = '';

}

function onDeleteCity(e){
    e.preventDefault();

    //remove locally
    e.target.parentElement.remove()
    let city = e.target.nextElementSibling.innerText.split(',')[0];

    _cities = _cities.filter(_city => {
        return _city.toLowerCase() !== city.toLowerCase();
    })

    //remove from DB

    sendToServer();
}

function showAlert(parent, referenced, newElementId, wantMessage){
    let p = document.createElement('p');
    p.appendChild(document.createTextNode(wantMessage));
    p.className = 'danger';
    p.id = newElementId;
    parent.insertBefore(p, referenced);
}

function showWeatherForAllCities(){
    if(_cities){
        _cities.forEach(city => {
            fetchCityData(city);
        });
    }
}

function fetchCityData(city){
    return new Promise((resolve, reject)=>{
        let htmlResponse = '';
        let url = `http://api.weatherapi.com/v1/current.json?key=${_api}&q=${city}`;
        
        fetch(url, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'api.weather.com'
            }
        }).then( response => {
            //throw exception
            if(!response.ok)
                throw response.json();
            return response.json();
        }).then(data => {
            htmlResponse  = `
            <div class="card">
                <span class="removeCard" onclick="onDeleteCity(event)">X</span>
                <h2>${data.location.name},&nbsp;<span class="temp">${data.current.temp_c}</span></h2>
                <div class="content">
                    <p>${data.current.condition.text}</p>
                    <img src="${data.current.condition.icon}" alt="Weather like image">
                </div>
            </div>
            `;
    
            //create element on screen
            getOnScreen('cards', htmlResponse);
    
            resolve(data.location.name);
        }).catch(err => {
            err.then(errObject => {
                reject(errObject);
                showAlert(leftColumn, locationForm, 'locationFormMessage', errObject.error.message);
            });
        });
    })
    
}

function sendToServer(){
    let formData = new FormData();
    formData.append('cities', JSON.stringify(_cities));

    fetch('hangleAjaxRequest.php', {
        method: 'POST',
        body: formData,
    }).then(response => {
        return response.json();
    });
}

function getOnScreen(elementId, htmlString){
    document.getElementById(elementId).innerHTML += htmlString;
}

function removeAlert(){
    //remove warning message
    if(document.getElementById('locationFormMessage')){
        document.getElementById('locationFormMessage').remove();
    }
}
