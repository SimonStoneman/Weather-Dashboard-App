// Find long and Lat of searched City

// https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

//Pass in Long & Lat + Personal weatherapi apikey
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

var myApiKey = 'f05af73148e926c7dab18966a3e1b58e';
var city = 'London';

$.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myApiKey}&units=metric`)
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

    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`)
        .then(function (forecastData) {
            console.log (forecastData);
            
        });
});