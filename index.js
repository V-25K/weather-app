import { myApiKey } from "/apikey.js";
document.addEventListener("DOMContentLoaded", async () => {
  
  // Default city
  await getDefaultCityWeather();
});

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("city");
const card = document.querySelector(".weather-card");
const lower_card = document.querySelector(".other-info-container");
const right_card = document.querySelector(".right-container");
const apiKey = myApiKey;
/* let isMetric = true; */

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
  const apiurl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2&aqi=yes&alerts=no`;

  const response = await fetch(apiurl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  return await response.json();
}

function displayWeatherInfo(data) {
  const {
    current: {
      air_quality: { "gb-defra-index": airQualityIndex },
      condition: { icon, text: weatherTypeText },
      humidity,
      temp_c,
      uv,
      wind_kph,
      wind_degree,
      wind_dir,
    },
    forecast: {
      forecastday: [
        {
          astro: { sunrise, sunset },
          day: { maxtemp_c, mintemp_c },
          hour: [],
        },
        {
          day: {
            condition: { text, icon: tomorrowIcon },
            avgtemp_c,
          },
        },
      ],
    },
    location: { name, localtime },
  } = data;

  card.textContent = "";
  lower_card.textContent = "";
  right_card.textContent = "";
  weather_card(
    localtime,
    icon,
    temp_c,
    name,
    weatherTypeText,
    maxtemp_c,
    mintemp_c
  );
  today_wala(localtime, data, text, tomorrowIcon, avgtemp_c, sunrise, sunset);
  rightWalaContainer(
    humidity,
    wind_kph,
    wind_degree,
    wind_dir,
    uv,
    airQualityIndex
  );
}

function displayError(message) {
  const errorBtn = document.getElementById("errorCloseBtn");
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = message;
  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";

  errorBtn.addEventListener("click", function () {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  });
}

async function getDefaultCityWeather() {
  const defaultCity = "Joshimath";

  try {
    const defaultWeatherData = await getWeatherData(defaultCity);
    displayWeatherInfo(defaultWeatherData);
  } catch (error) {
    displayError(error);
  }
}

function weather_card(
  localtime,
  icon,
  temp_c,
  name,
  weatherTypeText,
  maxtemp_c,
  mintemp_c
) {
  {
    const upper_content = document.createElement("div");
    const day_text = document.createElement("h4");
    const date_text = document.createElement("h3");
    const weatherType = document.createElement("h5");
    const image_icon = document.createElement("img");
    const temp_text = document.createElement("h1");
    const temp_div = document.createElement("div");

    card.appendChild(upper_content);
    card.appendChild(day_text);
    card.appendChild(date_text);
    card.appendChild(weatherType);
    card.appendChild(image_icon);
    card.appendChild(temp_text);
    card.appendChild(temp_div);

    upper_content.classList.add("upper");

    /*inside upper_content*/
    /* inside current city div*/
    const current_city = document.createElement("div");
    const locationPng = document.createElement("img");
    const cityName = document.createElement("p");

    upper_content.appendChild(current_city);
    current_city.appendChild(locationPng);
    current_city.appendChild(cityName);

    current_city.classList.add("current-city");

    locationPng.src = "./location.png";
    locationPng.alt = "Location PNG";

    cityName.id = "location";
    cityName.textContent = name;
    /* end of current city div*/
    /* inside unit-change div*/
    const unitChange = document.createElement("div");
    const checkbox = document.createElement("input");
    const labelUnit = document.createElement("label");
    const celciusText = document.createElement("p");
    const fehrenhietText = document.createElement("p");

    upper_content.appendChild(unitChange);
    unitChange.appendChild(checkbox);
    unitChange.appendChild(labelUnit);
    labelUnit.appendChild(fehrenhietText);
    labelUnit.appendChild(celciusText);

    unitChange.classList.add("unit-change");

    checkbox.type = "checkbox";
    checkbox.id = "switch";
    checkbox.classList.add("checkbox");

    labelUnit.htmlFor = "switch";
    labelUnit.className = "toggle";

    fehrenhietText.textContent = "F";
    celciusText.textContent = "C";

    const toggleButton = document.getElementById("switch");
    toggleButton.addEventListener("change", () => {
      handleUnitToggle();
    });
    /* end of unit-change div*/
    /*end of upper_content*/

    /*start of lower div*/
    const tempDiv = document.createElement("div");
    const highTemp = document.createElement("p");
    const lowTemp = document.createElement("p");

    card.appendChild(tempDiv);
    tempDiv.appendChild(highTemp);
    tempDiv.appendChild(lowTemp);

    tempDiv.className = "temp";

    highTemp.textContent = `High: ${maxtemp_c}°C`;
    lowTemp.textContent = `Low: ${mintemp_c}°C`;
    /*end of lower div*/

    day_text.id = "day";
    day_text.textContent = getDay(localtime);

    date_text.id = "date";
    date_text.textContent = localtime;

    weatherType.textContent = weatherTypeText;

    image_icon.id = "weather-icon";
    image_icon.src = `https://${icon}`;
    image_icon.alt = "Weather Icon";

    temp_text.id = "temperature";
    temp_text.textContent = `${temp_c}°C`;
  }
}

