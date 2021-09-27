//CONSTANTS
var cityArray = []

var searchFormEl = document.querySelector("#search-form");
var savedCityButtonsEl = document.querySelector("#saved-cities");
var cityInputEl = document.querySelector("#city");

//SEARCH AND HISTORY
var loadSavedCities = function () {
    var cityList = localStorage.getItem("cityList");
    if (cityList)
        cityArray = cityList.split(",");
        for (var i=0; i<cityArray.length; i++){
            createSavedCityEl(cityArray[i]);
        };
        //preload first city in local storage
        if(cityArray[0]) {
            getLatAndLon(cityArray[0]);
        };
}

var createSavedCityEl = function (cityName) {
    var cityButtonEl = document.createElement("button");
    cityButtonEl.textContent = cityName;
    cityButtonEl.className = "saved-city btn col-12";
    savedCityButtonsEl.appendChild(cityButtonEl);
};


//SELECTING A CITY TO SEARCH
//Submit a New City Search
var formSubmitHandler = function (event) {
    event.preventDefault();
    var newCity = cityInputEl.value.trim();

    if (newCity) {
        cityArray.push(newCity);
        localStorage.setItem("cityList", cityArray);
        cityInputEl.value = "";
        createSavedCityEl(newCity);
        getLatAndLon(newCity);
    } else {
        alert("Please enter a city");
    }
};
searchFormEl.addEventListener("submit", formSubmitHandler);

//Select City from Search History
var cityButtonHandler = function (event) {
    //event.preventDefault();
    var cityEl = event.target;
    var cityName = cityEl.textContent;
    getLatAndLon(cityName);
};
savedCityButtonsEl.addEventListener("click", cityButtonHandler);


//GET WEATHER FOR SELECTED CITY

var getLatAndLon = function(city) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=1632a800f6792361a1ff03e6075ade19";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    getWeather(city,lat,lon);
                });
            } else {
                alert("Not a valid city name");
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

var getWeather = function(city,lat,lon) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=1632a800f6792361a1ff03e6075ade19";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    createTodaysForecast(city, data);
                    createFiveDayForecast(data);
                });
            } else {
                alert("Unable to Retrieve Weather");
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};


//USE CITY WEATHER DATA TO FILL IN MAIN ELEMENTS

var createTodaysForecast = function(city, data) {
    $('#city-name').text(city);
    $('#todays-date').text(moment().format("MM/DD/YYYY"));
    var icon = data.current.weather[0].icon;
    $('#todays-icon').attr('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
    $('#today-temp').text("Temp: " + data.current.temp + " F");
    $('#today-wind').text("Wind: " + data.current.wind_speed + " MPH");
    $('#today-humidity').text("Humidity: " + data.current.humidity + " %");
    $('#today-uv').text("UV Index: ");

    var span = document.createElement('span');
    span.classList.add('number');
    span.innerText = data.current.uvi;
    $("#today-uv").append(span);
    
    //color that indicates whether the UV conditions are favorable, moderate, or severe
    if (data.current.uvi <= 2) {
        $('.number').addClass("low-uv");
    }
    else if (data.current.uvi <= 5) {
        $('.number').addClass("moderate-uv");
    }
    else if (data.current.uvi <= 7) {
        $('.number').addClass("high-uv");
    }
    else if (data.current.uvi <= 10) {
        $('.number').addClass("very-high-uv");
    }
    else {
        $('.number').addClass("extreme-uv");
    }
};

var createFiveDayForecast = function(data) {
    var count = 0;
    $('.five-day').each(function(){
        count++;
        var date = moment().add(count, 'days').format("MM/DD/YYYY");
        $(this).children('.date').text(date);
        var icon = data.daily[count].weather[0].icon;
        $(this).children('.icon').attr('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
        $(this).children('.temp').text("Temp: " + data.daily[count].temp.day + " F");
        $(this).children('.wind').text("Wind: " + data.daily[count].wind_speed + " MPH");
        $(this).children('.humidity').text("Humidity: " + data.daily[count].humidity + " %");
    });    
};

//ON LOAD
loadSavedCities();