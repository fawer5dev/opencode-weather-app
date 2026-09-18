import { createInterface, type Interface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { City } from "../types/City";
import type { CitiesState } from "../types/AppState";
import { printCityList, printInfo } from "./output";

let rl: Interface | null = null;

function getInterface(): Interface {
  rl ??= createInterface({ input, output });
  return rl;
}

export async function ask(question: string): Promise<string> {
  return (await getInterface().question(question)).trim();
}

export function closeInput(): void {
  rl?.close();
  rl = null;
}

export async function pickCity(
  state: CitiesState,
  question: string,
): Promise<City | null> {
  printCityList(state.cities, state.defaultCityId);
  const choice = await ask(question);
  const city = state.cities[Number.parseInt(choice, 10) - 1];
  if (!city) {
    printInfo("Invalid option.");
    return null;
  }
  return city;
}
