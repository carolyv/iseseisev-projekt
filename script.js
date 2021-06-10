// Variables
const search = document.getElementById('search');
var celsiusFahrenheit = document.getElementById('change-temp');
const timeStyle = document.getElementById('change-time');
const lightDark = document.getElementById('change-mode');
var input = document.getElementById('search-input');
const apikey = "3e8af2402e2ff0f07b01a4e43c7861cd";
var error = document.getElementById('error');
// Weather variables
var city = document.getElementById('city-name');
var description = document.getElementById('weather-desc');
var temp = document.getElementById('temperature');
var rain = document.getElementById('rain');
var humidity = document.getElementById('humidity');
var wind = document.getElementById('wind');
var localTime = document.getElementById('local-time');
var forecast = document.getElementsByClassName('forecast-content');
var cityTemp;
var toFahr;
var timezone;
// Boolean variables
var isCelsius = true;
var lightMode = true;
var militaryTime = true;

localTime.style.visibility = 'hidden';
// forecast.style.visibility = 'hidden';

// Event listeners
search.addEventListener('click', searchCity);
search.addEventListener('click', searchForecast);
celsiusFahrenheit.addEventListener('click', celsiusFahr);
timeStyle.addEventListener('click', changeTime);
lightDark.addEventListener('click', darkMode);

// Functions
timeNow();
setInterval(timeNow, 1000);
// searchCity - Getting specific weather data via city name
var icon = document.getElementById('weather-icon');
function searchCity() {
    localTime.style.visibility = 'visible';
    if(input.value) {
        $.getJSON(`http://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apikey}`,
            function(data){
                console.log(data);
                cityTemp = parseInt(Math.round(data.main.temp - 272.15));
                timezone = parseInt(data.timezone);
                // Overwriting
                error.innerHTML = "";
                city.innerHTML = data.name + ", " + data.sys.country;
                description.innerHTML = data.weather[0].description; // Detailed desc of the weather
                temp.innerHTML = Math.round(data.main.temp - 272.15) + "°C"; // From kelvin to celsius
                // rain.innerHTML = data.weather[0].main; // Weather (not Rain)
                humidity.innerHTML = "Humidity: " + data.main.humidity + "%";
                wind.innerHTML = "Wind: " + data.wind.speed + " m/s";
                var displayIcon = data.weather[0].icon;
                // var iconUrl = `http://openweathermap.org/img/wn/${displayIcon}@2x.png`;
                // icon.innerHTML = `<img src=\"${iconUrl}\" width = \"150px\" height=\"150px\">`;
                console.log("seon " + timezone);
                input.value = "";
                return cityTemp, timezone;
            });
    } else {
        error.innerHTML = "Insert a city name!"
    }
}

// Forecast API
let forecastTime = document.getElementById('time');

// Card components
let cardTemp1 = document.getElementById('forecast-temp1');
let cardTemp2 = document.getElementById('forecast-temp2');
let cardTemp3 = document.getElementById('forecast-temp3');

let cardDesc1 = document.getElementById('forecast-desc1');
let cardDesc2 = document.getElementById('forecast-desc2');
let cardDesc3 = document.getElementById('forecast-desc3');
// Card components temps
var forecastTemp;
var forecastTemp2;
var forecastTemp3;

var forecastDesc1;
var forecastDesc2;
var forecastDesc3;

function searchForecast() {
    // forecast.style.visibility = 'visible';
    if(input.value) {
        $.getJSON(`http://api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=${apikey}`,
        function(data2) {
            console.log(data2);
            
            forecastTemp = parseInt(Math.round(data2.list[10].main.temp - 272.15));
            cardTemp1.innerHTML = forecastTemp + "°C";
            forecastDesc1 = data2.list[10].weather[0].main;
            cardDesc1.innerHTML = forecastDesc1;

            forecastTemp2 = parseInt(Math.round(data2.list[12].main.temp - 272.15));
            cardTemp2.innerHTML = forecastTemp2 + "°C";
            forecastDesc2 = data2.list[12].weather[0].main;
            cardDesc2.innerHTML = forecastDesc2;

            forecastTemp3 = parseInt(Math.round(data2.list[14].main.temp - 272.15));
            cardTemp3.innerHTML = forecastTemp3 + "°C";
            forecastDesc3 = data2.list[14].weather[0].main;
            cardDesc3.innerHTML = forecastDesc3;

            console.log(forecastTemp + 'yee');
        });
    }
}


// celsiusFahr - converts Celsius to Fahrenheit and vice-versa
function celsiusFahr() {
    isCelsius = !isCelsius;
    if(isCelsius == false) {
        //temp.innerHTML = (1.8 * (cityTemp - 273) + 32);
        toFahr = Math.round((cityTemp * 1.8) + 32);
        temp.innerHTML = toFahr + "°F";
        //console.log(isCelsius);
    } else {
        temp.innerHTML = cityTemp - 272.15;
        temp.innerHTML = cityTemp + "°C";
        //console.log(isCelsius);
    }
}

// changeTime - Changes time style, whether to 24 hour cycle or 12 hour cycle
function changeTime() {
    militaryTime = !militaryTime;
    timeNow(militaryTime);
}

// darkMode - changes the website style to light mode or dark mode
var el = document.body;
var logo = document.getElementById('logo');

function darkMode() {
    lightMode = !lightMode;
    if(lightMode) {
        search.style.color = "black";
        logo.style.color = "black";
        el.style.backgroundImage = "url(images/day.jpg)";
    } else {
        search.style.color = "white";
        logo.style.color = "white";
        el.style.backgroundImage = "url(images/night.jpg)";
    }
    
}

// Function to showcase local time
function timeNow() {
    let date = new Date;
    var hours = date.getHours() - 3;
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    // Getting hours right
    var hoursApart = (timezone / 60) / 60; // Calculate, how many hours is the difference between UTC time
    var newHours = hours + hoursApart;
    if (newHours > 23) {
        newHours = newHours - 24;
    }
    // console.log(hoursApart);
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    
    if(seconds < 10){
        seconds = "0" + seconds;
    }

    if(militaryTime == true) {
        if(newHours < 10) {
            newHours = "0" + newHours;
        }
        localTime.innerHTML = newHours + ":" + minutes + ":" + seconds;
    } else {
        var prefix;

        if (newHours > 11) {
            prefix = " PM";
        } else {
            prefix = " AM";
        }

        if(newHours > 12) {
            newHours = newHours - 12;
        }

        if(newHours < 10) {
            newHours = "0" + newHours;
        }

        localTime.innerHTML = newHours + ":" + minutes + ":" + seconds + prefix;
    }
}