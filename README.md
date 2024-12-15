## Trip Planner

Trip Planner is a weather tracking website where the user can input a zip code of interest and view basic weather information about that location either currently or in the days ahead.

Our website is primarily designed to work with any desktop browser, which includes but is not limited to Google Chrome, Firefox, Safari, and Microsoft Edge. For the optimal experience, we recommend using the latest version of your browser of choice.

## Developer Manual:

### 1. Installation and Setup

#### Prerequisites:
Make sure that the following applications are installed on your system:
- A web browser (e.g., Firefox, Chrome, Edge)
- A code editor (e.g., VS Code).

#### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/sawyeroj/inst377_final
   ```
2. Ensure all required dependencies are available. External libraries used include:
   - Supabase
   - Leaflet (for maps)

### 2. Running the Application

#### Local Development
1. Open the project in your code editor.
2. Start a local server. You can use extensions like **Live Server** in VS Code 

### 3. Testing the Application
There are currently no automated tests built into the program. However, there are some reccomended testing steps we have in place:
1. Open the application and ensure the navigation bar works.
2. Check if weather data and maps display correctly for valid inputs.
3. Make sure that the Pokémon feature loads random images and names properly.

### 4. API Documentation

#### External APIs Used:

##### AccuWeather API
- URL: `https://dataservice.accuweather.com`
- Endpoints:
  - `GET /locations/v1/cities/search`
    - Parameters: `q` (city name), `apikey`.
    - Usage: Fetches location key for a given city.
  - `GET /currentconditions/v1/{locationKey}`
    - Parameters: `locationKey`, `apikey`.
    - Usage: Fetches current weather conditions.
  - `GET /forecasts/v1/daily/5day/{locationKey}`
    - Parameters: `locationKey`, `apikey`.
    - Usage: Fetches a 5-day weather forecast.

##### PokéAPI
- Base URL: `https://pokeapi.co/api/v2`
- Endpoints:
  - `GET /pokemon/{id}`
    - Parameters: `id` (randomized).
    - Usage: Fetches data for a specific Pokémon.

##### Geocodify API
- Base URL: `https://api.geocodify.com/v2`
- Endpoints:
  - `GET /geocode`
    - Parameters: `q` (city name), `api_key`.
    - Usage: Fetches latitude and longitude for a city.
##### Supabase
- Base URL: `https://hmlxxrimuutrnbyiyvwu.supabase.co`
- Endpoints
  - GET username, password, saved from database
  - PATCH username, password, email, saved to database
     - May need to adjust CORS settings to enable PATCH if in sandbox.
  - Note that the endpoints are constructed using methods supabase methods  

### 5. Roadmap for Future Development
1. Automated Testing: Add automatic tests in JavaScript.
2. Error Handling Improvements:
   - Provide easy to understand error messages for API failures.
3. Responsive Design: Enhance mobile device functionality of the UI.
4. Feature Enhancements:
   - Possibly add more Pokémon information (e.g., types, abilities).
   - Allow for users to save and view their favorite locations.

