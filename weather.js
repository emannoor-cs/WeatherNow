/**
 * weather.js
 * ============================================================
 * Weather App — OpenWeatherMap API Integration
 * API Docs: https://openweathermap.org/api
 *
 * HOW TO SET YOUR API KEY:
 *   1. Go to https://home.openweathermap.org/users/sign_up
 *   2. Create a free account
 *   3. Go to "API Keys" tab and copy your key
 *   4. Replace the empty string in API_KEY below with your key
 *
 * FREE TIER includes:
 *   - Current weather  (/data/2.5/weather)
 *   - 5-day / 3-hour forecast  (/data/2.5/forecast)
 * ============================================================
 */

// ─────────────────────────────────────────────
// CONFIG — ✅ PUT YOUR API KEY HERE
// ─────────────────────────────────────────────
const CONFIG = {
  API_KEY: "54e900fc088debe0590e8e91a95d32e5",           // 🔑 Replace this!
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  ICON_URL: "https://openweathermap.org/img/wn",
};

// ─────────────────────────────────────────────
// STATE — holds the last fetched raw data
// ─────────────────────────────────────────────
const STATE = {
  unit: "metric",       // "metric" | "imperial"
  windUnit: "metric",   // "metric" (km/h) | "imperial" (mph)
  precipUnit: "metric", // "metric" (mm) | "imperial" (in)
  currentData: null,    // raw API response from /weather
  forecastData: null,   // raw API response from /forecast
};

// Day-name helper
const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ─────────────────────────────────────────────
// DOM REFERENCES
// ─────────────────────────────────────────────
const DOM = {
  searchInput:      () => document.getElementById("searchInput"),
  searchBtn:        () => document.getElementById("searchBtn"),
  errorMsg:         () => document.getElementById("errorMsg"),
  spinner:          () => document.getElementById("loadingSpinner"),

  // Current weather
  mainIcon:         () => document.getElementById("mainWeatherIcon"),
  cityName:         () => document.getElementById("cityName"),
  currentDate:      () => document.getElementById("currentDate"),
  currentTemp:      () => document.getElementById("currentTemp"),
  feelsLike:        () => document.getElementById("feelsLike"),
  humidity:         () => document.getElementById("humidity"),
  windSpeed:        () => document.getElementById("windSpeed"),
  windDir:          () => document.getElementById("windDir"),
  windGust:         () => document.getElementById("windGust"),
  precipitation:    () => document.getElementById("precipitation"),

  // Forecast containers
  dailyContainer:   () => document.getElementById("dailyForecastContainer"),
  hourlyContainer:  () => document.getElementById("hourlyContainer"),
  daySelector:      () => document.getElementById("daySelector"),
};

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────

