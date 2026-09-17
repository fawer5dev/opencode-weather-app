import { geocodeCity, getWeather } from "./api";
import { loadData, saveData } from "./storage";
import {
  ask,
  cityLabel,
  closeInput,
  printError,
  printInfo,
  printMenu,
  printWeather,
  unitSymbol,
} from "./ui";
import type { AppData, City } from "./types";

async function showWeather(data: AppData, city: City): Promise<void> {
  try {
    const temperature = await getWeather(city.latitude, city.longitude, data.unit);
    printWeather(city, temperature, data.unit);
  } catch (error) {
    printError(error instanceof Error ? error.message : "Could not fetch the weather");
  }
}

async function defaultCityWeather(data: AppData): Promise<void> {
  if (data.defaultCityId === null) {
    printInfo("There is no default city yet. Add one with option 3 or set it with option 5.");
    return;
  }
  const city = data.cities.find((c) => c.id === data.defaultCityId);
  if (!city) {
    printInfo("The default city is not registered anymore. Set a new one with option 5.");
    return;
  }
  await showWeather(data, city);
}

async function allCitiesWeather(data: AppData): Promise<void> {
  if (data.cities.length === 0) {
    printInfo("There are no cities registered yet. Add one with option 3.");
    return;
  }
  for (const city of data.cities) {
    await showWeather(data, city);
  }
}

async function searchAndAddCity(data: AppData): Promise<void> {
  const name = await ask("  City name to search: ");
  if (name.length === 0) {
    printInfo("You did not enter a city name.");
    return;
  }
  try {
    const results = await geocodeCity(name);
    const [first] = results;
    if (!first) {
      printInfo(`No results found for "${name}".`);
      return;
    }
    let result = first;
    if (results.length > 1) {
      results.forEach((r, index) => {
        console.log(`  ${index + 1}. ${cityLabel(r)}`);
      });
      const choice = await ask("  Number of the city to add (0 to cancel): ");
      if (choice === "0") {
        printInfo("Cancelled.");
        return;
      }
      const chosen = results[Number.parseInt(choice, 10) - 1];
      if (!chosen) {
        printInfo("Invalid option.");
        return;
      }
      result = chosen;
    }
    if (data.cities.some((c) => c.id === result.id)) {
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
    data.cities.push(city);
    if (data.defaultCityId === null) {
      data.defaultCityId = city.id;
    }
    await saveData(data);
    printInfo(`Added ${cityLabel(city)}.`);
    await showWeather(data, city);
  } catch (error) {
    printError(error instanceof Error ? error.message : "Could not search the city");
  }
}

function listCities(data: AppData): void {
  data.cities.forEach((city, index) => {
    const isDefault = city.id === data.defaultCityId ? " (default)" : "";
    console.log(`  ${index + 1}. ${cityLabel(city)}${isDefault}`);
  });
}

async function pickCity(data: AppData, question: string): Promise<City | null> {
  listCities(data);
  const choice = await ask(question);
  const city = data.cities[Number.parseInt(choice, 10) - 1];
  if (!city) {
    printInfo("Invalid option.");
    return null;
  }
  return city;
}

async function deleteCity(data: AppData): Promise<void> {
  if (data.cities.length === 0) {
    printInfo("There are no cities registered yet.");
    return;
  }
  const city = await pickCity(data, "  Number of the city to delete: ");
  if (!city) return;
  data.cities = data.cities.filter((c) => c.id !== city.id);
  if (data.defaultCityId === city.id) {
    data.defaultCityId = data.cities[0]?.id ?? null;
  }
  await saveData(data);
  printInfo(`Deleted ${cityLabel(city)}.`);
}

async function setDefaultCity(data: AppData): Promise<void> {
  if (data.cities.length === 0) {
    printInfo("There are no cities registered yet. Add one with option 3.");
    return;
  }
  const city = await pickCity(data, "  Number of the new default city: ");
  if (!city) return;
  data.defaultCityId = city.id;
  await saveData(data);
  printInfo(`Default city set to ${cityLabel(city)}.`);
}

async function openSettings(data: AppData): Promise<void> {
  console.log(`  Current unit: ${unitSymbol(data.unit)}`);
  console.log("  1. Celsius (°C)");
  console.log("  2. Fahrenheit (°F)");
  const choice = await ask("  Select an option: ");
  if (choice !== "1" && choice !== "2") {
    printInfo("Invalid option.");
    return;
  }
  data.unit = choice === "1" ? "c" : "f";
  await saveData(data);
  printInfo(`Unit set to ${unitSymbol(data.unit)}.`);
}

async function main(): Promise<void> {
  const data = await loadData();
  while (true) {
    console.clear();
    printMenu(data.cities.length, data.unit);
    const option = await ask("  Select an option: ");
    console.log();
    if (option === "9") {
      break;
    }
    switch (option) {
      case "1":
        await defaultCityWeather(data);
        break;
      case "2":
        await allCitiesWeather(data);
        break;
      case "3":
        await searchAndAddCity(data);
        break;
      case "4":
        await deleteCity(data);
        break;
      case "5":
        await setDefaultCity(data);
        break;
      case "8":
        await openSettings(data);
        break;
      default:
        printInfo("Invalid option.");
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