function today_wala(
  localtime,
  data,
  text,
  tomorrowIcon,
  avgtemp_c,
  sunrise,
  sunset
) {
  /*starting of heading and middle div of todayweek-container*/
  const localTimeArray = localtime.split(" ");
  const apiLocalTime = localTimeArray[1];
  const localHour = Number(apiLocalTime.split(":")[0]);

  const today_week_container = document.createElement("div");
  today_week_container.className = "today-week-container";

  const heading = document.createElement("div");
  const heading_h1 = document.createElement("h1");

  lower_card.appendChild(today_week_container);
  today_week_container.appendChild(heading);
  heading.appendChild(heading_h1);

  heading.className = "heading";
  heading_h1.textContent = "Today / Tomorrow";

  const weather_atATime = document.createElement("div");
  weather_atATime.className = "weather-atTime";
  today_week_container.appendChild(weather_atATime);

  for (let i = 1; i <= 5; i++) {
    const nextHour = (localHour + i) % 24; //24hr format
    const atATime_container = document.createElement("div");
    const timeText = document.createElement("span");
    const weatherImage = document.createElement("img");
    const tempText = document.createElement("p");

    const perHourIcon =
      data.forecast.forecastday[0].hour[nextHour].condition.icon;
    const perHourText =
      data.forecast.forecastday[0].hour[nextHour].condition.text;
    const thatHourTemp_c = data.forecast.forecastday[0].hour[nextHour].temp_c;

    atATime_container.className = "atTime-container";
    timeText.className = "time";
    tempText.className = "atTime-container-temp";

    timeText.textContent = `${nextHour}:00`;

    weatherImage.src = `https://${perHourIcon}`;
    weatherImage.alt = perHourText;

    atATime_container.appendChild(timeText);
    atATime_container.appendChild(weatherImage);
    atATime_container.appendChild(tempText);

    weather_atATime.appendChild(atATime_container);

    tempText.textContent = `${thatHourTemp_c}°C`;
  }
  /*end of heading and middle div of todayweek-container*/

  /*start of tomorrow div*/
  const tomorrow_weather = document.createElement("div");
  const inner_div_tomorrow_weather = document.createElement("div");
  const tomorrow_text = document.createElement("p");
  const weather_type = document.createElement("span");
  const nextDay_temp_text = document.createElement("h2");
  const nextDay_img = document.createElement("img");

  today_week_container.appendChild(tomorrow_weather);
  tomorrow_weather.appendChild(inner_div_tomorrow_weather);
  tomorrow_weather.appendChild(nextDay_temp_text);
  tomorrow_weather.appendChild(nextDay_img);
  inner_div_tomorrow_weather.appendChild(tomorrow_text);
  inner_div_tomorrow_weather.appendChild(weather_type);

  tomorrow_weather.className = "tomorrow-weather";

  tomorrow_text.textContent = "Tomorrow";

  weather_type.textContent = text;

  nextDay_temp_text.className = "temperature-nextDay";

  nextDay_img.src = `https://${tomorrowIcon}`;
  nextDay_img.alt = text;

  /*end of tomorrow div*/

  /* start of sun-up-down-container*/
  const sun_up_down_container = document.createElement("div");
  const sun_up_down_innerContainer1 = document.createElement("div");
  const sun_up_down_innerContainer2 = document.createElement("div");
  const sun_up_down_innerContainer3 = document.createElement("div");
  const sun_up_down_innerContainer1_title = document.createElement("h5");
  const sun_up_down_innerContainer2_title = document.createElement("h5");
  const sun_up_down_innerContainer3_title = document.createElement("h5");
  const innerKaInner_1 = document.createElement("div");
  const innerKaInner_2 = document.createElement("div");
  const innerKaInner_3 = document.createElement("div");
  const innerKaInner_1_heading = document.createElement("h4");
  const innerKaInner_2_heading = document.createElement("h4");
  const innerKaInner_3_heading = document.createElement("h4");

  lower_card.appendChild(sun_up_down_container);
  sun_up_down_container.className = "sun-up-down-container";

  sun_up_down_container.appendChild(sun_up_down_innerContainer1);
  sun_up_down_innerContainer1.className = "sun-up-down-innerContent";
  sun_up_down_innerContainer1_title.textContent = "Sunrise";

  sun_up_down_container.appendChild(sun_up_down_innerContainer2);
  sun_up_down_innerContainer2.className = "sun-up-down-innerContent";
  sun_up_down_innerContainer2_title.textContent = "Sunset";

  sun_up_down_container.appendChild(sun_up_down_innerContainer3);
  sun_up_down_innerContainer3.className = "sun-up-down-innerContent";
  sun_up_down_innerContainer3_title.textContent = "Day Length";

  sun_up_down_innerContainer1.appendChild(sun_up_down_innerContainer1_title);
  sun_up_down_innerContainer1.appendChild(innerKaInner_1);
  innerKaInner_1.className = "innerKaInner";
  innerKaInner_1_heading.textContent = sunrise;

  sun_up_down_innerContainer2.appendChild(sun_up_down_innerContainer2_title);
  sun_up_down_innerContainer2.appendChild(innerKaInner_2);
  innerKaInner_2.className = "innerKaInner";
  innerKaInner_2_heading.textContent = sunset;

  sun_up_down_innerContainer3.appendChild(sun_up_down_innerContainer3_title);
  sun_up_down_innerContainer3.appendChild(innerKaInner_3);
  innerKaInner_3.className = "innerKaInner";

  const sunriseTimeHour = parseInt(sunrise);
  const sunsetTimeHour = parseInt(sunset) + 12;
  const sunriseTimeMinutes = parseInt(sunrise.split(":")[1]);
  const sunsetTimeMinutes = parseInt(sunset.split(":")[1]);
  const durationHours = sunsetTimeHour - sunriseTimeHour;
  const durationMinutes = Math.abs(sunriseTimeMinutes - sunsetTimeMinutes);

  innerKaInner_3_heading.textContent = `${durationHours} hr ${durationMinutes} min`;

  innerKaInner_1.appendChild(innerKaInner_1_heading);
  innerKaInner_2.appendChild(innerKaInner_2_heading);
  innerKaInner_3.appendChild(innerKaInner_3_heading);

  nextDay_temp_text.textContent = `${avgtemp_c}°C`;

  /* end of sun-up-down-container*/
}

