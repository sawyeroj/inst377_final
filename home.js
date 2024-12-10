const baseUrl = "http://localhost:3000/weather"; // Proxy server URL
const geocodifyBaseUrl = "https://api.geocodify.com/v2/geocode"; // Geocodify API base URL
const geocodifyApiKey = "LBlIAx25vqbReBEueivl7jYSm0gwkcpq"; // Geocodify API key

let currentLocation = { lat: null, lng: null, name: '', country: ''};

document.getElementById("search-button").addEventListener("click", function () {
    const query = document.getElementById("search-input").value.trim();

    if (!query) {
        alert("Please enter a city or zip code.");
        return;
    }

    // Fetch weather data through the proxy
    fetchWeatherData(query)
        .then(data => {
            if (data) {
                currentLocation = {
                    lat: data.location.lat,
                    lng: data.location.lon,
                    name: data.location.name,
                    country: data.location.country
                };
                displayWeather(data);
                displayMap(data.location.lat, data.location.lon);
            }
        })
        .catch(error => {
            console.error("Error fetching the weather data:", error);
            alert("Could not retrieve weather information. Please try again later.");
        });

    // Fetch location data from Geocodify API
    fetchLocationData(query)
        .then(coordinates => {
            if (coordinates) {
                currentLocation.lat = coordinates.lat;
                currentLocation.lng = coordinates.lng;
            } else {
                alert("Location not found. Please try a different search.");
            }
        })
        .catch(error => {
            console.error("Error fetching location data:", error);
            alert("Could not retrieve location data. Please try again later.");
        });
});


// Event listeners for filter buttons
document.getElementById("today-button").addEventListener("click", function () {
    if (currentLocation.lat && currentLocation.lng) {
        fetchWeatherDataByTime(currentLocation.lat, currentLocation.lng, "today")
            .then(data => {
                if (data) {
                    displayWeather(data);
                }
            })
            .catch(error => {
                console.error("Error fetching today's weather:", error);
                alert("Could not retrieve weather information for today. Please try again later.");
            });
    } else {
        alert("Please search for a location first.");
    }
});

document.getElementById("week-button").addEventListener("click", function () {
    if (currentLocation.lat && currentLocation.lng) {
        fetchWeatherDataByTime(currentLocation.lat, currentLocation.lng, "week")
            .then(data => {
                if (data) {
                    displayWeather(data);
                }
            })
            .catch(error => {
                console.error("Error fetching weekly weather:", error);
                alert("Could not retrieve weather information for the week. Please try again later.");
            });
    } else {
        alert("Please search for a location first.");
    }
});

document.getElementById("ten-days-button").addEventListener("click", function () {
    if (currentLocation.lat && currentLocation.lng) {
        fetchWeatherDataByTime(currentLocation.lat, currentLocation.lng, "10days")
            .then(data => {
                if (data) {
                    displayWeather(data);
                }
            })
            .catch(error => {
                console.error("Error fetching 10-day weather:", error);
                alert("Could not retrieve weather information for 10 days. Please try again later.");
            });
    } else {
        alert("Please search for a location first.");
    }
});

document.getElementById("month-button").addEventListener("click", function () {
    if (currentLocation.lat && currentLocation.lng) {
        fetchWeatherDataByTime(currentLocation.lat, currentLocation.lng, "month")
            .then(data => {
                if (data) {
                    displayWeather(data);
                }
            })
            .catch(error => {
                console.error("Error fetching monthly weather:", error);
                alert("Could not retrieve weather information for the month. Please try again later.");
            });
    } else {
        alert("Please search for a location first.");
    }
});

async function fetchWeatherDataByTime(lat, lng, timeRange) {
    try {
        const url = `${baseUrl}/forecast?lat=${lat}&lon=${lng}&range=${timeRange}`;
        console.log("Fetching URL:", url); // Debugging
        const response = await fetch(url);
        const data = await response.json();

        console.log("Response Data:", data); // Debugging

        if (data.error) {
            console.error("API Error:", data.error);
            alert("Error: " + data.error.info);
            return null;
        }
        return data;
    } catch (error) {
        console.error(`Error fetching weather data for ${timeRange}:`, error);
        alert("Could not retrieve weather information for the week. Please try again later.");
        throw error;
    }
}








async function fetchWeatherData(query) {
    try {
        const response = await fetch(`${baseUrl}?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.error) {
            alert("Error: " + data.error.info);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

async function fetchLocationData(query) {
    try {
        const response = await fetch(`${geocodifyBaseUrl}?api_key=${geocodifyApiKey}&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && Array.isArray(data.response.features) && data.response.features.length > 0) {
            const feature = data.response.features[0];
            const { coordinates } = feature.geometry;
            return { lat: coordinates[1], lng: coordinates[0] }; // Return latitude and longitude as an object
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching location data:", error);
        throw error;
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById("main_box");
    const tempCelsius = data.current.temperature;
    const tempFahrenheit = (tempCelsius * 9/5) + 32;

    weatherContainer.innerHTML = `
        <h3>Weather in ${data.location.name}, ${data.location.country}</h3>
        <p><strong>Temperature:</strong> ${tempCelsius}°C, ${tempFahrenheit.toFixed(1)}°F</p>
        <p><strong>Condition:</strong> ${data.current.weather_descriptions[0]}</p>
        <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.current.wind_speed} km/h</p>
        <img src="${data.current.weather_icons[0]}" alt="Weather Icon" />
    `;
}

let map; // Declare the map variable globally

function displayMap(lat, lng) {
    if (!map) {
        // Create a new map if it does not exist
        map = L.map('map').setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        // Reset the map's view if it already exists
        map.setView([lat, lng], 13);
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }

    L.marker([lat, lng]).addTo(map)
        .bindPopup(`${currentLocation.name}`)
        .openPopup();
}
