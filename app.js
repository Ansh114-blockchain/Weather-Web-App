// DOM Elements
const elements = {
    searchInput: document.querySelector('.search-input'),
    searchBtn: document.querySelector('.search-btn'),
    weatherDisplay: document.querySelector('.weather-display'),
    loading: document.querySelector('.loading'),
    errorState: document.querySelector('.error-state'),
    weatherIcon: document.querySelector('.weather-icon'),
    temperature: document.querySelector('.temperature'),
    cityName: document.querySelector('.city-name'),
    weatherDesc: document.querySelector('.weather-description'),
    detailValues: document.querySelectorAll('.detail-value')
};

// API Configuration
const apiConfig = {
    key: 'c126c21f7d04f0bed935e817c6d10d62', // Get from https://openweathermap.org/
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    units: 'metric'
};

// Weather Icon Mapping
const weatherIcons = {
    '01d': 'fas fa-sun', // clear sky day
    '01n': 'fas fa-moon', // clear sky night
    '02d': 'fas fa-cloud-sun', // few clouds day
    '02n': 'fas fa-cloud-moon', // few clouds night
    '03d': 'fas fa-cloud', // scattered clouds
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-clouds', // broken clouds
    '04n': 'fas fa-clouds',
    '09d': 'fas fa-cloud-rain', // shower rain
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain', // rain day
    '10n': 'fas fa-cloud-moon-rain', // rain night
    '11d': 'fas fa-bolt', // thunderstorm
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake', // snow
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog', // mist
    '50n': 'fas fa-smog'
};

// Background Themes
const weatherThemes = {
    'Clear': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    'Clouds': 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
    'Rain': 'linear-gradient(135deg, #1A1A2E 0%, #0A2647 100%)',
    'Thunderstorm': 'linear-gradient(135deg, #1A1A2E 0%, #06142E 100%)',
    'Snow': 'linear-gradient(135deg, #1A1A2E 0%, #253B6E 100%)',
    'Mist': 'linear-gradient(135deg, #1A1A2E 0%, #1E3D59 100%)',
    'default': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)'
};

// Event Listeners
elements.searchBtn.addEventListener('click', fetchWeather);
elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather();
});

// Initialize with default city
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather('London');
});

// Main Weather Fetch Function
async function fetchWeather() {
    const city = elements.searchInput.value.trim();
    
    if (!city) return;
    
    showLoading();
    hideError();
    
    try {
        const response = await fetch(
            `${apiConfig.baseUrl}?q=${encodeURIComponent(city)}&units=${apiConfig.units}&appid=${apiConfig.key}`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Weather fetch error:', error);
        showError();
    } finally {
        hideLoading();
    }
}

// Update UI with Weather Data
function updateUI(data) {
    const { main, weather, wind, visibility, name } = data;
    const weatherMain = weather[0].main;
    const iconCode = weather[0].icon;
    
    // Update weather icon
    const iconClass = weatherIcons[iconCode] || weatherIcons['01d'];
    elements.weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;
    
    // Update main weather info
    elements.temperature.textContent = `${Math.round(main.temp)}°C`;
    elements.cityName.textContent = name;
    elements.weatherDesc.textContent = weather[0].description;
    
    // Update details
    elements.detailValues[0].textContent = `${main.humidity}%`;
    elements.detailValues[1].textContent = `${Math.round(wind.speed * 3.6)} km/h`;
    elements.detailValues[2].textContent = `${main.pressure} hPa`;
    elements.detailValues[3].textContent = `${(visibility / 1000).toFixed(1)} km`;
    
    // Update background
    document.body.style.background = weatherThemes[weatherMain] || weatherThemes['default'];
}

// UI State Functions
function showLoading() {
    elements.loading.style.display = 'block';
    elements.weatherDisplay.style.display = 'none';
    elements.errorState.style.display = 'none';
}

function hideLoading() {
    elements.loading.style.display = 'none';
    elements.weatherDisplay.style.display = 'block';
}

function showError() {
    elements.errorState.style.display = 'block';
    elements.weatherDisplay.style.display = 'none';
}

function hideError() {
    elements.errorState.style.display = 'none';
}
