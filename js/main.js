let apiKey = "1e3e8f230b6064d27976e41163a82b77";

// Live date functionality
let lastDateString = '';

function updateLiveDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateString = now.toLocaleDateString('en-US', options);

    // Only update if the date has actually changed
    if (dateString !== lastDateString) {
        const liveDateElement = document.querySelector('.live-date');
        if (liveDateElement) {
            liveDateElement.textContent = dateString;
            lastDateString = dateString;
        }
    }
}

// Update date every minute instead of every second to prevent blinking
setInterval(updateLiveDate, 60000); // 60000ms = 1 minute
updateLiveDate(); // Initial call

// Severe Weather Alerts System
function checkSevereWeather(data) {
    const alerts = [];
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherMain = data.weather[0].main.toLowerCase();
    const weatherDesc = data.weather[0].description.toLowerCase();

    // Temperature alerts
    if (temp >= 40) {
        alerts.push({
            title: "Extreme Heat Warning",
            description: "Temperature is extremely high. Stay hydrated and avoid outdoor activities during peak sun hours.",
            severity: "high"
        });
    } else if (temp >= 35) {
        alerts.push({
            title: "Heat Warning",
            description: "High temperature detected. Drink plenty of water and limit sun exposure.",
            severity: "medium"
        });
    } else if (temp <= 0) {
        alerts.push({
            title: "Freezing Conditions",
            description: "Freezing temperatures detected. Dress warmly and take precautions against frostbite.",
            severity: "high"
        });
    }

    // Wind alerts
    if (windSpeed >= 30) {
        alerts.push({
            title: "High Wind Warning",
            description: "Strong winds detected. Secure loose objects and be cautious when driving.",
            severity: "high"
        });
    } else if (windSpeed >= 20) {
        alerts.push({
            title: "Wind Advisory",
            description: "Moderate to strong winds. Be prepared for gusty conditions.",
            severity: "medium"
        });
    }

    // Weather condition alerts
    if (weatherMain === "thunderstorm" || weatherDesc.includes("thunderstorm")) {
        alerts.push({
            title: "Thunderstorm Warning",
            description: "Thunderstorms in the area. Seek shelter and avoid open areas.",
            severity: "high"
        });
    } else if (weatherMain === "rain" && data.rain && data.rain['1h'] >= 10) {
        alerts.push({
            title: "Heavy Rain Warning",
            description: "Heavy rainfall expected. Be prepared for flooding and reduced visibility.",
            severity: "high"
        });
    } else if (weatherMain === "snow") {
        alerts.push({
            title: "Snow Warning",
            description: "Snowfall detected. Roads may be slippery, drive cautiously.",
            severity: "medium"
        });
    }

    // Display alerts
    if (alerts.length > 0) {
        displayWeatherAlert(alerts[0]); // Show the most severe alert
    } else {
        hideWeatherAlert();
    }
}

function displayWeatherAlert(alert) {
    const alertElement = document.getElementById('weather-alerts');
    const titleElement = document.getElementById('alert-title');
    const descElement = document.getElementById('alert-description');

    if (alertElement && titleElement && descElement) {
        titleElement.textContent = alert.title;
        descElement.textContent = alert.description;
        alertElement.style.display = 'block';

        // Auto-hide after 10 seconds
        setTimeout(() => {
            hideWeatherAlert();
        }, 10000);
    }
}

function hideWeatherAlert() {
    const alertElement = document.getElementById('weather-alerts');
    if (alertElement) {
        alertElement.style.display = 'none';
    }
}

function closeAlert() {
    hideWeatherAlert();
}

