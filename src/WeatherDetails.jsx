import React, { useState } from "react";

const apiKey = "1e3e8f230b6064d27976e41163a82b77";

export default function WeatherDetails() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [showBox, setShowBox] = useState(false);

  async function search(city, state, country) {
    setError("");
    setShowBox(false);
    setWeather(null);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city},${state},${country}&appid=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        setError("City not found. Please try again.");
        return;
      }
      const data = await res.json();
      setWeather(data);
      setShowBox(true);
    } catch {
      setError("Error fetching weather data.");
    }
  }

  function getWeatherIcon(main) {
    if (main === "Rain") return "img/rain.png";
    if (main === "Clear") return "img/sun.png";
    if (main === "Snow") return "img/snow.png";
    if (main === "Clouds" || main === "Smoke") return "img/cloud.png";
    if (main === "Mist" || main === "Fog") return "img/mist.png";
    if (main === "Haze") return "img/haze.png";
    if (main === "Thunderstorm") return "img/thunderstorm.png";
    return "img/sun.png";
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      search(city, state, country);
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Weather Details Search</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          className="searchinput"
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          placeholder="State (optional)"
          value={state}
          onChange={e => setState(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          placeholder="Country (optional)"
          value={country}
          onChange={e => setCountry(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => search(city, state, country)}>Search</button>
      </div>
      {error && <div className="error-message" style={{ color: "red" }}>{error}</div>}
      <div className="return" style={{ display: showBox ? "block" : "none", border: "1px solid #ccc", padding: 16, borderRadius: 8, marginTop: 8 }}>
        {weather && (
          <>
            <div className="city-name" style={{ fontWeight: "bold", fontSize: 20 }}>{weather.name}</div>
            <img className="weather-img" src={getWeatherIcon(weather.weather[0].main)} alt={weather.weather[0].main} style={{ width: 64, height: 64 }} />
            <div className="weather-temp">{Math.floor(weather.main.temp)}°</div>
            <div className="wind">Wind: {Math.floor(weather.wind.speed)} m/s</div>
            <div className="pressure">Pressure: {Math.floor(weather.main.pressure)} hPa</div>
            <div className="humidity">Humidity: {Math.floor(weather.main.humidity)}%</div>
            <div className="sunrise">Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            <div className="sunset">Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
          </>
        )}
      </div>
    </div>
  );
}
