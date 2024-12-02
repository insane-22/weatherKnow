import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState(null);

  const getCache = (key) => {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const currentTime = new Date().getTime();
      if (currentTime - parsedData.timestamp < 30 * 60 * 1000) { 
        return parsedData.data;
      }
    }
    return null;
  };

  const setCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: new Date().getTime() }));
  };

  const fetchWeather = async (city) => {
    const cachedWeather = getCache(`weather_${city}`);
    if (cachedWeather) {
      setWeatherData(cachedWeather);
      return;
    }

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(currentWeatherURL);
      setWeatherData(response.data);
      setCache(`weather_${city}`, response.data);
      setView("weather");
      setError(null);
    } catch (err) {
      console.log(err);
      setWeatherData(null);
      if (err.response && err.response.status === 404) {
        setError("City not found. Please try again.");
      } else if (err.response && err.response.status === 429) {
        setError("You have exceeded API call limit available :(");
      }
    }
  };

  const fetchForecast = async (city) => {
    const cachedForecast = getCache(`forecast_${city}`);
    if (cachedForecast) {
      setForecastData(cachedForecast);
      return;
    }

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(forecastURL);
      const filteredForecast = filterForecastByDay(response.data.list);
      setForecastData(filteredForecast);
      setCache(`forecast_${city}`, filteredForecast);
      setView("forecast");
      setError(null);
    } catch (err) {
      console.log(err);
      setForecastData(null);
      if (err.response && err.response.status === 404) {
        setError("City not found. Please try again.");
      } else if (err.response && err.response.status === 429) {
        setError("You have exceeded API call limit available :(");
      }
    }
  };

  const filterForecastByDay = (data) => {
    const filtered = [];
    let currentDay = null;

    data.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const day = date.toISOString().split("T")[0];

      if (day !== currentDay) {
        currentDay = day;
        filtered.push(entry);
      }
    });

    return filtered;
  };

  return (
    <div className="App">
      <div className="weather-container">
        <h1>weather Know</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button onClick={() => fetchWeather(city)} disabled={!city.trim()}>
            Current Weather
          </button>
          <button onClick={() => fetchForecast(city)} disabled={!city.trim()}>
            5-Day Forecast
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {view === "weather" && weatherData && (
          <div className="weather-card">
            <h2>{weatherData.name}</h2>
            <p>
              <span>🌡️</span> {weatherData.main.temp}°C
            </p>
            <p>
              <span>💧</span> {weatherData.main.humidity}%
            </p>
            <p>
              <span>☁️</span> {weatherData.weather[0].description}
            </p>
          </div>
        )}

        {view === "forecast" && forecastData && (
          <div className="forecast">
            <h3>5-Day Forecast of {city}</h3>
            <div className="forecast-grid">
              {forecastData.map((entry, index) => (
                <div key={index} className="forecast-card">
                  <p>{new Date(entry.dt * 1000).toLocaleDateString()}</p>
                  <p>
                    {new Date(entry.dt * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>🌡️ {entry.main.temp}°C</p>
                  <p>{entry.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