// Weather Tips & Recommendations System
function generateWeatherTips(data) {
    const tips = [];
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherMain = data.weather[0].main.toLowerCase();
    const weatherDesc = data.weather[0].description.toLowerCase();

    // Temperature-based tips
    if (temp >= 30) {
        tips.push({ icon: "fas fa-sun", text: "Stay hydrated and wear light clothing" });
        tips.push({ icon: "fas fa-hat-cowboy", text: "Wear sunscreen and a hat for sun protection" });
    } else if (temp >= 20) {
        tips.push({ icon: "fas fa-cloud-sun", text: "Perfect weather for outdoor activities" });
        tips.push({ icon: "fas fa-tshirt", text: "Light clothing is ideal today" });
    } else if (temp >= 10) {
        tips.push({ icon: "fas fa-cloud", text: "Mild weather - great for walking" });
        tips.push({ icon: "fas fa-jacket", text: "Light jacket recommended" });
    } else if (temp < 10) {
        tips.push({ icon: "fas fa-snowflake", text: "Cold weather - bundle up warmly" });
        tips.push({ icon: "fas fa-mitten", text: "Wear gloves and warm accessories" });
    }

    // Weather condition tips
    if (weatherMain === "rain") {
        tips.push({ icon: "fas fa-umbrella", text: "Don't forget your umbrella" });
        tips.push({ icon: "fas fa-car", text: "Drive carefully - wet roads ahead" });
    } else if (weatherMain === "snow") {
        tips.push({ icon: "fas fa-snowflake", text: "Snowy conditions - drive slowly" });
        tips.push({ icon: "fas fa-boot", text: "Wear waterproof boots" });
    } else if (weatherMain === "thunderstorm") {
        tips.push({ icon: "fas fa-bolt", text: "Stay indoors during thunderstorms" });
        tips.push({ icon: "fas fa-plug", text: "Unplug electronics to prevent damage" });
    } else if (windSpeed >= 15) {
        tips.push({ icon: "fas fa-wind", text: "Strong winds - secure loose objects" });
        tips.push({ icon: "fas fa-hand-paper", text: "Be careful when walking against the wind" });
    }

    // Humidity tips
    if (humidity >= 80) {
        tips.push({ icon: "fas fa-tint", text: "High humidity - you may feel warmer" });
    } else if (humidity <= 30) {
        tips.push({ icon: "fas fa-tint-slash", text: "Low humidity - stay hydrated" });
    }

    return tips.slice(0, 3); // Return top 3 tips
}

