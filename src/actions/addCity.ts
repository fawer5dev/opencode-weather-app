import type { City } from "../types/City";
import type { CitiesState } from "../types/AppState";
import type { Unit } from "../types/Weather";
import { geocodeCity } from "../api/geocoding";
import { ask } from "../presentation/input";
import { printError, printInfo } from "../presentation/output";
import { saveCities } from "../storage/citiesStorage";
import { cityLabel } from "../utils/format";
import { showWeather } from "./getWeather";

export async function addCity(state: CitiesState, unit: Unit): Promise<void> {
  const name = await ask("  City name to search: ");
  if (name.length === 0) {
    printInfo("You did not enter a city name.");
    return;
  }
  try {
    const result = await geocodeCity(name);
    if (!result) {
      printInfo(`No results found for "${name}".`);
      return;
    }
    if (state.cities.some((c) => c.id === result.id)) {
      printInfo(`${result.name} is already registered.`);
      return;
    }
    const city: City = {
      id: result.id,
      name: result.name,
      country: result.country ?? "",
      admin1: result.admin1 ?? "",
      latitude: result.latitude,
      longitude: result.longitude,
    };
    state.cities.push(city);
    if (state.defaultCityId === null) {
      state.defaultCityId = city.id;
    }
    await saveCities(state);
    printInfo(`Added ${cityLabel(city)}.`);
    await showWeather(city, unit);
  } catch (error) {
    printError(
      error instanceof Error ? error.message : "Could not search the city",
    );
  }
}
