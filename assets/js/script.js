// ----GLOBAL VARIABLE SECTION START----

var myApiKey = 'f05af73148e926c7dab18966a3e1b58e';
var baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/';
var openWeatherIconUrl = ' http://openweathermap.org/img/wn/';
var currentWeather = baseWeatherUrl + `weather?`;
var forecastWeather = baseWeatherUrl + `forecast?`;
var weatherUnits = '&units=metric'
var todaysWeatherSection = $('#today');
var forecastWeatherSection = $('#forecast');
var searchList = $('#history ul')
var todaycnt = 0;
var forecastcnt = 0;

// ----GLOBAL VARIABLE SECTION END----

// ----FUNCTION SECTION START----

function storeCitysSearched(arr){
    localStorage.setItem('citysearches', JSON.stringify(arr))
};

function retrieveCitysSearched(){
    // Get array from localstorage, but if empty (no city searches yet) it would return as undef, 
    // so adding 'or' state (||) to create a empty array 
    return JSON.parse(localStorage.getItem('citysearches')) || [];
};

function displayWeather(type, weather, city){

    if (!weather) {
        noMatch();
    } else {
            if (type == 'today') {
    
                // Clears the child elements of the 'today' html section 
                todaysWeatherSection.empty();
                
                // Appends the following html to the 'today' html section 
                todaysWeatherSection.append(`
                    <h2>Todays Weather (${city})</h2>
                    <div class="todays-weather-card">
                        <p id="todays-1">${weather[0]}</p>
                        <p id="todays-2">${weather[1]}</p>
                        <p id="todays-3">${weather[2]}</p>
                        <img src="${weather[3]}" alt="Current Weather Symbol" id="todays-img">
                    </div>
                `) 
            } else {
                    // on the first call clear the forecast section of child elements and add the title
                    if (forecastcnt < 1) {
                        // Clears the child elements of the 'forecast' html section 
                        forecastWeatherSection.empty();
                        // Appends the following html to the 'forecast' html section 
                        forecastWeatherSection.append(`
                            <h2>5 Day Forecast (${city})</h2>
                        `);
                    }

                    // increase the counter by one so the following section is called
                    forecastcnt++;

                    // Appends the following html to the 'forecast' html section 
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

// Add the search entry to the html search history list
function displayCitiesSearched(search) {

    // console.log('in displayCitiesSearched');

    searchList.append(`
        <li>
            <p>${search}</p>
            <button>Remove</button>
        </li>
    `); 
};

// Delete the user selected city from the html search history list
function deleteCitiesSearched(item) {

    item.parent().remove();
    item.remove();
};

// Add city search by the user to localstorage array
function addCitySearched(city) {
    var getcitys = retrieveCitysSearched();
    var searchTxt = city.toUpperCase();

    // get citys search data
    var currentCitiesSearched = getcitys;

    // console.log(`localstorage contains: ${currentCitiesSearched}`)

    // console.log('hitting for loop');

    //is the 'indexOf' array method to check the entire array data of getcitys, to see if users search is unique
    if (currentCitiesSearched.indexOf(searchTxt) === -1) {
        //as nothing is found the index returned as -1 so is a unique value
        // console.log(`Add new item ${searchTxt} to temp citysearched array`);
        currentCitiesSearched.push(searchTxt);
        // console.log('Add new city list to the local storage');
        storeCitysSearched(currentCitiesSearched);
        // console.log('check out new items after local storage update');
        getcitys = retrieveCitysSearched();
        // console.log(`localstore has: ${getcitys}`);

        displayCitiesSearched(searchTxt);
    } else {
        // console.log(`This item (${searchTxt}) already exists`);
        alert(`This item (${searchTxt}) already exists in search history`);
        return;
    }; 

};

// Removes the user selected city from the localstorage array 
function removeCitySearched(item) {
    var getCitySearchHist = retrieveCitysSearched();
    var cityToRm = item.toUpperCase();

    // Using the filter array method to affectively create a new array with the filter critera removed.
    // In this case I wish to remove the city that the use selected to remove from the localstorage array
    var newCitySearchHist = getCitySearchHist.filter(function(arrItem) {
            return arrItem != cityToRm;
        });

    // console.log(newCitySearchHist);

    // console.log('Add new city list to the local storage');
    storeCitysSearched(newCitySearchHist);
    // console.log('check out new items after local storage update');
    getCitySearchHist = retrieveCitysSearched();
    // console.log(`localstore has: ${getCitySearchHist}`);

};

// Calls inital api using the user input data (city name) to find longitude & latitude, 
// which are then used in the second api call to retrieve the forcast data for current day and the next 5 days
function getWeatherData(city) {

    var timeDate = '';
    var temp = '';
    var windS = ''
    var humidity = '';
    var weathImg = '';
    var outputArr = [];
    var respCode = '';
    var respStatus = '';
    var combindUrl = currentWeather + `q=${city}&appid=${myApiKey}` + weatherUnits;
    

    // Call openweather api using city name provided by user to get lon & lat
    $.get(combindUrl)
        .then(function(data, status) {
    
            // Set longitude and latitude data from api for the city name passed to short usable names
            var lon = data.coord.lon;
            var lat = data.coord.lat;

            // console.log(data);

            // Setup readable and simple var names for data retrieved from api
            temp = `Temp: ${data.main.temp} °C`;
            windS = `Wind Speed: ${data.wind.speed} m/s`;
            humidity = `Humidity: ${data.main.humidity} %`;
            weathImg = `${openWeatherIconUrl}${data.weather[0].icon}@4x.png`

            // Push above items in to an array (first to last) to hand over to displayWeather func
            outputArr.push(`${temp}`);
            outputArr.push(`${windS}`);
            outputArr.push(`${humidity}`);
            outputArr.push(`${weathImg}`);

            // console.log(`Todays Weather Data: ${outputArr}`)

            // Call displayWeather func to write the info to the 'todays' section (1st arg) of the page using data in outputArr and providing the city name for header details
            displayWeather('today', outputArr, city);

                // Reset combindUrl to new one
                combindUrl = forecastWeather + `lat=${lat}&lon=${lon}&appid=${myApiKey}` + weatherUnits;

                // Using long and lat from prev api call, get forcast data
                $.get(combindUrl)
                    .then(function (forecastData) {

                        // console.log (forecastData);

                        var forecastArr = forecastData.list

                        // Clear the commonly used outputArr for this func (getWeatherData) on the second call
                        outputArr = [];
                    
                        // Cycle through the forcast data list to obtain only noon data outputs
                        for (var forecast of forecastArr){
                        //     // console.log(forecast);
                        //     // console.log(forecast.dt_txt);

                            var forecastDnT = '';
                            
                            forecastDnT = forecast.dt_txt;

                            // if the forecast.dt_txt is for noon then process the data 
                            if (forecastDnT.match('12:00:00')) {

                                // console.log(forecast);
                                // console.log(forecast.weather);

                                var weatherImgArr = [];
                                weatherImgArr = forecast.weather;

                                //erase array content
                                outputArr = [];

                                // Setup readable and simple var names for data retrieved from api
                                timeDate = `${forecast.dt_txt}`;
                                temp = `Temp: ${forecast.main.temp} °C`;
                                windS = `Wind Speed: ${forecast.wind.speed} m/s`;
                                humidity = `Humidity: ${forecast.main.humidity} %`;
                                weathImg = `${openWeatherIconUrl}${forecast.weather[0].icon}@2x.png`

                                // Push above items in to an array (first to last) to hand over to displayWeather func
                                outputArr.push(`${timeDate}`);
                                outputArr.push(`${temp}`);
                                outputArr.push(`${windS}`);
                                outputArr.push(`${humidity}`);
                                outputArr.push(`${weathImg}`);

                                // console.log (`Forecast Weather Data: ${outputArr}`);

                                // Call displayWeather func to write the info to the 'forecast' section (1st arg) of the page using data in outputArr and providing the city name for header details
                                displayWeather('forecast', outputArr, city);
                            };
                        };

                        // Reset forecast call count used in displayWeather func to run a clear and add title on first iter of 5 day data
                        forecastcnt = 0;

                        return 0;

                    // Catch any error from the API get call    
                    }).catch ( err => {
                        respCode = err.responseJSON.cod;
                        respStatus = err.responseJSON.message;

                        alert('there was an error in API call for the Forecast : ' + respCode + ' - ' + respStatus); 

                        // Return false status to prevent any further action
                        return false;
                    });

            // Return true status to if ok
            return true;

        // Catch any error from the API get call
        }).catch (err => {
            respCode = err.responseJSON.cod;
            respStatus = err.responseJSON.message;

            alert('there was an error in API call for the Current Weather: ' + respCode + ' - ' + respStatus);

            // Return false status to prevent any further action
            return false;
        });

    // Return true status to if ok
    return true;
}

// Initilsation function
function init () {
    var city = $('#search-input').val();

    // console.log('in iit func');
    // console.log(`city is: ${city}`);

    // if call to getWeatherData func is good run the addCitySearched func
    if (getWeatherData(city)) {
        // console.log('getWeatherData ok so running addCitySearched')
        addCitySearched(city);
    }
    
};

// ----FUNCTION SECTION END----

// ----EVENT HANDLER SECTION START----

// prevents the page refreshing if user hits enter  by not returning it to event handler i.e. preventDefault
$(document).on('keydown', 'form', function(event) {
    return event.key !='Enter';
});

// when search button is click initiate the init function
$('#search-button').click(init);

// on click of selected dynamic 'p' created under the static 'ul', get the weather forecast info
$('ul').on("click", "p", function(){
    var selection = $(this);
    var selectionCityName = selection[0].innerText;

    // Get weather data again
    getWeatherData(selectionCityName);
});

// on click of select dynamic remove button, clear search history item from hml list and localstorage

$('ul').on('click', 'button', function(){
    var selection = $(this);

    // console.log(selection);
    // console.log(selection.parentElement);

    var selectionTxt = selection.parent()[0].firstElementChild.innerText;

    // Delete selected search history item from html
    deleteCitiesSearched(selection);
    
    // Delete selected search history item from localstorage
    removeCitySearched(selectionTxt);

});

// ----EVENT HANDLER SECTION END----