function generateRecommendations(data) {
    const recommendations = [];
    const temp = data.main.temp;
    const weatherMain = data.weather[0].main.toLowerCase();
    const currentHour = new Date().getHours();

    // Time-based recommendations
    if (currentHour >= 6 && currentHour <= 10) {
        recommendations.push({ icon: "fas fa-coffee", text: "Start your day with a warm breakfast" });
    } else if (currentHour >= 11 && currentHour <= 14) {
        recommendations.push({ icon: "fas fa-utensils", text: "Enjoy lunch outdoors if weather permits" });
    } else if (currentHour >= 17 && currentHour <= 21) {
        recommendations.push({ icon: "fas fa-sun", text: "Perfect time for evening activities" });
    }

    // Temperature-based recommendations
    if (temp >= 25 && weatherMain === "clear") {
        recommendations.push({ icon: "fas fa-swimming-pool", text: "Visit a pool or beach" });
        recommendations.push({ icon: "fas fa-bicycle", text: "Go for a bike ride" });
        recommendations.push({ icon: "fas fa-ice-cream", text: "Try some ice cream" });
    } else if (temp >= 15 && temp < 25) {
        recommendations.push({ icon: "fas fa-walking", text: "Take a relaxing walk in the park" });
        recommendations.push({ icon: "fas fa-camera", text: "Go for a photography session" });
        recommendations.push({ icon: "fas fa-book", text: "Read a book outdoors" });
    } else if (temp >= 5 && temp < 15) {
        recommendations.push({ icon: "fas fa-mug-hot", text: "Enjoy a hot beverage" });
        recommendations.push({ icon: "fas fa-film", text: "Watch a movie indoors" });
        recommendations.push({ icon: "fas fa-puzzle-piece", text: "Try indoor hobbies" });
    } else if (temp < 5) {
        recommendations.push({ icon: "fas fa-fire", text: "Stay warm by the fireplace" });
        recommendations.push({ icon: "fas fa-cookie-bite", text: "Bake some cookies" });
        recommendations.push({ icon: "fas fa-gamepad", text: "Play indoor games" });
    }

    // Weather-specific recommendations
    if (weatherMain === "rain") {
        recommendations.push({ icon: "fas fa-music", text: "Listen to music and relax" });
        recommendations.push({ icon: "fas fa-book-open", text: "Perfect day for reading" });
    } else if (weatherMain === "snow") {
        recommendations.push({ icon: "fas fa-snowman", text: "Build a snowman" });
        recommendations.push({ icon: "fas fa-hot-chocolate", text: "Make hot chocolate" });
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
}

function displayWeatherTips(tips) {
    const tipsContainer = document.getElementById('weather-tips');
    if (tipsContainer && tips.length > 0) {
        const tipsHTML = tips.map(tip =>
            `<div class="tip-item">
                <i class="${tip.icon}"></i>
                <span>${tip.text}</span>
            </div>`
        ).join('');
        tipsContainer.innerHTML = tipsHTML;
    }
}

function displayRecommendations(recommendations) {
    const recContainer = document.getElementById('weather-recommendations');
    if (recContainer && recommendations.length > 0) {
        const recHTML = recommendations.map(rec =>
            `<div class="recommendation-item">
                <i class="${rec.icon}"></i>
                <span>${rec.text}</span>
            </div>`
        ).join('');
        recContainer.innerHTML = recHTML;
    }
}

function updateWeatherUI(data) {
    // Validate weather data before updating UI
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        console.error('Invalid weather data received:', data);
        return;
    }

    document.getElementById("city-name").innerHTML = data.name || 'Unknown Location';
    document.getElementById("metric").innerHTML = Math.floor(data.main.temp) + "°";
    document.querySelectorAll("#weather-main").forEach(el => el.innerHTML = data.weather[0].description);

    // Safely update humidity with fallback
    const humidityElement = document.getElementById("humidity");
    if (humidityElement) {
        humidityElement.innerHTML = data.main.humidity ? Math.floor(data.main.humidity) : 'N/A';
    }

    // Safely update feels-like with fallback
    const feelsLikeElement = document.getElementById("feels-like");
    if (feelsLikeElement) {
        feelsLikeElement.innerHTML = data.main.feels_like ? Math.floor(data.main.feels_like) : 'N/A';
    }

    // Safely update wind speed with fallback
    const windSpeedElement = document.getElementById("wind-speed");
    if (windSpeedElement) {
        windSpeedElement.innerHTML = data.wind && data.wind.speed ? Math.floor(data.wind.speed) : 'N/A';
    }

    // Safely update temperature ranges with fallbacks
    const tempMinElement = document.getElementById("temp-min-today");
    if (tempMinElement) {
        tempMinElement.innerHTML = data.main.temp_min ? Math.floor(data.main.temp_min) + "°" : 'N/A';
    }

    const tempMaxElement = document.getElementById("temp-max-today");
    if (tempMaxElement) {
        tempMaxElement.innerHTML = data.main.temp_max ? Math.floor(data.main.temp_max) + "°" : 'N/A';
    }

    // Update additional weather features with validation
    if (data.wind && data.wind.deg !== undefined) {
        const windDirection = getWindDirection(data.wind.deg);
        // Wind direction no longer displayed in UI
    }

    if (data.visibility !== undefined) {
        // Visibility no longer displayed in UI
    }

    if (data.main.pressure !== undefined) {
        // Pressure no longer displayed in UI
    }

    // Calculate UV index based on time and weather with validation
    const uvIndex = calculateUVIndex(data);
    // UV index no longer displayed in UI

    // Generate and display tips and recommendations
    const tips = generateWeatherTips(data);
    const recommendations = generateRecommendations(data);
    displayWeatherTips(tips);
    displayRecommendations(recommendations);
    let weatherImg = document.querySelector(".weather-icon");
    let weatherImgs = document.querySelector(".weather-icons");
    let weatherIconContainer = document.querySelector(".weather-icon-css");
    let weatherCondition = data.weather[0].main.toLowerCase();
    let imgSrc = "img/sun.png";
    let animClass = "weather-animated sun";
    if (weatherCondition === "rain") { imgSrc = "img/rain.png"; animClass = "weather-animated rain"; }
    else if (weatherCondition === "clear" || weatherCondition === "clear sky") { imgSrc = "img/sun.png"; animClass = "weather-animated sun"; }
    else if (weatherCondition === "snow") { imgSrc = "img/snow.png"; animClass = "weather-animated snow"; }
    else if (weatherCondition === "clouds" || weatherCondition === "smoke") { imgSrc = "img/cloud.png"; animClass = "weather-animated cloud"; }
    else if (weatherCondition === "mist" || weatherCondition === "fog") { imgSrc = "img/mist.png"; animClass = "weather-animated mist"; }
    else if (weatherCondition === "haze") { imgSrc = "img/haze.png"; animClass = "weather-animated haze"; }
    else if (weatherCondition === "thunderstorm") { imgSrc = "img/thunderstorm.png"; animClass = "weather-animated thunderstorm"; }
    
    // Handle rotation animation for weather icon container
    if (weatherIconContainer) {
        if (weatherCondition === "clouds" || weatherCondition === "smoke") {
            weatherIconContainer.classList.add("cloud-weather");
        } else {
            weatherIconContainer.classList.remove("cloud-weather");
        }
    }
    
    if (weatherImg) { weatherImg.src = imgSrc; weatherImg.className = `weather-icon ${animClass}`; }
    if (weatherImgs) { weatherImgs.src = imgSrc; weatherImgs.className = `weather-icons ${animClass}`; }

    // Control background effects
    const starsElement = document.querySelector('.stars');
    const rainDropsElement = document.querySelector('.rain-drops');
    const currentHour = new Date().getHours();

    // Show stars at night (8 PM to 6 AM)
    if (starsElement) {
        if (currentHour >= 20 || currentHour <= 6) {
            starsElement.classList.add('night');
        } else {
            starsElement.classList.remove('night');
        }
    }

    // Show rain drops when raining
    if (rainDropsElement) {
        if (weatherCondition === "rain" || weatherCondition === "thunderstorm") {
            rainDropsElement.classList.add('raining');
        } else {
            rainDropsElement.classList.remove('raining');
        }
    }
}

