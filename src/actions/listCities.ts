import type { CitiesState } from "../types/AppState";
import { printCityList, printInfo } from "../presentation/output";

export async function listCities(state: CitiesState): Promise<void> {
  if (state.cities.length === 0) {
    printInfo("There are no cities registered yet. Add one with option 3.");
    return;
  }
  printCityList(state.cities, state.defaultCityId);
}
