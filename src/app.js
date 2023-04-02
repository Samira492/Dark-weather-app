//display date & time
function formatDate(timestamp) {
  let now = new Date(timestamp);
  let date = now.getDate();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];

  return ` ${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let time = new Date(timestamp * 1000);
  let day = time.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

//get response from called api and show the result in html
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
<div class="col-2">
 <div class="weather-forecast-day">${formatDay(forecastDay.time)}</div>
<img
 src="${forecastDay.condition.icon_url}"
alt=""
 width="42"
>
<div class="weather-forecast-temperature">
 <span class="weather-forecast-temperature-max">${Math.round(
   forecastDay.temperature.maximum
 )}°</span>
<span class="weather-forecast-temperature-min">${Math.round(
          forecastDay.temperature.minimum
        )}°</span>
</div>
 </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let units = "metric";
  let apiKey = "90fc10d43of9eaac2600303bt6cbaa96";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayCityTemp(response) {
  let city = document.querySelector("#city");
  let temperature = document.querySelector("#temperature");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind-speed");
  let description = document.querySelector("#description");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon-image");
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");

  celsiusTemperature = response.data.temperature.current;

  city.innerHTML = response.data.city;
  temperature.innerHTML = Math.round(celsiusTemperature);
  humidity.innerHTML = `${response.data.temperature.humidity}%`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)} km/hr`;
  description.innerHTML = response.data.condition.description;
  iconElement.setAttribute("src", response.data.condition.icon_url);
  iconElement.setAttribute("alt", response.data.condition.icon);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  getForecast(response.data.coordinates);
}

function searchCity(city) {
  let units = "metric";
  let apiKey = "90fc10d43of9eaac2600303bt6cbaa96";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayCityTemp);
}

// set the events
function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  if (cityInput.trim() === "") {
    alert("Please enter a city name.");
    return;
  }
  searchCity(cityInput);
}

function displayFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

//define global variables
let celsiusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

// set default city to display
searchCity("Tehran");