function updateForecastUI(forecastData, currentWeatherData) {
    const dailyForecasts = {};

    // Process forecast data for the next 6 days (starting from tomorrow)
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
    let forecastbox = "";
    // Sort dates and limit to 6 days (starting from tomorrow)
    const sortedDates = Object.keys(dailyForecasts).sort().slice(0, 6);

    for (const date of sortedDates) {
        let imgSrc = "img/sun.png";
        let animClass = "weather-animated sun";
        switch (dailyForecasts[date].weatherImg) {
            case "rain": imgSrc = "img/rain.png"; animClass = "weather-animated rain"; break;
            case "clear": case "clear sky": imgSrc = "img/sun.png"; animClass = "weather-animated sun"; break;
            case "snow": imgSrc = "img/snow.png"; animClass = "weather-animated snow"; break;
            case "clouds": case "smoke": imgSrc = "img/cloud.png"; animClass = "weather-animated cloud"; break;
            case "mist": imgSrc = "img/mist.png"; animClass = "weather-animated mist"; break;
            case "haze": imgSrc = "img/haze.png"; animClass = "weather-animated haze"; break;
            case "thunderstorm": imgSrc = "img/thunderstorm.png"; animClass = "weather-animated thunderstorm"; break;
        }
        forecastbox += `
        <div class="weather-forecast-box">
            <div class="day-weather"><span>${dailyForecasts[date].day_today}</span></div>
            <div class="weather-icon-forecast"><img class="${animClass}" src="${imgSrc}" /></div>
            <div class="temp-weather"><span>${dailyForecasts[date].temperature}</span></div>
            <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
        </div>`;
    }
    let forecast = document.getElementById('future-forecast-box');
    if (forecast) forecast.innerHTML = forecastbox;
}

// Function to update background effects based on time
function updateBackgroundEffects() {
    const starsElement = document.querySelector('.stars');
    const currentHour = new Date().getHours();

    if (starsElement) {
        if (currentHour >= 20 || currentHour <= 6) {
            starsElement.classList.add('night');
        } else {
            starsElement.classList.remove('night');
        }
    }
}

// Update background effects every minute to handle time changes
setInterval(updateBackgroundEffects, 60000);
updateBackgroundEffects(); // Initial call

// Helper function to get wind direction from degrees
function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

// Helper function to calculate UV index
function calculateUVIndex(data) {
    const currentHour = new Date().getHours();
    const weatherMain = data.weather[0].main.toLowerCase();
    
    // UV index is typically highest around noon and lower in cloudy conditions
    let baseUV = 0;
    
    if (currentHour >= 10 && currentHour <= 14) {
        baseUV = 6; // Peak UV hours
    } else if ((currentHour >= 8 && currentHour < 10) || (currentHour > 14 && currentHour <= 16)) {
        baseUV = 4; // Moderate UV hours
    } else {
        baseUV = 1; // Low UV hours
    }
    
    // Reduce UV index for cloudy conditions
    if (weatherMain.includes('cloud') || weatherMain === 'mist' || weatherMain === 'fog') {
        baseUV = Math.max(1, Math.floor(baseUV * 0.6));
    }
    
    // Convert to UV index category
    if (baseUV <= 2) return 'Low';
    if (baseUV <= 5) return 'Moderate';
    if (baseUV <= 7) return 'High';
    if (baseUV <= 10) return 'Very High';
    return 'Extreme';
}

function fetchWeatherByLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            updateWeatherUI(data);
            checkSevereWeather(data); // Check for severe weather conditions
            // Fetch forecast using 5-day forecast API
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
                .then(res => res.json())
                .then(forecastData => updateForecastUI(forecastData, data));
        });
}

// Reset location functionality
document.getElementById('reset-location-btn')?.addEventListener('click', function() {
    localStorage.removeItem('askedLocation');
    localStorage.removeItem('lastLat');
    localStorage.removeItem('lastLon');
    location.reload(); // Reload page to ask for location again
});

