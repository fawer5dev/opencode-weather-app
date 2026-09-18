import type { Unit } from "../types/Weather";
import { isMenuOption, type MenuOption } from "../types/MenuOption";
import { cyan } from "../utils/colors";
import { APP_NAME } from "../utils/constants";
import { unitSymbol } from "../utils/format";
import { ask } from "./input";

export function printMenu(cityCount: number, unit: Unit): void {
  console.log(cyan("════════════════════════════════════════"));
  console.log(cyan(`         ${APP_NAME}`));
  console.log(cyan("═════════════════════════════════════════"));
  console.log("  1. Default city weather");
  console.log(`  2. Weather of all cities (${cityCount})`);
  console.log("  3. Search and add city");
  console.log("  4. Delete city");
  console.log("  5. Set default city");
  console.log("  6. List saved cities");
  console.log(`  8. Settings (${unitSymbol(unit)})`);
  console.log("  9. Exit");
  console.log(cyan("═════════════════════════════════════════"));
}

export function printSettingsMenu(unit: Unit): void {
  console.log(`  Current unit: ${unitSymbol(unit)}`);
  console.log("  1. Celsius (°C)");
  console.log("  2. Fahrenheit (°F)");
}

export async function readMenuOption(): Promise<MenuOption | null> {
  const choice = await ask("  Select an option: ");
  return isMenuOption(choice) ? choice : null;
}
