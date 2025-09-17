import React, { useEffect, useState } from "react";

const apiKey = "1e3e8f230b6064d27976e41163a82b77";

export default function WeatherGeoForecast() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const mapRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`);
        const userdata = await mapRes.json();
        const loc = userdata[0]?.name;
        if (!loc) throw new Error("Location not found");
        const url = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${loc}&appid=${apiKey}`;
        const respond = await fetch(url);
        const data = await respond.json();
        setWeather({
          city: data.city.name,
          temp: Math.floor(data.list[0].main.temp),
          description: data.list[0].weather[0].description,
          humidity: Math.floor(data.list[0].main.humidity),
          feels_like: Math.floor(data.list[0].main.feels_like),
          temp_min: Math.floor(data.list[0].main.temp_min),
          temp_max: Math.floor(data.list[0].main.temp_max),
          weatherMain: data.list[0].weather[0].main.toLowerCase(),
        });
        // 5-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city.name}&appid=${apiKey}&units=metric`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();
        const dailyForecasts = {};
        forecastData.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          let day = new Date(date).getDay();
          if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
              day_today: dayName[day],
              temperature: Math.floor(item.main.temp) + "°",
              description: item.weather[0].description,
              weatherImg: item.weather[0].main.toLowerCase()
            };
          }
        });
        setForecast(Object.values(dailyForecasts));
      } catch (err) {
        setError("Could not retrieve weather data. " + err.message);
      }
    }, () => {
      setError("Please turn on your location and refresh the page");
    });
  }, []);

  function getWeatherIcon(main) {
    if (main === "rain") return "img/rain.png";
    if (main === "clear" || main === "clear sky") return "img/sun.png";
    if (main === "snow") return "img/snow.png";
    if (main === "clouds" || main === "smoke") return "img/cloud.png";
    if (main === "mist" || main === "fog") return "img/mist.png";
    if (main === "haze") return "img/haze.png";
    if (main === "thunderstorm") return "img/thunderstorm.png";
    return "img/sun.png";
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2>Weather by Your Location</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {weather && (
        <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <div id="city-name" style={{ fontWeight: "bold", fontSize: 20 }}>{weather.city}</div>
          <img className="weather-icon" src={getWeatherIcon(weather.weatherMain)} alt={weather.weatherMain} style={{ width: 64, height: 64 }} />
          <div id="metric">{weather.temp}°</div>
          <div id="weather-main">{weather.description}</div>
          <div id="humidity">Humidity: {weather.humidity}%</div>
          <div id="feels-like">Feels like: {weather.feels_like}°</div>
          <div id="temp-min-today">Min: {weather.temp_min}°</div>
          <div id="temp-max-today">Max: {weather.temp_max}°</div>
        </div>
      )}
      {forecast.length > 0 && (
        <div id="future-forecast-box" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {forecast.map((f, idx) => (
            <div className="weather-forecast-box" key={idx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 8, minWidth: 120 }}>
              <div className="day-weather"><span>{f.day_today}</span></div>
              <div className="weather-icon-forecast">
                <img src={getWeatherIcon(f.weatherImg)} alt={f.weatherImg} style={{ width: 40, height: 40 }} />
              </div>
              <div className="temp-weather"><span>{f.temperature}</span></div>
              <div className="weather-main-forecast">{f.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
