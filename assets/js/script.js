//CONSTANTS
var cityArray = []

var searchFormEl = document.querySelector("#search-form");
var savedCityButtonsEl = document.querySelector("#saved-cities");
var cityInputEl = document.querySelector("#city");

//today element
var cityNameTitleEl = document.querySelector("#city-name");
var todayDateEl = document.querySelector("#todays-date");
var todayIconEl = document.querySelector("#todays-icon");
var todayTempEl = document.querySelector("#today-temp");
var todayWindEl = document.querySelector("#today-wind");
var todayHumidityEl = document.querySelector("#today-humidity");
var todayUVEl = document.querySelector("#today-uv");
var todayUVNumberEl = document.querySelector("#today-uv-number");

//5 day element
var fiveDayForecastCards = $('.five-day');

//SEARCH AND HISTORY
var loadSavedCities = function () {
    var cityList = localStorage.getItem("cityList");
    if (cityList)
        cityArray = cityList.split(",");
        for (var i=0; i<cityArray.length; i++){
            createSavedCityEl(cityArray[i]);
        }
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
                alert("nope");
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
                    console.log(data);
                });
            } else {
                alert("nope");
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};


//USE CITY WEATHER DATA TO FILL IN MAIN ELEMENTS

var createTodaysForecast = function(city, data) {
    cityNameTitleEl.textContent = city;
    todayDateEl.textContent = moment().format("MM/DD/YYYY");

    var icon = data.current.weather[0].icon;
    todayIconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
    todayTempEl.textContent = "Temp: " + data.current.temp + " F";
    todayWindEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    todayHumidityEl.textContent = "Humidity: " + data.current.humidity + " %";
    todayUVEl.textContent = "UV Index: ";

    uvNumberEl = document.createElement('span');
    uvNumberEl.textContent = data.current.uvi;
    uvNumberEl.className = "uv-number";
    
    //color that indicates whether the UV conditions are favorable, moderate, or severe
    if (data.current.uvi <= 2) {
        $(uvNumberEl).addClass("low-uv");
    }
    else if (data.current.uvi <= 5) {
        $(uvNumberEl).addClass("moderate-uv");
    }
    else if (data.current.uvi <= 7) {
        $(uvNumberEl).addClass("high-uv");
    }
    else if (data.current.uvi <= 10) {
        $(uvNumberEl).addClass("very-high-uv");
    }
    else {
        $(uvNumberEl).addClass("extreme-uv");
    }
    todayUVEl.appendChild(uvNumberEl);  
};

var createFiveDayForecast = function(data) {
    for (var i=0; i<fiveDayForecastCards.length; i++) {
        //clear old info
        var dateEl = document.createElement('h5');
        dateEl.textContent = moment().add(i+1, 'days').format("MM/DD/YYYY");
        fiveDayForecastCards[i].appendChild(dateEl);
        
        var iconEl = document.createElement('img');
        var icon = data.daily[i+1].weather[0].icon;
        iconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
        fiveDayForecastCards[i].appendChild(iconEl);
        
        var tempEl = document.createElement('p');
        tempEl.textContent = "Temp: " + data.daily[i+1].temp.day + " F";
        fiveDayForecastCards[i].appendChild(tempEl);

        var windEl = document.createElement('p');
        windEl.textContent = "Wind: " + data.daily[i+1].wind_speed + " MPH";
        fiveDayForecastCards[i].appendChild(windEl);

        var humidityEl = document.createElement('p');
        humidityEl.textContent = "Temp: " + data.daily[i+1].humidity + " %";
        fiveDayForecastCards[i].appendChild(humidityEl);
    }    
};



//ON LOAD
loadSavedCities();