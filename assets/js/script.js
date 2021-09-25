var lat = 33.44;
var lon = -94.04;
var cityArray = []

var searchFormEl = document.querySelector("#search-form");
var savedCityButtonsEl = document.querySelector("#saved-cities");
var cityInputEl = document.querySelector("#city");

var cityNameTitleEl = document.querySelector("#city-name");
var todayDateEl = document.querySelector("#todays-date");

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


var createTodaysForecast = function(city) {
    cityNameTitleEl.textContent = city;
    console.log(moment().format("MM/DD/YYYY"));
    todayDateEl.textContent = moment().format("MM/DD/YYYY");
};


var formSubmitHandler = function (event) {
    event.preventDefault();
    var newCity = cityInputEl.value.trim();

    if (newCity) {
        cityArray.push(newCity);
        localStorage.setItem("cityList", cityArray);
        cityInputEl.value = "";
        createSavedCityEl(newCity);
        createTodaysForecast(newCity);
    } else {
        alert("Please enter a city");
    }
};

searchFormEl.addEventListener("submit", formSubmitHandler);

var cityButtonHandler = function (event) {
    //event.preventDefault();
    var cityEl = event.target;
    var cityName = cityEl.textContent;
    createTodaysForecast(cityName);
};

savedCityButtonsEl.addEventListener("click", cityButtonHandler);

var getWeather = function(lat, lon) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alert&appid=1632a800f6792361a1ff03e6075ade19";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
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



// getWeather(lat,lon);
loadSavedCities();