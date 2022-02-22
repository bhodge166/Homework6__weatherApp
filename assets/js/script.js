var searchButton = document.getElementById("searchButton");
var formInput = document.getElementById("weatherInput");
var currentWeather = document.getElementById("cityWeather");
var forecast = document.getElementById("weatherForecast");
var searchHistory = document.getElementById("previousSearch");
var historyButton = document.getElementById("historyButton");
var baseUrl = "https://api.openweathermap.org/data/2.5/";
var apiKey = "&appid=048d713b5084654290dd97fa018259c9";
var imagebaseUrl = "http://openweathermap.org/img/wn/";
var savedSearches = JSON.parse(localStorage.getItem("city")) || [];
var currentSearch = savedSearches.length;

async function getWeather(event) {
  event.preventDefault();
  var coordinates = await getCoordinates(formInput.value);
  var requestUrl =
    baseUrl +
    "onecall?lat=" +
    coordinates.lat +
    "&lon=" +
    coordinates.lon +
    "&units=imperial" +
    apiKey;
  savedSearches.push(formInput.value);
  localStorage.setItem("city", JSON.stringify(savedSearches));
  postHistory();
  var result = fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      convertUnixTimetoMDY(data);
      displayWeather(data);
      displayForecast(data);
      console.log(data);
    });
  return await result;
}

async function getCoordinates(cityName) {
  var requestUrl = baseUrl + "weather?q=" + cityName + apiKey;
  var result = fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data.coord;
    });
  return result;
}

function convertUnixTimetoMDY(unixTime) {
  var unixTimeConvert = new Date(unixTime * 1000);
  var year = unixTimeConvert.getFullYear();
  var month = unixTimeConvert.getMonth() + 1;
  var date = unixTimeConvert.getDate();
  return month + "/" + date + "/" + year;
}

function displayWeather(data) {
  currentWeather.innerHTML = "";
  forecast.innerHTML = "";
  var dateEl = document.createElement("h2");
  dateEl.textContent =
    formInput.value + " " + convertUnixTimetoMDY(data.current.dt);
  currentWeather.appendChild(dateEl);

  var imageEl = document.createElement("IMG");
  var image = data.current.weather[0].icon;
  var imageURL = imagebaseUrl + image + "@2x.png";
  imageEl.setAttribute("src", imageURL);
  currentWeather.appendChild(imageEl);

  var tempEl = document.createElement("p");
  tempEl.textContent = "Temp: " + data.current.temp + "°F";
  currentWeather.appendChild(tempEl);

  var windEl = document.createElement("p");
  windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
  currentWeather.appendChild(windEl);

  var humidityEl = document.createElement("p");
  humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
  currentWeather.appendChild(humidityEl);

  var uvEl = document.createElement("p");
  var uvElInner = document.createElement("span");
  uvElInner.classList = "badge";
  if (data.current.uvi <= 2) {
    uvElInner.classList.add("bg-success");
  } else if (data.current.uvi <= 5) {
    uvElInner.classList.add("bg-warning");
  } else {
    uvElInner.classList.add("bg-danger");
  }
  uvEl.textContent = "UV Index: ";
  uvElInner.textContent = data.current.uvi;
  uvEl.appendChild(uvElInner);
  currentWeather.appendChild(uvEl);
}

function displayForecast(data) {
  var forecastHeading = document.createElement("h2");
  forecastHeading.textContent = "5 Day Forecast:";
  forecast.appendChild(forecastHeading);
  for (var i = 1; i < 6; i++) {
    var forecastDiv = document.createElement("div");
    forecastDiv.classList = "col-2 bg-dark text-light p-2 text-center";

    var dateEl = document.createElement("h2");
    dateEl.textContent = convertUnixTimetoMDY(data.daily[i].dt);
    forecastDiv.appendChild(dateEl);

    var imageEl = document.createElement("IMG");
    var image = data.daily[i].weather[0].icon;
    var imageURL = imagebaseUrl + image + "@2x.png";
    imageEl.setAttribute("src", imageURL);
    forecastDiv.appendChild(imageEl);

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + data.daily[i].temp.day + "°F";
    forecastDiv.appendChild(tempEl);

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
    forecastDiv.appendChild(windEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
    forecastDiv.appendChild(humidityEl);

    forecast.appendChild(forecastDiv);
  }
}

function init() {
  for (var i = 0; i < savedSearches.length; i++) {
    var element = savedSearches[i];
    var createButton = document.createElement("button");
    createButton.setAttribute("type", "button");
    createButton.setAttribute("value", element);
    createButton.classList = "btn btn-secondary";
    createButton.textContent = element;
    searchHistory.appendChild(createButton);
  }
}
// posts most recent search
function postHistory() {
  var element = savedSearches[currentSearch];
  var createButton = document.createElement("button");
  createButton.setAttribute("type", "button");
  createButton.setAttribute("value", element);
  createButton.setAttribute("id", "historyButton");
  createButton.classList = "btn btn-secondary";
  createButton.textContent = element;
  searchHistory.appendChild(createButton);
  currentSearch++;
}

searchButton.addEventListener("click", getWeather);
historyButton.addEventListener("click", getWeather);
init();
