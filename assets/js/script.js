// Find long and Lat of searched City

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//Pass in Long & Lat + Personal weatherapi apikey
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

var myApiKey = 'f05af73148e926c7dab18966a3e1b58e';
var baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/';
var openWeatherIconUrl = ' http://openweathermap.org/img/wn/';
var currentWeather = baseWeatherUrl + `weather?`;
var forecastWeather = baseWeatherUrl + `forecast?`;
var weatherUnits = '&units=metric'
//var city = 'London';
var city = '';
var todaysWeatherSection = $('#today');
var forecastWeatherSection = $('#forecast');
var searchList = $('div ul')
var todaycnt = 0;
var forecastcnt = 0;

function storeCitysSearched(arr){
    localStorage.setItem('citysearches', JSON.stringify(arr))
};

function retrieveCitysSearched(){
    // Get array from localstorage, but if empty (no city searches yet) it would return as undef, 
    // so adding 'or' state (||) to create a empty array 
    return JSON.parse(localStorage.getItem('citysearches')) || [];
};

function displayWeather(type, weather){

    if (!weather) {
        noMatch();
    } else {
            if (type == 'today') {
                // todaysWeatherSection.html('');
                todaysWeatherSection.empty();
                

                todaysWeatherSection.append(`
                    <h2>Todays Weather</h2>
                    <div class="todays-weather-card">
                        <p id="todays-1">${weather[0]}</p>
                        <p id="todays-2">${weather[1]}</p>
                        <p id="todays-3">${weather[2]}</p>
                        <img src="${weather[3]}" alt="Current Weather Symbol" id="todays-img">
                    </div>
                `) 
            } else {
                    if (forecastcnt < 1) {
                        // forecastWeatherSection.html('');
                        forecastWeatherSection.empty();
                        forecastWeatherSection.append(`
                            <h2>5 Day Forecast</h2>
                        `);
                    }

                    forecastcnt++;

                    forecastWeatherSection.append(`
                            <div class="forcast-weather-card">
                                <h3>${weather[0]}</h3>
                                <p>${weather[1]}</p>
                                <p>${weather[2]}</p>
                                <p>${weather[3]}</p>
                                <img src="${weather[4]}" alt="Current Weather Symbol" id="forecast-img"'>
                            </div>
                    `);
            
            };
    };
};

function displayCitiesSearched() {

    searchList.append(`
        <li>Blah<button>Remove</button></li>
    `); 
};

function addCitySearched() {
    var getcitys = retrieveCitysSearched();
    var searchTxt = city;

    // get citys search data
    var currentCitiesSearched = getcitys;
    
    console.log(`localstorage contains: ${currentCitiesSearched}`)

    console.log('hitting for loop');

    //is the 'indexOf' array method to check the entire array data of getcitys, to see if users search is unique
    if (currentCitiesSearched.indexOf(searchTxt) === -1) {
        //as nothing is found the index returned as -1 so is a unique value
        console.log(`Add new item ${searchTxt} to temp citysearched array`)
        currentCitiesSearched.push(searchTxt);
        console.log('Add new city list to the local storage')
        storeCitysSearched(currentCitiesSearched);
        console.log('check out new items after local storage update')
        getcitys = retrieveCitysSearched();
        console.log(`localstore has: ${getcitys}`)
    } else {
        console.log(`This item (${searchTxt}) already exists`);
        alert(`This item (${searchTxt}) already exists in search history`);
        return;
    }; 

};

function getWeatherData() {

    var timeDate = '';
    var temp = '';
    var windS = ''
    var humidity = '';
    var weathImg = '';
    outputArr = [];

    addCitySearched();

    $.get(currentWeather + `q=${city}&appid=${myApiKey}` + weatherUnits)
        .then(function(data) {
            console.log(data);
            var lon = data.coord.lon;
            var lat = data.coord.lat;
            outputArr = [];

            // Read out of items to add to current weather display area
            // console.log(`
            // -----Curent Conditions---------
            // Temp: ${data.main.temp} Deg C
            // Wind Speed: ${data.main.speed} M/s
            // Humidity: ${data.main.humidity} %
            // `);

            // outputArr.push `${data.main.temp} Deg C`;
            // outputArr.push `${data.wind.speed} M/s`;
            // outputArr.push `${data.main.humidity} %`;
            temp = `Temp: ${data.main.temp} °C`;
            windS = `Wind Speed: ${data.wind.speed} m/s`;
            humidity = `Humidity: ${data.main.humidity} %`;
            weathImg = `${openWeatherIconUrl}${data.weather[0].icon}@4x.png`

            outputArr.push(`${temp}`);
            outputArr.push(`${windS}`);
            outputArr.push(`${humidity}`);
            outputArr.push(`${weathImg}`);

            // console.log(`Todays Weather Data: ${outputArr}`)

            // for (var item of outputArr) {
            //     console.log (item);
            // // }
            displayWeather('today', outputArr);



        $.get(forecastWeather + `lat=${lat}&lon=${lon}&appid=${myApiKey}` + weatherUnits)
            .then(function (forecastData) {
                // console.log (forecastData);
                var forecastArr = forecastData.list

                // var testText = 'bob';
              
                for (var forecast of forecastArr){
                //     // console.log(forecast);
                //     // console.log(forecast.dt_txt);

                    var forecastDnT = '';
                    
                    forecastDnT = forecast.dt_txt;

                    if (forecastDnT.match('12:00:00')) {
                        // console.log(forecast);
                        // console.log(forecast.weather);

                        var weatherImgArr = [];
                        weatherImgArr = forecast.weather;

                        // console.log(weatherImgArr[0].icon);

                        // Read out of items to add to forecast weather display area
                        // console.log(`
                        // Date & Time: ${forecast.dt_txt}
                        // Forecast Img:  ${weatherImgArr[0].icon}
                        // Temp: ${forecast.main.temp}
                        // Wind Speed: ${forecast.wind.speed}
                        // Humidity: ${forecast.main.humidity}
                        // `);

                        //erase array content
                        outputArr = [];

                        timeDate = `${forecast.dt_txt}`;
                        temp = `Temp: ${forecast.main.temp} °C`;
                        windS = `Wind Speed: ${forecast.wind.speed} m/s`;
                        humidity = `Humidity: ${forecast.main.humidity} %`;
                        weathImg = `${openWeatherIconUrl}${forecast.weather[0].icon}@2x.png`

                        // outputArr.push(`${forecast.dt_txt}`);
                        // outputArr.push(`${forecast.main.temp}`);
                        // outputArr.push(`${forecast.wind.speed}`);
                        // outputArr.push(`${forecast.main.humidity}`);
                        // outputArr.push(`${openWeatherIconUrl}${weatherImgArr[0].icon}@2x.png`);

                        outputArr.push(`${timeDate}`);
                        outputArr.push(`${temp}`);
                        outputArr.push(`${windS}`);
                        outputArr.push(`${humidity}`);
                        outputArr.push(`${weathImg}`);

                        // console.log (`Forecast Weather Data: ${outputArr}`);
                        displayWeather('forecast', outputArr);
                    };
                };

                // Reset forecast call count used in displayWeather func to run a clear and add title on first iter of 5 day data
                forecastcnt = 0;
            });
    });
}

function init () {
    city = $('#search-input').val();

    // console.log('in iit func');
    // console.log(`city is: ${city}`);
    getWeatherData();
};

$('#search-button').click(init);