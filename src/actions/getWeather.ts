import type { City } from "../types/City";
import type { CitiesState } from "../types/AppState";
import type { Unit } from "../types/Weather";
import { getWeather } from "../api/weather";
import { printError, printInfo, printWeather } from "../presentation/output";

export async function showWeather(city: City, unit: Unit): Promise<void> {
  try {
    const temperature = await getWeather(city.latitude, city.longitude, unit);
    printWeather(city, temperature, unit);
  } catch (error) {
    printError(
      error instanceof Error ? error.message : "Could not fetch the weather",
    );
  }
}

export async function getDefaultCityWeather(
  state: CitiesState,
  unit: Unit,
): Promise<void> {
  if (state.defaultCityId === null) {
    printInfo(
      "There is no default city yet. Add one with option 3 or set it with option 5.",
    );
    return;
  }
  const city = state.cities.find((c) => c.id === state.defaultCityId);
  if (!city) {
    printInfo(
      "The default city is not registered anymore. Set a new one with option 5.",
    );
    return;
  }
  await showWeather(city, unit);
}

export async function getAllCitiesWeather(
  state: CitiesState,
  unit: Unit,
): Promise<void> {
  if (state.cities.length === 0) {
    printInfo("There are no cities registered yet. Add one with option 3.");
    return;
  }
  for (const city of state.cities) {
    await showWeather(city, unit);
  }
}
