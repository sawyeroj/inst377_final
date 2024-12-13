// home.js

// AccuWeather API base URL and key
const accuweatherBaseUrl = "https://dataservice.accuweather.com";
const accuweatherApiKey = "lO95XTZsj3Cu9szOFD2iwxJGS2IhW5QS"; 

document.getElementById('today-button').addEventListener('click', () => updateWeatherForDay(0));
document.getElementById('tomorrow-button').addEventListener('click', () => updateWeatherForDay(1));
document.getElementById('two-days-button').addEventListener('click', () => updateWeatherForDay(2));
document.getElementById('three-days-button').addEventListener('click', () => updateWeatherForDay(3));
document.getElementById('four-days-button').addEventListener('click', () => updateWeatherForDay(4));



// Event listener for the search button
document.getElementById('search-button').addEventListener('click', async () => {
    const city = document.getElementById('search-input').value.trim();
    if (city) {
        try {
            const locationData = await getLocationKey(city);
            if (locationData) {
                const { locationKey, cityName } = locationData;
                const weatherData = await getWeatherData(locationKey);
                displayWeatherData(weatherData, cityName);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert('Please enter a city or zip code.');
    }
});

// Function to fetch location key based on user input
async function getLocationKey(cityName) {
    const apiKey = accuweatherApiKey;
    try {
        const response = await fetch(`${accuweatherBaseUrl}/locations/v1/cities/search?apikey=${apiKey}&q=${cityName}&language=en-us&details=false`);
        const data = await response.json();

        if (data.length > 0) {
            const locationKey = data[0].Key;
            const cityName = data[0].LocalizedName; 
            console.log('Location Key:', locationKey);
            console.log('City Name:', cityName);
            return { locationKey, cityName };
        } else {
            alert('City not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching location key:', error);
    }
}

// Function to fetch weather data based on location key
async function getWeatherData(locationKey) {
    const apiKey = accuweatherApiKey;
    const url = `${accuweatherBaseUrl}/currentconditions/v1/${locationKey}?apikey=${apiKey}&language=en-us`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            return data[0]; 
        } else {
            throw new Error('Weather data not found.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

// Global variable to hold the Leaflet map instance
let mapInstance;

async function displayWeatherData(weatherData, cityName) {
    const mainContent = document.getElementById('main_box');
    const mapDiv = document.getElementById('map'); 
    console.log('Weather data:', weatherData);

    const temperature = weatherData.Temperature.Metric.Value;
    const temperatureF = weatherData.Temperature.Imperial.Value;
    const weather = weatherData.WeatherText || 'No weather information';
    const humidity = weatherData.RelativeHumidity !== undefined ? weatherData.RelativeHumidity : 'N/A';
    const iconId = weatherData.WeatherIcon;

    // Construct the URL for the weather icon
    const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconId < 10 ? '0' : ''}${iconId}-s.png`;

    // Get coordinates for the city
    const coordinates = await getCoordinates(cityName);
    if (coordinates) {
        const { latitude, longitude } = coordinates;

        // Remove the existing map instance if it exists
        if (mapInstance) {
            mapInstance.remove();
        }

        // Initialize Leaflet map
        mapInstance = L.map(mapDiv).setView([latitude, longitude], 12);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(mapInstance);

        // Add a marker for the city
        L.marker([latitude, longitude]).addTo(mapInstance)
            .bindPopup(`<b>${cityName}</b>`)
            .openPopup();

        // Display weather data in the main content
        const weatherHTML = `
            <h3>Weather in ${cityName}</h3>
            <p>Temperature: ${temperature} °C / ${temperatureF} °F</p>
            <p>Weather: ${weather}</p>
            <img src="${iconUrl}" alt="Weather Icon" />
        `;
        mainContent.innerHTML = weatherHTML;

    } else {
        console.error('Coordinates not found');
        mapDiv.innerHTML = '<p>Unable to load map. Please check the city name or try again.</p>';
    }
}


async function getCoordinates(cityName) {
    const apiKey = 'LBlIAx25vqbReBEueivl7jYSm0gwkcpq';
    try {
        const response = await fetch(`https://api.geocodify.com/v2/geocode?api_key=${apiKey}&q=${cityName}`);
        const data = await response.json();
        console.log('Full Geocodify Response:', data);

        if (data && data.response && data.response.features.length > 0) {
            const coordinates = data.response.features[0].geometry.coordinates;
            const latitude = coordinates[1];
            const longitude = coordinates[0];
            console.log(`Coordinates for ${cityName}:`, latitude, longitude);
            return { latitude, longitude };
        } else {
            console.error('No features found in Geocodify response.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}
function displayMap(latitude, longitude) {
    console.log(`Displaying map for coordinates: Latitude ${latitude}, Longitude ${longitude}`);
    const map = L.map('map').setView([latitude, longitude], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Weather location')
        .openPopup();
}


// Function to fetch 4-day forecast data
async function get4DayForecast(locationKey) {
    const apiKey = accuweatherApiKey;
    const url = `${accuweatherBaseUrl}/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&language=en-us&details=true`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('5-day forecast data:', data); 
        return data.DailyForecasts; 
    } catch (error) {
        console.error('Error fetching 5-day forecast data:', error);
        alert('Error fetching forecast data. Please try again.');
    }
}


async function updateWeatherForDay(dayIndex) {
    try {
        const city = document.getElementById('search-input').value.trim();
        if (city) {
            const locationData = await getLocationKey(city);
            if (locationData) {
                const { locationKey, cityName } = locationData;
                const forecastData = await get4DayForecast(locationKey);


                console.log('Forecast Data:', forecastData);
                console.log('Forecast Data:', forecastData[dayIndex]);

                if (forecastData && forecastData[dayIndex]) {
                    const selectedDay = forecastData[dayIndex];
                    console.log('Selected Day Data:', selectedDay);

                    const date = new Date(selectedDay.Date).toLocaleDateString();
                    const minTemp = selectedDay.Temperature.Minimum.Value;
                    const maxTemp = selectedDay.Temperature.Maximum.Value;
                    const dayCondition = selectedDay.Day.IconPhrase;
                    const nightCondition = selectedDay.Night.IconPhrase;
                    const dayIconNumber = selectedDay.Day.Icon < 10 ? `0${selectedDay.Day.Icon}` : selectedDay.Day.Icon;
                    const nightIconNumber = selectedDay.Night.Icon < 10 ? `0${selectedDay.Night.Icon}` : selectedDay.Night.Icon;

                    const dayIconURL = `https://developer.accuweather.com/sites/default/files/${dayIconNumber}-s.png`;
                    const nightIconURL = `https://developer.accuweather.com/sites/default/files/${nightIconNumber}-s.png`;

                
                    // Update weather display
                    document.getElementById('main_box').innerHTML = `
                        <h3>Weather for ${date}</h3>
                        <p>Min Temp: ${minTemp}°${selectedDay.Temperature.Minimum.Unit}</p>
                        <p>Max Temp: ${maxTemp}°${selectedDay.Temperature.Maximum.Unit}</p>
                        <p>Day Condition: ${dayCondition}</p>
                        <img src="${dayIconURL}" alt="Day Weather Icon" />
                        <p>Night Condition: ${nightCondition}</p>
                        <img src="${nightIconURL}" alt="Night Weather Icon" />
                    `;
                } else {
                    alert('Forecast data unavailable for the selected day.');
                }
            }
        } else {
            alert('Please enter a city or zip code first.');
        }
    } catch (error) {
        console.error('Error updating weather data:', error);
    }
}

// Function to fetch a random Pokémon and display it in the given box
async function fetchRandomPokemon(boxId) {
    const pokemonId = Math.floor(Math.random() * 1025) + 1; 
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    try {
        // Fetch Pokémon details from the API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) throw new Error(`Failed to fetch Pokémon with ID ${pokemonId}`);
        const pokemonData = await response.json();

        // Update the specified box with Pokémon details
        const box = document.getElementById(boxId);
        box.innerHTML = `
            <img src="${imageUrl}" alt="${pokemonData.name}" style="width: 100%; height: auto;">
            <p style="text-align: center;">${pokemonData.name.toUpperCase()}</p>
        `;
    } catch (error) {
        console.error(error);
    }
}

// Function to fetch and display Pokémon in all boxes
function displayRandomPokemons() {
    fetchRandomPokemon('pokemon_box_1'); // Fetch for box 1
    fetchRandomPokemon('pokemon_box_2'); // Fetch for box 2
    fetchRandomPokemon('pokemon_box_3'); // Fetch for box 3
    fetchRandomPokemon('pokemon_box_4'); // Fetch for box 4
}

// Load random Pokémon when the page loads
window.onload = displayRandomPokemons;