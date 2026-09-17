import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { cyan, green, red, yellow } from "./colors";
import type { City, Unit } from "./types";

const rl = createInterface({ input, output });

export async function ask(question: string): Promise<string> {
  return (await rl.question(question)).trim();
}

export function closeInput(): void {
  rl.close();
}

export function unitSymbol(unit: Unit): string {
  return unit === "c" ? "°C" : "°F";
}

export function cityLabel(city: Pick<City, "name"> & Partial<Pick<City, "admin1" | "country">>): string {
  const region = [city.admin1, city.country]
    .filter((part) => (part ?? "").length > 0)
    .join(", ");
  return region.length > 0 ? `${city.name} (${region})` : city.name;
}

export function printMenu(cityCount: number, unit: Unit): void {
  const border = cyan("════════════════════════════════════════");
  console.log(`${border}
         ${cyan("WEATHER CLI")}
${border}
  1. Default city weather
  2. Weather of all cities (${cityCount})
  3. Search and add city
  4. Delete city
  5. Set default city
  8. Settings (${unitSymbol(unit)})
  9. Exit
${border}`);
}

export function printWeather(city: City, temperature: number, unit: Unit): void {
  console.log("  ─────────────────────────────────────");
  console.log(`  Weather in ${cityLabel(city)}`);
  console.log(`  Temperature: ${yellow(`${temperature}${unitSymbol(unit)}`)}`);
  console.log("  ─────────────────────────────────────");
}

export function printInfo(message: string): void {
  console.log(`  ${green(message)}`);
}

export function printError(message: string): void {
  console.log(`  ${red(`[ERROR] ${message}`)}`);
}
