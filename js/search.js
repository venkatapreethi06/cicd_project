let apiKey = "1e3e8f230b6064d27976e41163a82b77";
let searchinput = document.querySelector('.searchinput');
let locationBtn = document.querySelector('.location-btn');
let locationStatus = document.querySelector('.location-status');
let isLocationLoading = false;

// Enhanced Geolocation with better accuracy and user feedback
async function getCurrentLocation() {
    if (isLocationLoading) return;

    isLocationLoading = true;
    updateLocationStatus('Getting your location...', 'loading');

    if (!navigator.geolocation) {
        updateLocationStatus('Geolocation is not supported by this browser', 'error');
        isLocationLoading = false;
        return;
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                updateLocationStatus(`Location found! Accuracy: ${Math.round(accuracy)}m`, 'success');

                // Get city name from coordinates with better error handling
                const geoResponse = await fetch(
                    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
                );

                if (!geoResponse.ok) {
                    throw new Error('Failed to get location name');
                }

                const geoData = await geoResponse.json();

                if (geoData && geoData.length > 0) {
                    const location = geoData[0];
                    const cityName = location.name;
                    const country = location.country;
                    const state = location.state;

                    updateLocationStatus(`📍 ${cityName}${state ? ', ' + state : ''}, ${country}`, 'success');
                    await search(cityName, state, country);
                } else {
                    throw new Error('Location data not available');
                }

            } catch (error) {
                console.error('Location processing error:', error);
                updateLocationStatus('Failed to get weather for your location', 'error');
            } finally {
                isLocationLoading = false;
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            let errorMessage = '';

            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please enable location permissions.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out. Please try again.';
                    break;
                default:
                    errorMessage = 'An unknown location error occurred.';
                    break;
            }

            updateLocationStatus(errorMessage, 'error');
            isLocationLoading = false;
        },
        options
    );
}

function updateLocationStatus(message, type) {
    if (!locationStatus) return;

    locationStatus.textContent = message;
    locationStatus.className = `location-status ${type}`;

    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            locationStatus.style.opacity = '0';
            setTimeout(() => {
                locationStatus.style.display = 'none';
            }, 300);
        }, 3000);
    } else if (type === 'error') {
        locationStatus.style.display = 'block';
        locationStatus.style.opacity = '1';
    }
}

// Initialize location tracking on page load
document.addEventListener('DOMContentLoaded', () => {
    // Try to get location automatically
    setTimeout(() => {
        if (!isLocationLoading) {
            getCurrentLocation();
        }
    }, 1000); // Small delay to ensure page is ready
});

// Search button click handler
const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const value = searchinput.value.trim();
        if (value) {
            updateLocationStatus('', '');
            const parts = value.split(',').map(s => s.trim());
            const city = parts[0] || '';
            const state = parts[1] || '';
            const country = parts[2] || '';
            search(city, state, country);
        }
    });
}