/** Format a Unix timestamp into "Weekday Mon D, YYYY" */
function formatDate(unixTs, timezoneOffset) {
  const localMs = (unixTs + timezoneOffset) * 1000;
  const d = new Date(localMs);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${days[d.getUTCDay()]} ${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** Format Unix timestamp as "H AM/PM" */
function formatHour(unixTs, timezoneOffset) {
  const localMs = (unixTs + timezoneOffset) * 1000;
  const d = new Date(localMs);
  let h = d.getUTCHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h} ${ampm}`;
}

/** Convert wind speed: m/s → km/h or mph */
function convertWind(mps, unit) {
  if (unit === "metric") return `${Math.round(mps * 3.6)} km/h`;
  return `${Math.round(mps * 2.237)} mph`;
}

/** Convert temperature: already in °C or °F from API based on unit param */
function tempLabel(val, unit) {
  return `${Math.round(val)}°${unit === "metric" ? "C" : "F"}`;
}

/** Convert precipitation mm → inches if needed */
function convertPrecip(mm, unit) {
  if (unit === "metric") return `${mm.toFixed(1)} mm`;
  return `${(mm / 25.4).toFixed(2)} in`;
}

/** Wind direction: degrees → compass label */
function degToCompass(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

/** Build OWM icon URL */
function iconUrl(code) {
  return `${CONFIG.ICON_URL}/${code}@2x.png`;
}

// ─────────────────────────────────────────────
// SHOW / HIDE HELPERS
// ─────────────────────────────────────────────

function showSpinner(visible) {
  DOM.spinner().style.display = visible ? "flex" : "none";
}

function showError(msg) {
  const el = DOM.errorMsg();
  if (msg) {
    el.textContent = msg;
    el.style.display = "block";
  } else {
    el.style.display = "none";
  }
}

/** Dim data panels while loading */
function setDataLoading(loading) {
  const panels = document.querySelectorAll(".temp-container, .flex-box, .daily-forecast, .hourly-forecast");
  panels.forEach(p => p.classList.toggle("data-loading", loading));
}

// ─────────────────────────────────────────────
// API FETCH FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Fetch current weather for a city name
 * @param {string} city
 * @param {string} unit - "metric" | "imperial"
 * @returns {Promise<Object>} OWM /weather response
 */
async function fetchCurrentWeather(city, unit) {
  const url = `${CONFIG.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=${unit}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error(`City "${city}" not found. Please check the spelling.`);
    if (res.status === 401) throw new Error("Invalid API key. Please check CONFIG.API_KEY in weather.js.");
    throw new Error(`Weather service error (${res.status}). Please try again.`);
  }
  return res.json();
}

/**
 * Fetch 5-day / 3-hour forecast for a city
 * @param {string} city
 * @param {string} unit - "metric" | "imperial"
 * @returns {Promise<Object>} OWM /forecast response
 */
async function fetchForecast(city, unit) {
  const url = `${CONFIG.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=${unit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast fetch failed (${res.status}).`);
  return res.json();
}

// ─────────────────────────────────────────────
// RENDER FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Render the main current-weather card and stat boxes
 * @param {Object} data - OWM /weather response
 */
function renderCurrentWeather(data) {
  const tz = data.timezone; // seconds offset from UTC
  const weather = data.weather[0];
  const unit = STATE.unit;

  // Icon
  DOM.mainIcon().src = iconUrl(weather.icon);
  DOM.mainIcon().alt = weather.description;

  // City & date
  DOM.cityName().textContent = `${data.name}, ${data.sys.country}`;
  DOM.currentDate().textContent = formatDate(data.dt, tz);

  // Temperature
  DOM.currentTemp().textContent = tempLabel(data.main.temp, unit);

  // Stat boxes
  DOM.feelsLike().textContent = tempLabel(data.main.feels_like, unit);
  DOM.humidity().textContent  = `${data.main.humidity}%`;

  // Wind
  const windMps = data.wind.speed; // OWM returns m/s for metric too, but with units=metric it returns m/s
  // Actually OWM with units=metric returns m/s — we convert ourselves for km/h
  DOM.windSpeed().textContent = convertWind(windMps, STATE.windUnit);
  DOM.windDir().textContent   = `↗ ${degToCompass(data.wind.deg)} direction`;

  if (data.wind.gust) {
    DOM.windGust().textContent = `Gust: ${convertWind(data.wind.gust, STATE.windUnit)}`;
  } else {
    DOM.windGust().textContent = "";
  }

  // Precipitation (last 1h if available, else 0)
  const precipMm = data.rain?.["1h"] ?? data.snow?.["1h"] ?? 0;
  DOM.precipitation().textContent = convertPrecip(precipMm, STATE.precipUnit);
}

/**
 * Build daily forecast from OWM /forecast 3-hour list
 * Groups slots by day, picks min/max temp and representative icon
 * @param {Object} forecastData - OWM /forecast response
 */