// Ask for location only once per user
if (navigator.geolocation) {
    const askedLocation = localStorage.getItem('askedLocation');
    const lastLat = localStorage.getItem('lastLat');
    const lastLon = localStorage.getItem('lastLon');
    if (!askedLocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByLocation(lat, lon);
            localStorage.setItem('askedLocation', 'granted');
            localStorage.setItem('lastLat', lat);
            localStorage.setItem('lastLon', lon);
        }, function (err) {
            console.log("Location permission denied, using Mumbai as default");
            // Fallback to Mumbai weather if location is denied
            fetchWeatherByLocation(19.0760, 72.8777);
            localStorage.setItem('askedLocation', 'denied');
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
    } else if (askedLocation === 'granted' && lastLat && lastLon) {
        fetchWeatherByLocation(lastLat, lastLon);
    } else if (askedLocation === 'denied') {
        // User previously denied location, use Mumbai as default
        console.log("Using Mumbai as default location");
        fetchWeatherByLocation(19.0760, 72.8777);
    }
}

// Weather Map System with Leaflet
class WeatherMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.currentView = 'temperature';
        this.regions = [];
        this.initializeMap();
        this.setupMapControls();
    }

    initializeMap() {
        const mapContainer = document.querySelector('.weather-map');
        if (!mapContainer) return;

        // Initialize Leaflet map centered on India
        this.map = L.map(mapContainer).setView([20.5937, 78.9629], 5);

        // Add OpenStreetMap tiles
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(this.map);

        // Define major cities/regions for weather map
        this.regions = [
            { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'MH' },
            { id: 'delhi', name: 'Delhi', lat: 28.7041, lng: 77.1025, state: 'DL' },
            { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'KA' },
            { id: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'TN' },
            { id: 'kolkata', name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'WB' },
            { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'TS' },
            { id: 'pune', name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'MH' },
            { id: 'ahmedabad', name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'GJ' },
            { id: 'jaipur', name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'RJ' },
            { id: 'surat', name: 'Surat', lat: 21.1702, lng: 72.8311, state: 'GJ' },
            { id: 'lucknow', name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'UP' },
            { id: 'kanpur', name: 'Kanpur', lat: 26.4499, lng: 80.3319, state: 'UP' },
            { id: 'nagpur', name: 'Nagpur', lat: 21.1458, lng: 79.0882, state: 'MH' },
            { id: 'indore', name: 'Indore', lat: 22.7196, lng: 75.8577, state: 'MP' },
            { id: 'thane', name: 'Thane', lat: 19.2183, lng: 72.9781, state: 'MH' },
            { id: 'bhopal', name: 'Bhopal', lat: 23.2599, lng: 77.4126, state: 'MP' },
            { id: 'visakhapatnam', name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, state: 'AP' },
            { id: 'pimpri-chinchwad', name: 'Pimpri', lat: 18.6298, lng: 73.7997, state: 'MH' },
            { id: 'patna', name: 'Patna', lat: 25.5941, lng: 85.1376, state: 'BR' },
            { id: 'vadodara', name: 'Vadodara', lat: 22.3072, lng: 73.1812, state: 'GJ' },
            { id: 'ghaziabad', name: 'Ghaziabad', lat: 28.6692, lng: 77.4538, state: 'UP' },
            { id: 'ludhiana', name: 'Ludhiana', lat: 30.9010, lng: 75.8573, state: 'PB' }
        ];

        this.updateWeatherData();
    }

    async updateWeatherData() {
        for (const region of this.regions) {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${region.lat}&lon=${region.lng}&units=metric&appid=${apiKey}`
                );
                const data = await response.json();
                region.weather = data.weather[0];
                region.temperature = Math.floor(data.main.temp);
                region.humidity = data.main.humidity;
                region.windSpeed = data.wind.speed;
            } catch (error) {
                console.error(`Error fetching weather for ${region.name}:`, error);
                region.weather = { main: 'Clear', description: 'Clear sky' };
                region.temperature = 20;
                region.humidity = 50;
                region.windSpeed = 5;
            }
        }
        this.renderWeatherMarkers();
    }

    renderWeatherMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        this.regions.forEach(region => {
            const marker = this.createWeatherMarker(region);
            this.markers.push(marker);
        });
    }

    createWeatherMarker(region) {
        // Choose icon based on weather
        let iconUrl = 'img/sun.png'; // Default
        if (region.weather) {
            const condition = region.weather.main.toLowerCase();
            if (condition.includes('cloud')) iconUrl = 'img/cloud.png';
            else if (condition.includes('rain')) iconUrl = 'img/rain.png';
            else if (condition.includes('snow')) iconUrl = 'img/snow.png';
            else if (condition.includes('thunder') || condition.includes('storm')) iconUrl = 'img/thunderstorm.png';
            else if (condition.includes('mist') || condition.includes('haze')) iconUrl = 'img/mist.png';
            else if (condition.includes('wind')) iconUrl = 'img/wind.png';
        }

        // Create custom icon
        const weatherIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });

        const marker = L.marker([region.lat, region.lng], { icon: weatherIcon }).addTo(this.map);

        // Add popup with weather info
        const popupContent = this.createPopupContent(region);
        marker.bindPopup(popupContent);

        return marker;
    }

    createPopupContent(region) {
        const temp = region.temperature || 'N/A';
        const condition = region.weather?.description || 'Unknown';
        const humidity = region.humidity || 'N/A';
        const wind = region.windSpeed || 'N/A';

        return `
            <div style="font-family: Inter, sans-serif; max-width: 200px; font-size: 14px;">
                <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">${region.name}, ${region.state}</h3>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 18px; font-weight: 600; color: #0f172a;">${temp}°C</span>
                    <span style="margin-left: 8px; color: #64748b;">${condition}</span>
                </div>
                <div style="color: #64748b;">
                    <div>Humidity: ${humidity}%</div>
                    <div>Wind: ${wind} m/s</div>
                </div>
            </div>
        `;
    }

    setView(viewType) {
        this.currentView = viewType;

        // Update active button
        document.querySelectorAll('.map-control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.map-control-btn[data-view="${viewType}"]`)?.classList.add('active');

        // Update marker styles based on view type
        this.updateMarkerStyles();
    }

    updateMarkerStyles() {
        this.markers.forEach((marker, index) => {
            const region = this.regions[index];
            let iconUrl = 'img/sun.png';
            let opacity = 1;

            switch (this.currentView) {
                case 'temperature':
                    if (region.temperature >= 25) iconUrl = 'img/sun.png';
                    else if (region.temperature >= 15) iconUrl = 'img/cloud.png';
                    else if (region.temperature >= 5) iconUrl = 'img/rain.png';
                    else iconUrl = 'img/snow.png';
                    break;
                case 'precipitation':
                    iconUrl = region.weather?.main.toLowerCase().includes('rain') ? 'img/rain.png' : 'img/sun.png';
                    break;
                case 'wind':
                    iconUrl = region.windSpeed >= 10 ? 'img/wind.png' : 'img/cloud.png';
                    break;
            }

            // Update marker icon
            const weatherIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16]
            });

            marker.setIcon(weatherIcon);
        });
    }

    setupMapControls() {
        const tempBtn = document.querySelector('.map-control-btn[data-view="temperature"]');
        const precipBtn = document.querySelector('.map-control-btn[data-view="precipitation"]');
        const windBtn = document.querySelector('.map-control-btn[data-view="wind"]');

        if (tempBtn) {
            tempBtn.addEventListener('click', () => this.setView('temperature'));
        }
        if (precipBtn) {
            precipBtn.addEventListener('click', () => this.setView('precipitation'));
        }
        if (windBtn) {
            windBtn.addEventListener('click', () => this.setView('wind'));
        }

        // Setup location search
        this.setupLocationSearch();
    }

    setupLocationSearch() {
        const searchInput = document.getElementById('location-search');
        if (!searchInput) return;

        let searchTimeout;
        let lastSearchQuery = '';
        let currentSearchController = null;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            // Clear previous results if query is too short
            if (query.length < 2) {
                this.removeSearchResults();
                this.removeSearchError();
                return;
            }

            // Prevent duplicate searches
            if (query === lastSearchQuery) return;
            lastSearchQuery = query;

            // Validate input - only allow letters, numbers, spaces, and common punctuation
            if (!this.isValidSearchQuery(query)) {
                this.showSearchError('Please use only letters, numbers, spaces, and basic punctuation.');
                return;
            }

            // Cancel previous search if still running
            if (currentSearchController) {
                currentSearchController.abort();
            }
            currentSearchController = new AbortController();

            searchTimeout = setTimeout(() => {
                this.searchLocation(query, currentSearchController.signal);
            }, 300); // Reduced debounce for better responsiveness
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query.length >= 2 && this.isValidSearchQuery(query)) {
                    clearTimeout(searchTimeout);
                    // Cancel previous search
                    if (currentSearchController) {
                        currentSearchController.abort();
                    }
                    currentSearchController = new AbortController();
                    this.searchLocation(query, currentSearchController.signal);
                }
            }
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                this.removeSearchResults();
                this.removeSearchError();
                searchInput.blur();
            }
        });
    }

    isValidSearchQuery(query) {
        // Allow letters, numbers, spaces, hyphens, apostrophes, commas, and periods
        const validPattern = /^[a-zA-Z0-9\s\-',.]+$/;
        return validPattern.test(query) && query.length <= 100; // Reasonable length limit
    }

    async searchLocation(query, signal) {
        try {
            // Enhanced geocoding with more specific parameters for better accuracy
            const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${apiKey}`;

            const response = await fetch(geocodingUrl, {
                signal,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
                } else if (response.status === 429) {
                    throw new Error('Too many requests. Please wait a moment and try again.');
                } else {
                    throw new Error(`Search failed: ${response.status}`);
                }
            }

            const results = await response.json();

            if (results.length === 0) {
                this.showSearchError(`No locations found for "${query}". Try a different spelling or more specific location.`);
                return;
            }

            // Filter and rank results for better accuracy
            const filteredResults = this.filterAndRankResults(results, query);

            if (filteredResults.length === 0) {
                this.showSearchError(`No accurate matches found for "${query}". Please try a more specific location.`);
                return;
            }

            // If only one accurate result, go directly to it
            if (filteredResults.length === 1) {
                this.selectLocation(filteredResults[0]);
            } else {
                // Show multiple results for user to choose
                this.showSearchResults(filteredResults);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                // Search was cancelled, ignore
                return;
            }
            console.error('Search error:', error);
            this.showSearchError(error.message || 'Search failed. Please check your internet connection and try again.');
        }
    }

    filterAndRankResults(results, originalQuery) {
        const query = originalQuery.toLowerCase().trim();

        // Filter out results with missing critical data
        let filtered = results.filter(result =>
            result.lat && result.lon &&
            result.name &&
            result.country &&
            Math.abs(result.lat) <= 90 &&
            Math.abs(result.lon) <= 180
        );

        if (filtered.length === 0) return [];

        // Rank results by relevance
        filtered = filtered.map(result => {
            let score = 0;
            const name = result.name.toLowerCase();
            const state = result.state ? result.state.toLowerCase() : '';
            const country = result.country.toLowerCase();

            // Exact name match gets highest score
            if (name === query) score += 100;

            // Starts with query gets high score
            if (name.startsWith(query)) score += 50;

            // Contains query gets medium score
            if (name.includes(query)) score += 25;

            // State/country matches add points
            if (state.includes(query)) score += 15;
            if (country.includes(query)) score += 10;

            // Prefer major cities and countries
            if (this.isMajorLocation(result)) score += 20;

            // Prefer locations with state information (more specific)
            if (result.state) score += 5;

            result.relevanceScore = score;
            return result;
        });

        // Sort by relevance score and limit to top 5
        return filtered
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 5);
    }

    isMajorLocation(result) {
        // Consider major cities and countries as more reliable
        const majorCountries = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'JP', 'CN', 'IN', 'BR', 'MX', 'RU'];
        const majorCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Rome', 'Madrid', 'Toronto', 'Moscow'];

        return majorCountries.includes(result.country) ||
               majorCities.some(city => result.name.toLowerCase().includes(city.toLowerCase()));
    }

    showSearchResults(results) {
        // Remove existing search results
        this.removeSearchResults();

        const searchInput = document.getElementById('location-search');
        const searchBar = searchInput.parentElement;

        // Create results dropdown
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results-dropdown';
        resultsDiv.innerHTML = results.map((result, index) => `
            <div class="search-result-item" data-index="${index}" data-accuracy="${this.getAccuracyLevel(result)}">
                <i class="fas fa-map-marker-alt"></i>
                <div class="result-info">
                    <div class="result-name">${result.name}</div>
                    <div class="result-country">${result.state ? `${result.state}, ` : ''}${result.country}</div>
                    <div class="result-coords">${result.lat.toFixed(4)}, ${result.lon.toFixed(4)}</div>
                </div>
                <div class="accuracy-indicator">
                    <i class="fas fa-crosshairs" title="High accuracy"></i>
                </div>
            </div>
        `).join('');

        searchBar.appendChild(resultsDiv);

        // Add click handlers for results
        resultsDiv.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.selectLocation(results[index]);
                this.removeSearchResults();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBar.contains(e.target)) {
                this.removeSearchResults();
            }
        });
    }

    getAccuracyLevel(result) {
        // Determine accuracy level based on available data
        if (result.state && result.country) return 'high';
        if (result.country) return 'medium';
        return 'low';
    }

    selectLocation(location) {
        const { lat, lon, name, country, state } = location;

        // Validate coordinates
        if (!this.isValidCoordinates(lat, lon)) {
            this.showSearchError('Invalid location coordinates. Please try a different search.');
            return;
        }

        // Center map on location with appropriate zoom level
        const zoomLevel = this.getAppropriateZoomLevel(location);
        this.map.setView([lat, lon], zoomLevel);

        // Fetch weather for this location
        this.fetchLocationWeather(lat, lon, name, country, state);

        // Clear search input
        const searchInput = document.getElementById('location-search');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    isValidCoordinates(lat, lon) {
        return typeof lat === 'number' && typeof lon === 'number' &&
               lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180 &&
               !isNaN(lat) && !isNaN(lon);
    }

    getAppropriateZoomLevel(location) {
        // Return appropriate zoom level based on location type
        if (location.state) return 10; // City level
        if (location.country) return 7; // Country level
        return 5; // Continent level
    }

    async fetchLocationWeather(lat, lon, name, country, state) {
        try {
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            const response = await fetch(weatherUrl);

            if (!response.ok) {
                throw new Error(`Weather data unavailable: ${response.status}`);
            }

            const data = await response.json();

            // Validate weather data completeness
            if (!this.isValidWeatherData(data)) {
                throw new Error('Incomplete weather data received. Please try again.');
            }

            // Add a marker for the searched location
            this.addSearchedLocationMarker(lat, lon, data, name, country, state);
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showSearchError(error.message || 'Failed to load weather data for this location.');
        }
    }

    isValidWeatherData(data) {
        return data &&
               data.main &&
               typeof data.main.temp === 'number' &&
               data.weather &&
               data.weather.length > 0 &&
               data.weather[0].description &&
               data.name;
    }

    addSearchedLocationMarker(lat, lon, data, name, country, state) {
        // Remove existing searched location marker
        if (this.searchedLocationMarker) {
            this.map.removeLayer(this.searchedLocationMarker);
        }

        // Choose icon based on weather
        let iconUrl = 'img/sun.png';
        if (data.weather && data.weather[0]) {
            const condition = data.weather[0].main.toLowerCase();
            if (condition.includes('cloud')) iconUrl = 'img/cloud.png';
            else if (condition.includes('rain')) iconUrl = 'img/rain.png';
            else if (condition.includes('snow')) iconUrl = 'img/snow.png';
            else if (condition.includes('thunder') || condition.includes('storm')) iconUrl = 'img/thunderstorm.png';
            else if (condition.includes('mist') || condition.includes('haze')) iconUrl = 'img/mist.png';
            else if (condition.includes('wind')) iconUrl = 'img/wind.png';
        }

        // Create custom icon
        const weatherIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [40, 40], // Slightly larger for searched location
            iconAnchor: [20, 20],
            popupAnchor: [0, -20]
        });

        // Create marker
        this.searchedLocationMarker = L.marker([lat, lon], { icon: weatherIcon }).addTo(this.map);

        // Create popup content
        const temp = Math.floor(data.main.temp);
        const condition = data.weather[0].description;
        const humidity = data.main.humidity || 'N/A';
        const wind = data.wind ? Math.floor(data.wind.speed) : 'N/A';
        const feelsLike = data.main.feels_like ? Math.floor(data.main.feels_like) : 'N/A';

        const popupContent = `
            <div style="font-family: Inter, sans-serif; max-width: 220px; font-size: 14px;">
                <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">${name}</h3>
                <div style="margin-bottom: 4px; color: #64748b; font-size: 12px;">${state ? `${state}, ` : ''}${country}</div>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 18px; font-weight: 600; color: #0f172a;">${temp}°C</span>
                    <span style="margin-left: 8px; color: #64748b;">${condition}</span>
                </div>
                <div style="color: #64748b; font-size: 12px;">
                    <div>Feels like: ${feelsLike}°C</div>
                    <div>Humidity: ${humidity}%</div>
                    <div>Wind: ${wind} m/s</div>
                </div>
                <div style="margin-top: 8px; font-size: 11px; color: #94a3b8;">
                    Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}
                </div>
            </div>
        `;

        this.searchedLocationMarker.bindPopup(popupContent).openPopup();
    }

    showSearchError(message) {
        // Remove existing error
        this.removeSearchError();

        const searchInput = document.getElementById('location-search');
        const searchBar = searchInput.parentElement;

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'search-error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;

        searchBar.appendChild(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeSearchError();
        }, 5000);
    }

    removeSearchResults() {
        const dropdown = document.querySelector('.search-results-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }

    removeSearchError() {
        const error = document.querySelector('.search-error-message');
        if (error) {
            error.remove();
        }
    }

    // Removed old map navigation elements for Google Maps

    // Removed getWeatherClass for Google Maps

    // Old updateWeatherData removed - using new Google Maps version

    // Removed tooltip methods for Google Maps

    // Removed selectRegion and map interactions for Google Maps

    // Removed drag and zoom methods for Google Maps

    // Removed old setView and updateMapVisualization for Google Maps

    // Removed old setupMapControls with keyboard shortcuts for Google Maps

    // Removed old zoom controls and methods for Google Maps
}

// Initialize weather map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new WeatherMap();
});