function rightWalaContainer(
  humidity,
  wind_kph,
  wind_degree,
  wind_dir,
  uv,
  airQualityIndex
) {
  const todays_highlight = document.createElement("div");
  right_card.appendChild(todays_highlight);
  right_card.className = "right-container";
  todays_highlight.className = "todays-highlight";

  const todays_highlight_title = document.createElement("h1");
  todays_highlight.appendChild(todays_highlight_title);
  todays_highlight_title.textContent = "Today's Highlight";

  const todays_highlight_grid = document.createElement("div");
  todays_highlight.appendChild(todays_highlight_grid);
  todays_highlight_grid.className = "todays-highlight-grid";

  const highlistSection_content_humidity = document.createElement("div");
  const highlistSection_content_windStatus = document.createElement("div");
  const highlistSection_content_uv = document.createElement("div");
  const highlistSection_quote = document.createElement("div");

  todays_highlight_grid.appendChild(highlistSection_content_humidity);
  highlistSection_content_humidity.className = "highlistSection-content";

  todays_highlight_grid.appendChild(highlistSection_content_windStatus);
  highlistSection_content_windStatus.className = "highlistSection-content";

  todays_highlight_grid.appendChild(highlistSection_content_uv);
  highlistSection_content_uv.className = "highlistSection-content";

  todays_highlight_grid.appendChild(highlistSection_quote);
  highlistSection_quote.className = "highlistSection-quote";

  const highlistSection_content_humidity_title = document.createElement("h4");
  const highlistSection_content_windStatus_title = document.createElement("h4");
  const highlistSection_content_uv_title = document.createElement("h4");

  highlistSection_content_humidity.appendChild(
    highlistSection_content_humidity_title
  );
  highlistSection_content_humidity_title.textContent = "Humidity";

  highlistSection_content_windStatus.appendChild(
    highlistSection_content_windStatus_title
  );
  highlistSection_content_windStatus_title.textContent = "Wind Status";

  highlistSection_content_uv.appendChild(highlistSection_content_uv_title);
  highlistSection_content_uv_title.textContent = "UV";

  const highlistSection_quote_title = document.createElement("h4");
  highlistSection_quote.appendChild(highlistSection_quote_title);
  highlistSection_quote_title.textContent = "Today's Quote";

  const highlistSection_content_humidity_image = document.createElement("img");
  const highlistSection_content_windStatus_image =
    document.createElement("img");
  const highlistSection_content_uv_image = document.createElement("img");
  highlistSection_content_humidity.appendChild(
    highlistSection_content_humidity_image
  );
  highlistSection_content_humidity_image.src = `./humidity.png`;
  highlistSection_content_humidity_image.alt = "Humidity Icon";

  highlistSection_content_windStatus.appendChild(
    highlistSection_content_windStatus_image
  );
  highlistSection_content_windStatus_image.src = "./wind.png";
  highlistSection_content_windStatus_image.alt = "Wind Icon";

  highlistSection_content_uv.appendChild(highlistSection_content_uv_image);
  highlistSection_content_uv_image.src = "./uv.png";
  highlistSection_content_uv_image.alt = "UV Icon";

  const highlistSection_content_humidity_innerDiv =
    document.createElement("div");
  const highlistSection_content_windStatus_innerDiv =
    document.createElement("div");
  const highlistSection_content_uv_innerDiv = document.createElement("div");
  const highlistSection_quote_innerDiv = document.createElement("div");

  highlistSection_content_humidity.appendChild(
    highlistSection_content_humidity_innerDiv
  );
  highlistSection_content_humidity_innerDiv.className = "humidity-info";

  highlistSection_content_windStatus.appendChild(
    highlistSection_content_windStatus_innerDiv
  );
  highlistSection_content_windStatus_innerDiv.className = "wind-info";

  highlistSection_content_uv.appendChild(highlistSection_content_uv_innerDiv);
  highlistSection_content_uv_innerDiv.className = "uv-info";

  highlistSection_quote.appendChild(highlistSection_quote_innerDiv);
  highlistSection_quote_innerDiv.className = "quote-container";

  const highlistSection_content_humidity_innerDiv_span1 =
    document.createElement("span");
  const highlistSection_content_humidity_innerDiv_span2 =
    document.createElement("span");
  highlistSection_content_humidity_innerDiv.appendChild(
    highlistSection_content_humidity_innerDiv_span1
  );
  highlistSection_content_humidity_innerDiv_span1.textContent = `${humidity}%`;

  highlistSection_content_humidity_innerDiv.appendChild(
    highlistSection_content_humidity_innerDiv_span2
  );
  highlistSection_content_humidity_innerDiv_span2.textContent =
    getAirQuality(airQualityIndex);

  const highlistSection_content_windStatus_innerDiv_span1 =
    document.createElement("span");
  const highlistSection_content_windStatus_innerDiv_span2 =
    document.createElement("span");
  highlistSection_content_windStatus_innerDiv.appendChild(
    highlistSection_content_windStatus_innerDiv_span1
  );
  highlistSection_content_windStatus_innerDiv_span1.textContent = `${wind_kph} km/h`;

  highlistSection_content_windStatus_innerDiv.appendChild(
    highlistSection_content_windStatus_innerDiv_span2
  );
  highlistSection_content_windStatus_innerDiv_span2.textContent = `${wind_degree}° ${wind_dir}`;

  const highlistSection_content_uv_innerDiv_span1 =
    document.createElement("span");
  const highlistSection_content_uv_innerDiv_span2 =
    document.createElement("span");
  highlistSection_content_uv_innerDiv.appendChild(
    highlistSection_content_uv_innerDiv_span1
  );
  highlistSection_content_uv_innerDiv_span1.textContent = `${uv} / 10`;

  highlistSection_content_uv_innerDiv.appendChild(
    highlistSection_content_uv_innerDiv_span2
  );
  highlistSection_content_uv_innerDiv_span2.textContent = getUVQuality(uv);

  const highlistSection_quote_p = document.createElement("p");

  getQuote().then((quoteData) => {
    highlistSection_quote_p.textContent = quoteData.text;
  });
  highlistSection_quote_innerDiv.appendChild(highlistSection_quote_p);
}

