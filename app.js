// Weather Mood Page
// Live weather via Open-Meteo (free, no API key required).
//   Geocoding : https://geocoding-api.open-meteo.com/v1/search
//   Forecast  : https://api.open-meteo.com/v1/forecast

const form = document.getElementById("search-form");
const input = document.getElementById("city-input");

const els = {
  idle: document.getElementById("state-idle"),
  loading: document.getElementById("state-loading"),
  error: document.getElementById("state-error"),
  errorText: document.getElementById("error-text"),
  weather: document.getElementById("weather"),
  place: document.getElementById("place"),
  desc: document.getElementById("desc"),
  icon: document.getElementById("icon"),
  temp: document.getElementById("temp"),
  feels: document.getElementById("feels"),
  humidity: document.getElementById("humidity"),
  wind: document.getElementById("wind"),
  localtime: document.getElementById("localtime"),
  moodLabel: document.getElementById("mood-label"),
};

// WMO weather codes -> { text, icon, mood, moodLabel }
// mood drives the page theme via <body data-mood="...">
function describe(code, isDay) {
  const day = isDay ? "clear-day" : "clear-night";
  const map = {
    0:  ["Clear sky",           isDay ? "☀️" : "🌙", day,     isDay ? "Bright and warm" : "Calm and clear"],
    1:  ["Mainly clear",        isDay ? "🌤️" : "🌙", day,     isDay ? "Mostly sunny" : "A quiet night"],
    2:  ["Partly cloudy",       isDay ? "⛅" : "☁️",  "cloudy", "A soft, drifting sky"],
    3:  ["Overcast",            "☁️",                "cloudy", "Grey and mellow"],
    45: ["Fog",                 "🌫️",               "fog",    "Hushed and hazy"],
    48: ["Rime fog",            "🌫️",               "fog",    "Hushed and hazy"],
    51: ["Light drizzle",       "🌦️",               "rain",   "Cool and calm"],
    53: ["Drizzle",             "🌦️",               "rain",   "Cool and calm"],
    55: ["Heavy drizzle",       "🌧️",               "rain",   "Cool and calm"],
    56: ["Freezing drizzle",    "🌧️",               "rain",   "Cold and glassy"],
    57: ["Freezing drizzle",    "🌧️",               "rain",   "Cold and glassy"],
    61: ["Light rain",          "🌦️",               "rain",   "Cool and calm"],
    63: ["Rain",                "🌧️",               "rain",   "Steady and blue"],
    65: ["Heavy rain",          "🌧️",               "rain",   "Steady and blue"],
    66: ["Freezing rain",       "🌧️",               "rain",   "Cold and glassy"],
    67: ["Freezing rain",       "🌧️",               "rain",   "Cold and glassy"],
    71: ["Light snow",          "🌨️",               "snow",   "Soft and white"],
    73: ["Snow",                "❄️",                "snow",   "Soft and white"],
    75: ["Heavy snow",          "❄️",                "snow",   "Soft and white"],
    77: ["Snow grains",         "🌨️",               "snow",   "Soft and white"],
    80: ["Rain showers",        "🌦️",               "rain",   "Cool and calm"],
    81: ["Rain showers",        "🌧️",               "rain",   "Steady and blue"],
    82: ["Violent showers",     "⛈️",                "storm",  "Dramatic and dark"],
    85: ["Snow showers",        "🌨️",               "snow",   "Soft and white"],
    86: ["Snow showers",        "❄️",                "snow",   "Soft and white"],
    95: ["Thunderstorm",        "⛈️",                "storm",  "Dramatic and dark"],
    96: ["Storm with hail",     "⛈️",                "storm",  "Dramatic and dark"],
    99: ["Storm with hail",     "⛈️",                "storm",  "Dramatic and dark"],
  };
  return map[code] || ["Unknown", "🌡️", "default", "A mystery sky"];
}

function show(state) {
  els.idle.hidden = state !== "idle";
  els.loading.hidden = state !== "loading";
  els.error.hidden = state !== "error";
  els.weather.hidden = state !== "weather";
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error (${res.status})`);
  return res.json();
}

async function getWeather(city) {
  show("loading");
  try {
    const geo = await fetchJSON(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    if (!geo.results || geo.results.length === 0) {
      throw new Error(`Couldn't find "${city}". Check the spelling?`);
    }
    const { latitude, longitude, name, country, admin1 } = geo.results[0];

    const wx = await fetchJSON(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m` +
      `&timezone=auto`
    );
    render(wx.current, { name, country, admin1, tz: wx.timezone });
  } catch (err) {
    els.errorText.textContent = err.message || "Something went wrong.";
    show("error");
    document.body.dataset.mood = "default";
    els.moodLabel.textContent = "—";
  }
}

function render(cur, place) {
  const [text, icon, mood, moodLabel] = describe(cur.weather_code, cur.is_day === 1);

  document.body.dataset.mood = mood;
  els.place.textContent = [place.name, place.admin1, place.country].filter(Boolean).slice(0, 2).join(", ");
  els.desc.textContent = text;
  els.icon.textContent = icon;
  els.temp.textContent = Math.round(cur.temperature_2m);
  els.feels.textContent = Math.round(cur.apparent_temperature);
  els.humidity.textContent = `${cur.relative_humidity_2m}%`;
  els.wind.textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
  els.localtime.textContent = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", timeZone: place.tz,
  });
  els.moodLabel.textContent = moodLabel;

  show("weather");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city) getWeather(city);
});

// A friendly first impression.
input.value = "Accra";
getWeather("Accra");
