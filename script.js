const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const weatherData = document.getElementById('weatherData');
const cityNameEl = document.getElementById('cityName');
const temperatureEl = document.getElementById('temperature');
const weatherDescriptionEl = document.getElementById('weatherDescription');
const forecastDetailsEl = document.querySelector('.forecast-details');

searchButton.addEventListener('click', () => {
    const cityName = searchInput.value;
    if (cityName.trim() !== '') {
        fetchWeather(cityName);
    } else {
        weatherData.innerHTML = '<p>Please enter a city name</p>';
    }
});

async function fetchWeather(cityName) {
    const apiKey = '786e6dadd0fd2fb499c3eed11a65f6bf';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
        console.log('Fetching weather data from:', apiUrl); // Debugging log
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`City not found (status: ${response.status})`);
        }
        const data = await response.json();
        console.log('Weather Data:', data); // Debugging log
        displayWeather(data);
        fetchForecast(cityName);
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        weatherData.innerHTML = `<p>${error.message}</p>`;
    }
}

async function fetchForecast(cityName) {
    const apiKey = '786e6dadd0fd2fb499c3eed11a65f6bf';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
        console.log('Fetching forecast data from:', apiUrl); // Debugging log
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`City not found (status: ${response.status})`);
        }
        const data = await response.json();
        console.log('Forecast Data:', data); // 
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast:', error.message);
        forecastDetailsEl.innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const weatherDescription = data.weather[0].description;

    cityNameEl.textContent = cityName;
    temperatureEl.textContent = `${temperature}°C`;
    weatherDescriptionEl.textContent = weatherDescription;
}

function displayForecast(data) {
    forecastDetailsEl.innerHTML = ''; // Clear previous forecast data
    const forecast = data.list.filter(item => item.dt_txt.includes('18:00:00'));
    forecast.forEach(item => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temp = item.main.temp;
        const description = item.weather[0].description;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <p>${day}</p>
            <p>${temp}°C</p>
            <p>${description}</p>
        `;
        forecastDetailsEl.appendChild(forecastItem);
    });
}
