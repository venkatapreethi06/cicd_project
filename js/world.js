// Live date, day, and time updater
function updateLiveDate() {
    const dateElem = document.querySelector('.date');
    if (!dateElem) return;
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    const time = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    dateElem.textContent = `${day}, ${month} ${date}, ${year} | ${time}`;
}

setInterval(updateLiveDate, 1000);
updateLiveDate();
let apiKey = "1e3e8f230b6064d27976e41163a82b77";
const searchInput = document.querySelector('.searchinput');
let autocompleteBox = null;

// Create autocomplete box
function createAutocompleteBox() {
    autocompleteBox = document.createElement('div');
    autocompleteBox.className = 'autocomplete-box';
    autocompleteBox.style.position = 'absolute';
    autocompleteBox.style.background = 'var(--card-bg)';
    autocompleteBox.style.border = '1px solid #3b82f6';
    autocompleteBox.style.borderRadius = '12px';
    autocompleteBox.style.zIndex = 1000;
    autocompleteBox.style.width = searchInput.offsetWidth + 'px';
    autocompleteBox.style.maxHeight = '150px';
    autocompleteBox.style.overflowY = 'auto';
    autocompleteBox.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
    autocompleteBox.style.display = 'none';
    searchInput.parentNode.appendChild(autocompleteBox);
}

createAutocompleteBox();

// Fetch city suggestions from OpenWeatherMap
async function fetchCitySuggestions(query) {
    if (!query) return [];
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(item => `${item.name}${item.state ? ', ' + item.state : ''}, ${item.country}`);
}

searchInput.addEventListener('input', async function () {
    const value = searchInput.value.trim();
    if (!value) {
        autocompleteBox.style.display = 'none';
        return;
    }
    const suggestions = await fetchCitySuggestions(value);
    if (suggestions.length === 0) {
        autocompleteBox.style.display = 'none';
        return;
    }
    autocompleteBox.innerHTML = '';
    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.textContent = suggestion;
        div.style.padding = '10px 12px';
        div.style.cursor = 'pointer';
        div.style.color = 'var(--font-color-main)';
        div.style.borderBottom = '1px solid rgba(59, 130, 246, 0.2)';
        div.style.transition = 'background 0.2s ease';
        div.addEventListener('mousedown', function () {
            searchInput.value = suggestion;
            autocompleteBox.style.display = 'none';
        });
        div.addEventListener('mouseenter', function () {
            div.style.background = 'rgba(59, 130, 246, 0.1)';
        });
        div.addEventListener('mouseleave', function () {
            div.style.background = 'transparent';
        });
        autocompleteBox.appendChild(div);
    });
    const rect = searchInput.getBoundingClientRect();
    autocompleteBox.style.top = (searchInput.offsetTop + searchInput.offsetHeight) + 'px';
    autocompleteBox.style.left = searchInput.offsetLeft + 'px';
    autocompleteBox.style.display = 'block';
});

document.addEventListener('click', function (e) {
    if (autocompleteBox && !autocompleteBox.contains(e.target) && e.target !== searchInput) {
        autocompleteBox.style.display = 'none';
    }
});
const cityBox = document.querySelector('.city-box');
const errorMessage = document.querySelector('.error-message');
const normalMessage = document.querySelector('.normal-message');
const addedMessage = document.querySelector('.added-message');
const addSection = document.querySelector('.add-section');
const addButton = document.querySelector('.button');
const btnIcon = document.querySelector('.btn-icon');
let modalTimeout = null;
let modalOpenTime = 0;

// Toggle add section
addButton.addEventListener('click', () => {
    if (addSection.classList.contains('open')) {
        // Check if modal has been open for at least 5 seconds
        const timeElapsed = Date.now() - modalOpenTime;
        if (timeElapsed >= 5000) {
            closeModal();
        } else {
            // Show message that modal needs to stay open longer
            showTemporaryMessage('Please wait 5 seconds before closing', 2000);
        }
    } else {
        openModal();
    }
});

function openModal() {
    addSection.classList.add('open');
    btnIcon.className = 'fa-solid fa-circle-xmark btn-icon';
    document.body.classList.add('modal-open');
    modalOpenTime = Date.now();

    // Start countdown display
    startCountdown();

    // Auto-close after 5 seconds if no interaction
    modalTimeout = setTimeout(() => {
        if (addSection.classList.contains('open')) {
            closeModal();
        }
    }, 5000);
}

function closeModal() {
    addSection.classList.remove('open');
    btnIcon.className = 'fa-solid fa-circle-plus btn-icon';
    document.body.classList.remove('modal-open');
    if (modalTimeout) {
        clearTimeout(modalTimeout);
        modalTimeout = null;
    }
    // Remove countdown
    removeCountdown();
}

function startCountdown() {
    // Remove any existing countdown
    removeCountdown();

    // Create countdown container
    const countdown = document.createElement('div');
    countdown.className = 'countdown-timer';
    countdown.innerHTML = `
        <div class="countdown-text">Auto-close in <span class="countdown-number">5</span>s</div>
        <div class="countdown-bar">
            <div class="countdown-progress"></div>
        </div>
    `;

    countdown.style.cssText = `
        position: absolute;
        top: 10px;
        right: 20px;
        background: rgba(59, 130, 246, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        z-index: 1001;
        backdrop-filter: blur(5px);
    `;

    addSection.appendChild(countdown);

    // Animate countdown
    let timeLeft = 5;
    const countdownNumber = countdown.querySelector('.countdown-number');
    const countdownProgress = countdown.querySelector('.countdown-progress');

    countdownProgress.style.cssText = `
        height: 3px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 2px;
        width: 100%;
        transition: width 1s linear;
    `;

    const interval = setInterval(() => {
        timeLeft--;
        countdownNumber.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(interval);
            removeCountdown();
        }
    }, 1000);

    // Store interval for cleanup
    countdown.dataset.intervalId = interval;
}

