import type { City } from "../types/City";
import type { Unit } from "../types/Weather";
import { green, red, yellow } from "../utils/colors";
import { cityLabel, unitSymbol } from "../utils/format";

export function printWeather(city: City, temperature: number, unit: Unit): void {
  console.log("  ─────────────────────────────────────");
  console.log(`  Weather in ${cityLabel(city)}`);
  console.log(`  Temperature: ${yellow(`${temperature}${unitSymbol(unit)}`)}`);
  console.log("  ─────────────────────────────────────");
}

export function printCityList(cities: City[], defaultCityId: number | null): void {
  cities.forEach((city, index) => {
    const isDefault = city.id === defaultCityId ? " (default)" : "";
    console.log(`  ${index + 1}. ${cityLabel(city)}${isDefault}`);
  });
}

export function printInfo(message: string): void {
  console.log(`  ${green(message)}`);
}

export function printError(message: string): void {
  console.log(`  ${red(`[ERROR] ${message}`)}`);
}
