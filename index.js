const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("city");
const card = document.querySelector(".weather-card");
const apiKey = "5dfb109479a0b4d2569b6f44036b885b";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim().toLowerCase();

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      displayError(error);
    }
  } else {
    displayError("City cannot be empty.");
  }
});

async function getWeatherData(city) {
  const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiurl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  return await response.json();
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp },
    weather: [{ description, id }],
  } = data;
  card.textContent = "";
  card.style.display = "block";

  const blurDisplay = document.createElement("div");
  const content = document.createElement("div");
  const cityDisplay = document.createElement("h2");
  const tempDisplay = document.createElement("h1");
  const imgDisplay = document.createElement('img');
  const descDisplay = document.createElement("h3");
  const dayDisplay = document.createElement("h3");
  const dateDisplay = document.createElement("h3");
  const quoteDisplay = document.createElement("p");

  blurDisplay.classList.add("blur-overlay");
  card.appendChild(blurDisplay);

  content.classList.add("content");
  card.appendChild(content);

  cityDisplay.textContent = city;
  cityDisplay.id = "location";
  content.appendChild(cityDisplay);

  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
  tempDisplay.id = "temperature";
  content.appendChild(tempDisplay);

  imgDisplay.src = `./weather-icons/${getWeatherImage(id)}.png`
  imgDisplay.id = 'weather-icon'
  content.appendChild(imgDisplay);

  descDisplay.textContent = description;
  descDisplay.id = "weather";
  content.appendChild(descDisplay);

  dayDisplay.textContent = getDay();
  dayDisplay.id = "day";
  content.appendChild(dayDisplay);

  dateDisplay.textContent = getDate();
  dateDisplay.id = "date";
  content.appendChild(dateDisplay);

  quoteDisplay.id = "quote"; 
  getQuote().then((quoteData) => {
    quoteDisplay.textContent = quoteData.text;
  });
  content.appendChild(quoteDisplay);
}

function displayError(message) {
  const errorMsg = document.createElement("p");
  errorMsg.textContent = message;
  errorMsg.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorMsg);
}

function getDate() {
  const currentDate = new Date();
  const taareek = currentDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return taareek;
}

function getDay() {
  const currentDate = new Date();
  const formattedDay = currentDate.toLocaleString("en-US", { weekday: "long" });
  return formattedDay;
}

async function getQuote() {
    try {
      const response = await fetch("https://type.fit/api/quotes");
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];
    } catch (error) {
      console.error("Error fetching quote:", error);
      throw new Error("Could not fetch quote");
    }
  }

function getWeatherImage(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return 'storm';
        case (weatherId >= 300 && weatherId < 400):
            return 'drizzle';
        case (weatherId >= 500 && weatherId < 600):
            return 'heavy-rain';
        case (weatherId >= 600 && weatherId < 700):
            return 'snow';
        case (weatherId >= 700 && weatherId < 800):
            return 'fog';
        case (weatherId === 800):
            return 'sunny';
        case (weatherId >= 801 && weatherId <810):
            return 'cloudy';
        default:
            return 'background';
    }
}
  
