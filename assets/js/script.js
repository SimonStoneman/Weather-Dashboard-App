// Find long and Lat of searched City

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//Pass in Long & Lat + Personal weatherapi apikey
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

var myApiKey = 'f05af73148e926c7dab18966a3e1b58e';
var baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/';
var currentWeather = baseWeatherUrl + `weather?`;
var forecastWeather = baseWeatherUrl + `forecast?`;
var weatherUnits = '&units=metric'
//var city = 'London';
var city = '';

function storeCitysSearched(arr){
    localStorage.setItem('citysearches', JSON.stringify(arr))
};

function retrieveCitysSearched(){
    // Get array from localstorage, but if empty (no city searches yet) it would return as undef, 
    // so adding 'or' state (||) to create a empty array 
    return JSON.parse(localStorage.getItem('citysearches')) || [];
};

function displayCurrentWeather(){};

function displayForecastWeather(){};

function addCitySearched () {
    var getcitys = retrieveCitysSearched();
    var searchTxt = city;

    //get citys search data
    // var currentCitiesSearched = getcitys.push(searchTxt);
    
    console.log(`localstorage contains: ${getcitys}`)

    console.log('hitting for loop');

    //is the 'indexOf' array method to check the entire array data of getcitys, to see if users search is unique
    if (getcitys.indexOf(searchTxt) === -1) {
        //as nothing is found the index returned as -1 so is a unique value

        currentCitiesSearched.push(searchTxt)
        storeCitysSearched(getcitys);
    } else {
        console.log(`This item (${searchTxt}) already exists`);
    }; 

};

function getWeatherData() {

    $.get(currentWeather + `q=${city}&appid=${myApiKey}` + weatherUnits)
        .then(function(data) {
            console.log(data);
            var lon = data.coord.lon;
            var lat = data.coord.lat;

            console.log(`
            -----Curent Conditions---------
            Temp: ${data.main.temp} Deg C
            Wind: ${data.main.speed} M/s
            Humidity: ${data.main.humidity} %
            `);

        $.get(forecastWeather + `lat=${lat}&lon=${lon}&appid=${myApiKey}` + weatherUnits)
            .then(function (forecastData) {
                console.log (forecastData);
                
            });
    });

    addCitySearched();
}

function init () {
    city = $('#search-input').val();

    console.log('in iit func');
    console.log(`city is: ${city}`);
    getWeatherData ();
};

$('#search-button').click(init);