async function search(city, state = '', country = '') {
    const weatherBox = document.querySelector(".return");
    const message = document.querySelector(".message");
    const errorMessage = document.querySelector(".error-message");
    const searchInput = document.querySelector('.searchinput');

    // Show loading state
    if (searchInput) {
        searchInput.disabled = true;
        searchInput.placeholder = 'Searching...';
    }

    try {
        let query = city;
        if (state) query += `,${state}`;
        if (country) query += `,${country}`;

        const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(query)}&appid=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Hide loading states
        if (message) message.style.display = "none";
        if (errorMessage) errorMessage.style.display = "none";
        if (weatherBox) weatherBox.style.display = "block";

        // Update weather data with null checks
        const cityNameEl = document.querySelector(".city-name");
        const weatherTempEl = document.querySelector(".weather-temp");
        const weatherImgEl = document.querySelector(".weather-img");

        if (cityNameEl) cityNameEl.innerHTML = data.name || 'Unknown Location';
        if (weatherTempEl) weatherTempEl.innerHTML = Math.floor(data.main?.temp || 0) + '°';

        // Update weather details
        document.querySelectorAll('.wind').forEach(el => {
            el.innerHTML = Math.floor(data.wind?.speed || 0) + " m/s";
        });
        document.querySelectorAll('.pressure').forEach(el => {
            el.innerHTML = Math.floor(data.main?.pressure || 0) + " hPa";
        });
        document.querySelectorAll('.humidity').forEach(el => {
            el.innerHTML = Math.floor(data.main?.humidity || 0) + "%";
        });

        // Update sunrise/sunset with proper error handling
        if (data.sys?.sunrise && data.sys?.sunset) {
            const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

            document.querySelectorAll('.sunrise').forEach(el => el.innerHTML = sunriseTime);
            document.querySelectorAll('.sunset').forEach(el => el.innerHTML = sunsetTime);
        }

        // Update weather icon
        if (weatherImgEl && data.weather && data.weather[0]) {
            const weatherMain = data.weather[0].main;
            let iconSrc = "img/sun.png"; // default

            switch (weatherMain) {
                case "Rain":
                    iconSrc = "img/rain.png";
                    break;
                case "Clear":
                    iconSrc = "img/sun.png";
                    break;
                case "Snow":
                    iconSrc = "img/snow.png";
                    break;
                case "Clouds":
                case "Smoke":
                    iconSrc = "img/cloud.png";
                    break;
                case "Mist":
                case "Fog":
                    iconSrc = "img/mist.png";
                    break;
                case "Haze":
                    iconSrc = "img/haze.png";
                    break;
                case "Thunderstorm":
                    iconSrc = "img/thunderstorm.png";
                    break;
                case "Drizzle":
                    iconSrc = "img/rain.png";
                    break;
            }

            weatherImgEl.src = iconSrc;
            weatherImgEl.alt = weatherMain;
        }

        // Update location status
        updateLocationStatus(`Weather updated for ${data.name}`, 'success');

    } catch (error) {
        console.error('Weather search error:', error);

        // Show error state
        if (weatherBox) weatherBox.style.display = "none";
        if (message) message.style.display = "none";
        if (errorMessage) errorMessage.style.display = "block";

        updateLocationStatus('Failed to get weather data. Please try again.', 'error');
    } finally {
        // Reset loading state
        if (searchInput) {
            searchInput.disabled = false;
            searchInput.placeholder = 'Search for city, state, or country...';
        }
    }
}

searchinput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        const value = searchinput.value.trim();
        if (value) {
            // Clear any previous location status
            updateLocationStatus('', '');

            // Parse search query (city, state, country)
            const parts = value.split(',').map(s => s.trim());
            const city = parts[0] || '';
            const state = parts[1] || '';
            const country = parts[2] || '';

            search(city, state, country);
        }
    }
});

// Add input event listener for better UX
searchinput.addEventListener('input', function() {
    const value = searchinput.value.trim();

    // Clear location status when user starts typing
    if (value.length > 0) {
        updateLocationStatus('', '');
    }
});

// Add focus/blur events for better visual feedback
searchinput.addEventListener('focus', function() {
    this.parentElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
});

searchinput.addEventListener('blur', function() {
    this.parentElement.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
});

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
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer re_hvV3MeXb_38fRDfBugnkg3AX2urT6uJMc',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Weather App <onboarding@resend.dev>',
                    to: [email, 'muktharbasha123ab@gmail.com'],
                    subject: 'Weather App Feedback from ' + name,
                    html: `
                        <h2>New Feedback Received</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message.replace(/\n/g, '<br>')}</p>
                    `
                })
            });

            if (response.ok) {
                alert('Thank you for your feedback! We have sent a copy to your email.');
                feedbackForm.reset();
                feedbackModal.style.display = 'none';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send feedback');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            alert('Sorry, there was an error sending your feedback. Please try again later.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
