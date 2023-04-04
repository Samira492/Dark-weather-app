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

  return `Last updated at ${day} ${hours}:${minutes}`;
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

function displayCityTemp(response) {
  let city = document.querySelector("#city");
  let temperature = document.querySelector("#temperature");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind-speed");
  let description = document.querySelector("#description");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon-image");
  let windSpeed = response.data.wind.speed * 3.6;
  wind.innerHTML = `${Math.round(windSpeed)} km/hr`;

  city.innerHTML = response.data.city;
  temperature.innerHTML = Math.round(response.data.temperature.current);
  humidity.innerHTML = `${response.data.temperature.humidity}%`;
  description.innerHTML = response.data.condition.description;
  iconElement.setAttribute("src", response.data.condition.icon_url);
  iconElement.setAttribute("alt", response.data.condition.icon);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
}

function searchCity(city) {
  let units = "metric";
  let apiKey = "90fc10d43of9eaac2600303bt6cbaa96";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
  let apiForecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayCityTemp);
  axios.get(apiForecastUrl).then(displayForecast);
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

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

// set default city to display
searchCity("Tehran");
