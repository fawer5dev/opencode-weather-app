import type { Unit } from "../types/Weather";
import { ask } from "../presentation/input";
import { printSettingsMenu } from "../presentation/menu";
import { printInfo } from "../presentation/output";
import { saveUnit } from "../storage/settingsStorage";
import { unitSymbol } from "../utils/format";

export async function openSettings(unit: Unit): Promise<Unit> {
  printSettingsMenu(unit);
  const choice = await ask("  Select an option: ");
  if (choice !== "1" && choice !== "2") {
    printInfo("Invalid option.");
    return unit;
  }
  const newUnit: Unit = choice === "1" ? "c" : "f";
  await saveUnit(newUnit);
  printInfo(`Unit set to ${unitSymbol(newUnit)}.`);
  return newUnit;
}
