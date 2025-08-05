const apiKey = '1aea603a8beb4bb589f165143250707'; // Replace with your WeatherAPI.com API key
const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const currentLocationBtn = document.getElementById('currentLocationBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    weatherResult.classList.remove('active');
    weatherResult.innerHTML = 'Loading...';
    weatherResult.classList.add('active');
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`);
        if (!res.ok) throw new Error('City not found');
        const data = await res.json();
        displayWeather(data);
    } catch (err) {
        weatherResult.innerHTML = `<span style="color:#e57373;">${err.message}</span>`;
    }
});

async function displayWeatherByCoords(lat, lon) {
    weatherResult.classList.remove('active');
    weatherResult.innerHTML = 'Loading...';
    weatherResult.classList.add('active');
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`);
        if (!res.ok) throw new Error('Location not found');
        const data = await res.json();
        displayWeather(data);
    } catch (err) {
        weatherResult.innerHTML = `<span style=\"color:#e57373;\">${err.message}</span>`;
    }
}

function displayWeather(data) {
    weatherResult.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p style="font-size:2.2rem; font-weight:700; color:#185a9d;">${Math.round(data.current.temp_c)}°C</p>
        <p>${data.current.condition.text}</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Wind: ${Math.round(data.current.wind_kph)} kph</p>
    `;
}

currentLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        weatherResult.innerHTML = '<span style="color:#e57373;">Geolocation is not supported by your browser.</span>';
        weatherResult.classList.add('active');
        return;
    }
    weatherResult.innerHTML = 'Getting your location...';
    weatherResult.classList.add('active');
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            displayWeatherByCoords(latitude, longitude);
        },
        (error) => {
            weatherResult.innerHTML = `<span style=\"color:#e57373;\">Unable to retrieve your location.</span>`;
            weatherResult.classList.add('active');
        }
    );
}); 