function renderDailyForecast(forecastData) {
  const tz = forecastData.city.timezone;
  const list = forecastData.list;
  const unit = STATE.unit;

  // Group by day
  const byDay = {};
  list.forEach(slot => {
    const localMs = (slot.dt + tz) * 1000;
    const d = new Date(localMs);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    if (!byDay[key]) {
      byDay[key] = {
        dayName: DAY_NAMES[d.getUTCDay()],
        temps: [],
        icons: [],
      };
    }
    byDay[key].temps.push(slot.main.temp);
    byDay[key].icons.push(slot.weather[0].icon);
  });

  const days = Object.values(byDay).slice(0, 7);
  const container = DOM.dailyContainer();
  container.innerHTML = "";

  days.forEach(day => {
    const max = Math.max(...day.temps);
    const min = Math.min(...day.temps);
    // pick the noon-ish icon (middle of array)
    const icon = day.icons[Math.floor(day.icons.length / 2)];

    const box = document.createElement("div");
    box.className = "forecast-box";
    box.innerHTML = `
      <p class="day">${day.dayName}</p>
      <img src="${iconUrl(icon)}" alt="weather" class="weather-icon">
      <p class="temp">
        <span class="max">${tempLabel(max, unit)}</span>
        <span class="min">${tempLabel(min, unit)}</span>
      </p>
    `;
    container.appendChild(box);
  });
}

/**
 * Build hourly forecast boxes for a given day index
 * @param {Object} forecastData - OWM /forecast response
 * @param {number} dayIndex - 0 = today, 1 = tomorrow, etc.
 */
function renderHourlyForecast(forecastData, dayIndex = 0) {
  const tz = forecastData.city.timezone;
  const list = forecastData.list;
  const unit = STATE.unit;

  // Collect unique date keys in order
  const dayKeys = [];
  const seenKeys = new Set();
  list.forEach(slot => {
    const localMs = (slot.dt + tz) * 1000;
    const d = new Date(localMs);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    if (!seenKeys.has(key)) { seenKeys.add(key); dayKeys.push(key); }
  });

  // Filter slots for the chosen day
  const targetKey = dayKeys[dayIndex] ?? dayKeys[0];
  const slots = list.filter(slot => {
    const localMs = (slot.dt + tz) * 1000;
    const d = new Date(localMs);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    return key === targetKey;
  });

  const container = DOM.hourlyContainer();
  container.innerHTML = "";

  slots.forEach(slot => {
    const box = document.createElement("div");
    box.className = "hour-box";
    box.innerHTML = `
      <span class="time">${formatHour(slot.dt, tz)}</span>
      <img src="${iconUrl(slot.weather[0].icon)}" alt="${slot.weather[0].description}" class="hour-icon">
      <span class="temp">${tempLabel(slot.main.temp, unit)}</span>
    `;
    container.appendChild(box);
  });
}

/**
 * Populate the day-selector dropdown with real day names
 * @param {Object} forecastData
 */
function populateDaySelector(forecastData) {
  const tz = forecastData.city.timezone;
  const list = forecastData.list;

  const dayKeys = [];
  const seenKeys = new Set();
  list.forEach(slot => {
    const localMs = (slot.dt + tz) * 1000;
    const d = new Date(localMs);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      dayKeys.push({ key, dayName: DAY_NAMES[d.getUTCDay()] });
    }
  });

  const select = DOM.daySelector();
  select.innerHTML = "";
  dayKeys.forEach((dk, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = dk.dayName;
    select.appendChild(opt);
  });
}

// ─────────────────────────────────────────────
// MAIN SEARCH ORCHESTRATOR
// ─────────────────────────────────────────────

/**
 * Main entry point: fetch + render all weather data for a city
 * @param {string} city
 */
async function fetchWeather(city) {
  if (!city.trim()) {
    showError("Please enter a city name.");
    return;
  }

  // Guard: API key not set
  if (CONFIG.API_KEY === "YOUR_API_KEY_HERE") {
    showError("⚠️ API key not set. Open weather.js and replace YOUR_API_KEY_HERE with your OpenWeatherMap API key.");
    return;
  }

  showError("");        // clear previous errors
  showSpinner(true);
  setDataLoading(true);

  try {
    // Fetch both endpoints in parallel for speed
    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(city, STATE.unit),
      fetchForecast(city, STATE.unit),
    ]);

    // Store raw data for unit-switch re-renders
    STATE.currentData  = currentData;
    STATE.forecastData = forecastData;

    // Render everything
    renderCurrentWeather(currentData);
    renderDailyForecast(forecastData);
    populateDaySelector(forecastData);
    renderHourlyForecast(forecastData, 0);

    // Reset day selector
    DOM.daySelector().value = 0;

  } catch (err) {
    showError(err.message);
    console.error("[WeatherApp]", err);
  } finally {
    showSpinner(false);
    setDataLoading(false);
  }
}

