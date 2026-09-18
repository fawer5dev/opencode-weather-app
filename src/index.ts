import { addCity } from "./actions/addCity";
import { getDefaultCityWeather, getAllCitiesWeather } from "./actions/getWeather";
import { listCities } from "./actions/listCities";
import { removeCity } from "./actions/removeCity";
import { openSettings } from "./actions/settings";
import { setDefaultCity } from "./actions/setDefaultCity";
import { ask, closeInput } from "./presentation/input";
import { printMenu, readMenuOption } from "./presentation/menu";
import { printInfo } from "./presentation/output";
import { loadCities } from "./storage/citiesStorage";
import { loadUnit } from "./storage/settingsStorage";
import type { CitiesState } from "./types/AppState";
import type { Unit } from "./types/Weather";

async function main(): Promise<void> {
  const state: CitiesState = await loadCities();
  let unit: Unit = await loadUnit();
  while (true) {
    console.clear();
    printMenu(state.cities.length, unit);
    const option = await readMenuOption();
    console.log();
    if (option === null) {
      printInfo("Invalid option.");
    } else if (option === "9") {
      break;
    } else {
      switch (option) {
        case "1":
          await getDefaultCityWeather(state, unit);
          break;
        case "2":
          await getAllCitiesWeather(state, unit);
          break;
        case "3":
          await addCity(state, unit);
          break;
        case "4":
          await removeCity(state);
          break;
        case "5":
          await setDefaultCity(state);
          break;
        case "6":
          await listCities(state);
          break;
        case "8":
          unit = await openSettings(unit);
          break;
      }
    }
    await ask("\n  Press Enter to continue...");
  }
  closeInput();
  printInfo("Goodbye!");
}

main().catch((error) => {
  closeInput();
  console.error(error);
  process.exitCode = 1;
});
