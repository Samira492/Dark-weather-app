// date & time
function formatDate(timestamp) {
  let now = new Date(timestamp);
  let date = now.getDate();
  let hours = now.getUTCHours();
  let minutes = now.getUTCMinutes();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getUTCDay()];
  return ` ${day} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// city temp
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

  celsiusTemperature = response.data.current.temperature;

  city.innerHTML = response.data.location.name;
  temperature.innerHTML = Math.round(celsiusTemperature);
  humidity.innerHTML = `${response.data.current.humidity}%`;
  wind.innerHTML = `${Math.round(response.data.current.wind_speed)} km/hr`;
  description.innerHTML = response.data.current.weather_descriptions[0];
  iconElement.setAttribute("src", response.data.current.weather_icons[0]);
  iconElement.setAttribute(
    "alt",
    response.data.current.weather_descriptions[0]
  );
  dateElement.innerHTML = formatDate(
    response.data.location.localtime_epoch * 1000
  );
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function searchCity(city) {
  let units = "m";
  let apiKey = "82233c2345b9e8f0449d19c252de3a7d";
  let apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}&units=${units}`;
  axios.get(apiUrl).then(displayCityTemp);
}

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

let celsiusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

// set default city to display
searchCity("Tehran");
