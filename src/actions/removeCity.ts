import type { CitiesState } from "../types/AppState";
import { pickCity } from "../presentation/input";
import { printInfo } from "../presentation/output";
import { saveCities } from "../storage/citiesStorage";
import { cityLabel } from "../utils/format";

export async function removeCity(state: CitiesState): Promise<void> {
  if (state.cities.length === 0) {
    printInfo("There are no cities registered yet.");
    return;
  }
  const city = await pickCity(state, "  Number of the city to delete: ");
  if (!city) return;
  state.cities = state.cities.filter((c) => c.id !== city.id);
  if (state.defaultCityId === city.id) {
    state.defaultCityId = state.cities[0]?.id ?? null;
  }
  await saveCities(state);
  printInfo(`Deleted ${cityLabel(city)}.`);
}
