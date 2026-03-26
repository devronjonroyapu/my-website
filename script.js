const apiKey = '03794b548581b2db65b87fcee8e247b6'; // Replace with your OpenWeatherMap API key
let isCelsius = true;

document.getElementById('searchButton').addEventListener('click', () => {
    const cityName = document.getElementById('cityInput').value;
    fetchWeatherData(cityName);
});

document.getElementById('geolocationButton').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            fetchWeatherDataByCoords(position.coords.latitude, position.coords.longitude);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

document.getElementById('unitToggle').addEventListener('click', () => {
    isCelsius = !isCelsius;
    const cityName = document.getElementById('cityName').textContent;
    if (cityName) {
        fetchWeatherData(cityName);
    }
});

function fetchWeatherData(city) {
    const units = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeatherDisplay(data);
            fetchForecastData(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            alert('Error fetching weather data');
            console.error(error);
        });
}

function fetchWeatherDataByCoords(lat, lon) {
    const units = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeatherDisplay(data);
            fetchForecastData(lat, lon);
        })
        .catch(error => {
            alert('Error fetching weather data');
            console.error(error);
        });
}

function fetchForecastData(lat, lon) {
    const units = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateForecastDisplay(data);
        })
        .catch(error => {
            alert('Error fetching forecast data');
            console.error(error);
        });
}

function updateCurrentWeatherDisplay(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°${isCelsius ? 'C' : 'F'}`;
    document.getElementById('description').textContent = `Weather: ${data.weather[0].description}`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('clouds').textContent = `Cloudiness: ${data.clouds.all}%`;
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('unitToggle').textContent = `Switch to °${isCelsius ? 'F' : 'C'}`;
}

function updateForecastDisplay(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) {
            const forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-day');
            
            const date = new Date(forecast.dt_txt).toLocaleDateString(undefined, { weekday: 'short' });
            const temp = `${Math.round(forecast.main.temp)}°${isCelsius ? 'C' : 'F'}`;
            const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

            forecastDay.innerHTML = `
                <h4>${date}</h4>
                <img src="${icon}" alt="Weather Icon">
                <p>${temp}</p>
            `;
            forecastContainer.appendChild(forecastDay);
        }
    });
}