function getDay(localtime) {
  const splitDate = localtime.split(" ");
  const date = splitDate[0];
  const currentDate = new Date(date);
  const formattedDay = currentDate.toLocaleString("en-US", { weekday: "long" });
  return formattedDay;
}

async function getQuote() {
  try {
    const response = await fetch("https://type.fit/api/quotes");

    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("Empty or invalid data received");
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (error) {
    console.error("Error fetching quote:", error);
    displayError("Could not fetch a quote. Please try again later.");
    throw new Error("Could not fetch quote");
  }
}

function getAirQuality(airQualityIndex) {
  if (airQualityIndex < 4 && airQualityIndex > 0) {
    return "Good air quality";
  } else if (airQualityIndex < 7 && airQualityIndex >= 4) {
    return "Moderate air quality";
  } else if (airQualityIndex < 10 && airQualityIndex >= 7) {
    return "Poor air quality";
  } else {
    return "Very poor air quality";
  }
}

function getUVQuality(uv) {
  if (uv >= 0 && uv < 3) {
    return "Low";
  } else if (uv >= 3 && uv < 6) {
    return "Moderate";
  } else if (uv >= 6 && uv < 8) {
    return "High";
  } else if (uv >= 8 && uv <= 10) {
    return "Very High";
  } else {
    return "Extreme";
  }
}
