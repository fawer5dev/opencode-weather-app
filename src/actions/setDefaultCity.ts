import type { CitiesState } from "../types/AppState";
import { pickCity } from "../presentation/input";
import { printInfo } from "../presentation/output";
import { saveCities } from "../storage/citiesStorage";
import { cityLabel } from "../utils/format";

export async function setDefaultCity(state: CitiesState): Promise<void> {
  if (state.cities.length === 0) {
    printInfo("There are no cities registered yet. Add one with option 3.");
    return;
  }
  const city = await pickCity(state, "  Number of the new default city: ");
  if (!city) return;
  state.defaultCityId = city.id;
  await saveCities(state);
  printInfo(`Default city set to ${cityLabel(city)}.`);
}