function removeCountdown() {
    const countdown = document.querySelector('.countdown-timer');
    if (countdown) {
        const intervalId = countdown.dataset.intervalId;
        if (intervalId) {
            clearInterval(intervalId);
        }
        countdown.remove();
    }
}

function showTemporaryMessage(message, duration = 2000) {
    // Remove any existing temporary message
    const existingMsg = document.querySelector('.temp-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    // Create and show temporary message
    const tempMsg = document.createElement('div');
    tempMsg.className = 'temp-message';
    tempMsg.textContent = message;
    tempMsg.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1001;
        pointer-events: none;
    `;

    addSection.appendChild(tempMsg);

    // Remove after duration
    setTimeout(() => {
        if (tempMsg.parentNode) {
            tempMsg.remove();
        }
    }, duration);
}


// Add input event listener to reset timer when user types
searchInput.addEventListener('input', () => {
    if (addSection.classList.contains('open') && modalTimeout) {
        // Reset the timer when user starts typing
        clearTimeout(modalTimeout);
        removeCountdown();
        startCountdown();

        modalTimeout = setTimeout(() => {
            if (addSection.classList.contains('open')) {
                closeModal();
            }
        }, 5000);
    }
});

// Add city on Enter and persist in localStorage
searchInput.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
        const cityName = searchInput.value.trim();
        if (!cityName) return;
        const data = await fetchCityWeather(cityName);
        if (data) {
            addCityBox(data);
            saveCityToStorage(data.name);
            errorMessage.style.display = 'none';
            normalMessage.style.display = 'none';
            addedMessage.textContent = 'Successfully added ✔';
            addedMessage.style.display = 'block';
            // Auto-close popup after 1s
            setTimeout(() => {
                closeModal();
                addedMessage.style.display = 'none';
            }, 1000);
        } else {
            errorMessage.style.display = 'block';
            normalMessage.style.display = 'none';
            addedMessage.style.display = 'none';
        }
        searchInput.value = '';
    }
});

function saveCityToStorage(cityName) {
    let cities = JSON.parse(localStorage.getItem('worldCities') || '[]');
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        localStorage.setItem('worldCities', JSON.stringify(cities));
    }
}

async function loadCitiesFromStorage() {
    let cities = JSON.parse(localStorage.getItem('worldCities') || '[]');
    for (const city of cities) {
        const data = await fetchCityWeather(city);
        if (data) addCityBox(data);
    }
}

// Load cities on page load
window.addEventListener('DOMContentLoaded', loadCitiesFromStorage);

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

function addCityBox(data) {
    const box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = `
        <div class="weather-box">
            <div class="weather-header">
                <div class="city-name">${data.name}, ${data.sys.country}</div>
                <div class="weather-description">${data.weather[0].description}</div>
            </div>
            <div class="weather-main">
                <div class="temp-section">
                    <div class="current-temp">${Math.floor(data.main.temp)}°</div>
                    <div class="feels-like">Feels like ${Math.floor(data.main.feels_like)}°</div>
                </div>
                <div class="weather-icon">
                    <img src="${getWeatherIcon(data.weather[0].main)}" alt="${data.weather[0].main}" />
                </div>
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <i class="fa-solid fa-droplet"></i>
                    <span>${data.main.humidity}%</span>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-wind"></i>
                    <span>${Math.floor(data.wind.speed)} m/s</span>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-gauge"></i>
                    <span>${data.main.pressure} hPa</span>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-temperature-half"></i>
                    <span>${Math.floor(data.main.temp_min)}°/${Math.floor(data.main.temp_max)}°</span>
                </div>
            </div>
            <div class="sun-times">
                <div class="sun-item">
                    <i class="fa-solid fa-sun"></i>
                    <span>${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div class="sun-item">
                    <i class="fa-solid fa-moon"></i>
                    <span>${new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
            </div>
        </div>
    `;
    cityBox.appendChild(box);
}

// Feedback Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const feedbackLink = document.getElementById('feedback-link');
    const feedbackModal = document.getElementById('feedback-modal');
    const feedbackClose = document.getElementById('feedback-close');
    const feedbackForm = document.getElementById('feedback-form');

    // Open modal
    feedbackLink.addEventListener('click', function(e) {
        e.preventDefault();
        feedbackModal.style.display = 'block';
    });

    // Close modal
    feedbackClose.addEventListener('click', function() {
        feedbackModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === feedbackModal) {
            feedbackModal.style.display = 'none';
        }
    });

    // Handle form submission
    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = feedbackForm.querySelector('.feedback-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = new FormData(feedbackForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        try {
            // Using Formspree for direct email delivery to Gmail
            // Create a free account at https://formspree.io/ and get your form endpoint
            const formspreeEndpoint = 'https://formspree.io/f/xnnbejgl'; // Your Formspree form ID

            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `Weather App Feedback from ${name}`,
                    _replyto: email
                })
            });

            if (response.ok) {
                alert('Thank you for your feedback! It has been sent to our team.');
                feedbackForm.reset();
                feedbackModal.style.display = 'none';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send feedback');
            }

        } catch (error) {
            console.error('Error sending feedback:', error);

            // Fallback: Show the feedback data for manual handling
            alert(`Feedback received!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n\nPlease copy this information and send it manually to muktharbasha123ab@gmail.com`);

            feedbackForm.reset();
            feedbackModal.style.display = 'none';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
