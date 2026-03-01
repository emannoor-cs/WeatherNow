# 🌤️ WeatherNow

<div align="center">

![WeatherNow](https://img.shields.io/badge/Weather-Now-blue?style=for-the-badge&logo=cloud&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=for-the-badge&logo=icloud&logoColor=white)

**Know your sky. Anytime. Anywhere.**

[🌐 Live Demo](weathernow-ochre.vercel.app) · [🐛 Report Bug](https://github.com/emannoor-cs/WeatherNow/issues) · [✨ Request Feature](https://github.com/emannoor-cs/WeatherNow/issues)

</div>

---

## ✨ What is WeatherNow?

**WeatherNow** is a sleek, real-time weather app that gives you instant access to current conditions, hourly breakdowns, and 7-day forecasts for any city on the planet — all wrapped in a beautiful dark UI that's as enjoyable to look at as it is to use.

No clutter. No noise. Just your weather, right now.

---

## 🖼️ Preview

<div align="center">

![Desktop Preview](preview.jpg)

</div>

---

## 🚀 Features

- 🔍 **Instant City Search** — type any city, get results in seconds
- 🌡️ **Current Conditions** — temperature, feels like, humidity, precipitation
- 💨 **Full Wind Details** — speed, direction, and gust info
- 📅 **7-Day Daily Forecast** — plan your whole week ahead
- 🕐 **24-Hour Breakdown** — scroll through hourly conditions day by day
- 🔄 **Live Unit Switching** — toggle °C/°F, km/h/mph, mm/in instantly — no reload
- ⚡ **Parallel API Fetching** — both endpoints load simultaneously for speed
- 💀 **Smart Error Handling** — friendly messages for invalid cities or network issues
- ⏳ **Loading Spinner** — smooth feedback while data loads
- 📱 **Fully Responsive** — looks great on mobile, tablet, and desktop

---

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Custom properties, Flexbox, animations |
| **Vanilla JavaScript (ES6+)** | All logic, API calls, DOM updates |
| **OpenWeatherMap API** | Live weather + forecast data |
| **Font Awesome 6** | Icons |
| **DM Sans + Bricolage Grotesque** | Typography |

> Zero frameworks. Zero dependencies. Just clean, modern web tech. 💪

---

## 📁 Project Structure

```
WeatherNow/
│
├── 📄 index.html                 # App structure & markup
├── 🎨 style.css                  # All styling
├── ⚙️  weather.js                 # API logic & interactivity
│
└── 📁 assets/
    ├── 📁 images/
    │   ├── logo.svg
    │   ├── favicon-32x32.png
    │   ├── bg-today-large.svg
    │   ├── icon-search.svg
    │   ├── icon-units.svg
    │   ├── icon-sunny.webp
    │   ├── icon-rain.webp
    │   ├── icon-storm.webp
    │   ├── icon-snow.webp
    │   ├── icon-fog.webp
    │   ├── icon-drizzle.webp
    │   ├── icon-overcast.webp
    │   └── icon-partly-cloudy.webp
    │
    └── 📁 fonts/
        ├── DM_Sans/
        └── Bricolage_Grotesque/
```

---

## ⚡ Getting Started

### Prerequisites
- A modern browser (Chrome, Firefox, Edge, Safari)
- A free [OpenWeatherMap](https://openweathermap.org) API key

### Installation

**1. Clone the repo**
```bash
git clone https://github.com/emannoor-cs/WeatherNow.git
cd WeatherNow
```

**2. Add your API key**

Open `weather.js` and find this line at the top:
```js
const CONFIG = {
  API_KEY: "YOUR_API_KEY_HERE",  // 🔑 paste your key here
  ...
};
```

**3. Run it**

No build tools needed — just open `index.html` in your browser!
```bash
# Recommended: use VS Code Live Server
# Or serve locally with:
npx serve .
```

---

## 🔑 API Setup

1. Sign up free at [openweathermap.org](https://home.openweathermap.org/users/sign_up)
2. Go to **API Keys** tab in your dashboard
3. Copy your key and paste it into `weather.js`

> ⏳ New keys take **10–30 minutes** to activate — if you see a 401 error, just wait a bit!

---

## 🎮 How to Use

| Action | How |
|---|---|
| Search a city | Type in the search bar → press **Search** or hit **Enter** |
| View current weather | Shown instantly in the main card |
| Check the week ahead | 7 forecast cards below the main card |
| Browse hourly | Use the **day selector** dropdown on the right panel |
| Switch units | Click **Units** button in the header |

---

## 🗺️ What's Coming Next

- [ ] 📍 Auto-detect location via GPS
- [ ] ⭐ Save favourite cities
- [ ] 🌅 Sunrise & sunset times
- [ ] 🫁 Air Quality Index (AQI)
- [ ] 📊 Hourly temperature chart
- [ ] 🔎 City search autocomplete
- [ ] 🌓 Light / Dark theme toggle
- [ ] 📲 PWA support (install as app)

---

## 🧠 What I Learned

- Working with real-world REST APIs using `fetch` and `async/await`
- Parallel API requests with `Promise.all()` for better performance
- Dynamic DOM manipulation without any frameworks
- Unit conversion logic without re-fetching data
- Responsive design with CSS custom properties and Flexbox
- Clean modular JavaScript architecture

---

## 👩‍💻 Author

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-emannoor--cs-181717?style=for-the-badge&logo=github)](https://github.com/emannoor-cs)

*Building cool things, one project at a time* ✨

</div>