// ─────────────────────────────────────────────
// UNIT SWITCHING — no re-fetch, uses STATE data
// ─────────────────────────────────────────────

/**
 * Convert already-fetched data to new unit and re-render
 * OWM returns temp in the unit requested — so we must re-fetch
 * for temp unit changes. For wind/precip we convert locally.
 * @param {string} type   - "temp" | "wind" | "precip"
 * @param {string} unit   - "metric" | "imperial"
 */
async function switchUnit(type, unit) {
  if (type === "temp") {
    if (STATE.unit === unit) return; // already in this unit
    STATE.unit = unit;

    // For temp we must re-fetch since OWM bakes unit into response
    if (STATE.currentData) {
      const city = STATE.currentData.name;
      await fetchWeather(city);
    }
  }

  if (type === "wind") {
    STATE.windUnit = unit;
    if (STATE.currentData) {
      // Re-render just the wind fields locally (no API call)
      const data = STATE.currentData;
      DOM.windSpeed().textContent = convertWind(data.wind.speed, STATE.windUnit);
      if (data.wind.gust) {
        DOM.windGust().textContent = `Gust: ${convertWind(data.wind.gust, STATE.windUnit)}`;
      }
    }
  }

  if (type === "precip") {
    STATE.precipUnit = unit;
    if (STATE.currentData) {
      const precipMm = STATE.currentData.rain?.["1h"] ?? STATE.currentData.snow?.["1h"] ?? 0;
      DOM.precipitation().textContent = convertPrecip(precipMm, STATE.precipUnit);
    }
  }
}

// ─────────────────────────────────────────────
// DROPDOWN — wire up unit option clicks
// ─────────────────────────────────────────────

function initDropdown() {
  const options = document.querySelectorAll(".unit-option");

  options.forEach(opt => {
    opt.addEventListener("click", async (e) => {
      e.preventDefault();

      const type = opt.dataset.type;   // "temp" | "wind" | "precip"
      const unit = opt.dataset.unit;   // "metric" | "imperial"

      // Highlight active option within its group
      document.querySelectorAll(`.unit-option[data-type="${type}"]`)
        .forEach(o => o.classList.remove("active"));
      opt.classList.add("active");

      await switchUnit(type, unit);
    });
  });

  // Set defaults as active on load
  document.querySelector('.unit-option[data-type="temp"][data-unit="metric"]')?.classList.add("active");
  document.querySelector('.unit-option[data-type="wind"][data-unit="metric"]')?.classList.add("active");
  document.querySelector('.unit-option[data-type="precip"][data-unit="metric"]')?.classList.add("active");
}

// ─────────────────────────────────────────────
// DAY SELECTOR — switch hourly view by day
// ─────────────────────────────────────────────

function initDaySelector() {
  DOM.daySelector().addEventListener("change", (e) => {
    if (STATE.forecastData) {
      renderHourlyForecast(STATE.forecastData, parseInt(e.target.value));
    }
  });
}

// ─────────────────────────────────────────────
// SEARCH EVENTS — button click + Enter key
// ─────────────────────────────────────────────

function initSearch() {
  DOM.searchBtn().addEventListener("click", () => {
    fetchWeather(DOM.searchInput().value);
  });

  DOM.searchInput().addEventListener("keydown", (e) => {
    if (e.key === "Enter") fetchWeather(DOM.searchInput().value);
  });
}

// ─────────────────────────────────────────────
// INIT — run when DOM is ready
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  initDropdown();
  initDaySelector();

  // Optional: load a default city on startup
  // fetchWeather("Berlin");
});