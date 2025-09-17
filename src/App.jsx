import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const apiKey = "1e3e8f230b6064d27976e41163a82b77";

function WeatherApp() {
  const [cityInput, setCityInput] = useState("");
  const [weatherBoxes, setWeatherBoxes] = useState([]);
  const [normalMessage, setNormalMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);

  const months_name = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const now = new Date();
  const dateString = `${months_name[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  async function fetchCityWeather(cityName) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  }

  function getWeatherIcon(main) {
    if (main === "Rain") return "img/rain.png";
    if (main === "Clear" || main === "Clear Sky") return "img/sun.png";
    if (main === "Snow") return "img/snow.png";
    if (main === "Clouds" || main === "Smoke") return "img/cloud.png";
    if (main === "Mist" || main === "Fog") return "img/mist.png";
    if (main === "Haze") return "img/haze.png";
    if (main === "Thunderstorm") return "img/thunderstorm.png";
    return "img/sun.png";
  }

  async function handleSearch(e) {
    if (e.key === "Enter") {
      const data = await fetchCityWeather(cityInput);
      if (data) {
        setWeatherBoxes(prev => [data, ...prev]);
        setNormalMessage(false);
        setErrorMessage(false);
        setAddedMessage(true);
      } else {
        setNormalMessage(false);
        setErrorMessage(true);
        setAddedMessage(false);
      }
      setCityInput("");
    }
  }

  function toggleSection() {
    setSectionOpen(open => !open);
  }

  // Initial cities
  React.useEffect(() => {
    const defaultCities = ["London", "Paris", "New York", "Mumbai", "Tokyo"];
    Promise.all(defaultCities.map(fetchCityWeather)).then(results => {
      setWeatherBoxes(results.filter(Boolean));
    });
  }, []);

  return (
    <div>
      <div className="date">{dateString}</div>
      <button className="button" onClick={toggleSection}>
        <span className="btn-icon">
          <i className={`fa-solid ${sectionOpen ? "fa-circle-xmark" : "fa-circle-plus"}`}></i>
        </span>
        Add City
      </button>
      <div className="add-section" style={{ top: sectionOpen ? "100px" : "-60rem" }}>
        <input
          className="searchinput"
          type="text"
          value={cityInput}
          onChange={e => setCityInput(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Enter city name"
        />
      </div>
      <div className="messages">
        {normalMessage && <div className="normal-message">Enter a city to get weather info.</div>}
        {errorMessage && <div className="error-message">City not found. Please try again.</div>}
        {addedMessage && <div className="added-message">Weather info added!</div>}
      </div>
      <div className="city-box">
        {weatherBoxes.map((data, idx) => (
          <div className="box" key={data.id || idx}>
            <div className="weather-box">
              <div className="name">
                <div className="city-name city">{data.name}</div>
                <div className="weather-temp temp">{Math.floor(data.main.temp)}°</div>
              </div>
              <div className="weather-icon">
                <img className="weather" src={getWeatherIcon(data.weather[0].main)} alt={data.weather[0].main} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <hr />
      <WeatherApp />
    </>
  )
}

export default App
