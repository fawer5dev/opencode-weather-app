## Desired structure

```bash
src/
├── actions/                # Main actions the user can execute
│   ├── getWeather.ts       # Get current weather for a city
│   ├── addCity.ts          # Add a city to the list
│   ├── removeCity.ts       # Remove a city
│   ├── setDefaultCity.ts   # Set the default city
│   ├── listCities.ts       # List all saved cities
│   └── ...                 # Other future actions
├── presentation/           # Everything related to console/CLI interaction
│   ├── menu.ts             # Menu rendering and option selection handling
│   ├── output.ts           # Functions to display messages to the user
│   ├── input.ts            # Functions to capture and validate user inputs
│   └── ...                 # Other presentation components
├── storage/                # Layer for reading, writing and managing local data
│   ├── citiesStorage.ts    # Persistence of saved cities
│   ├── settingsStorage.ts  # Persistence of configuration and preferences
│   └── ...                 # Other storage mechanisms
├── types/                  # TypeScript types and contracts used globally
│   ├── City.ts             # City type definition
│   ├── Weather.ts          # Types for the weather response
│   ├── MenuOption.ts       # Type for menu options
│   └── ...                 # Other global types
├── api/                    # Integration with external APIs (OpenMeteo, geocoding)
│   ├── geocoding.ts        # Logic to get coordinates for a city
│   ├── weather.ts          # Logic to get current weather and forecast
│   └── ...                 # Other endpoints or API utilities
├── utils/                  # Reusable utilities and helpers
│   ├── format.ts           # Data formatters (dates, temperatures, etc)
│   ├── constants.ts        # General app constants
│   ├── colors.ts           # Color definitions and utilities for the console
│   └── ...                 # Other utilities
├── index.ts                # Main entry point of the CLI app
```
