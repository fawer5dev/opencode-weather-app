import { join } from "node:path";
import type { Unit } from "../types/Weather";
import { DATA_DIR, LEGACY_DATA_FILE } from "../utils/constants";

const SETTINGS_FILE = join(DATA_DIR, "settings.json");

export async function loadUnit(): Promise<Unit> {
  const unit = await readUnitFrom(SETTINGS_FILE);
  if (unit) {
    return unit;
  }
  const legacyUnit = await readUnitFrom(LEGACY_DATA_FILE);
  if (legacyUnit) {
    await saveUnit(legacyUnit);
    return legacyUnit;
  }
  return "c";
}

export async function saveUnit(unit: Unit): Promise<void> {
  await Bun.write(SETTINGS_FILE, JSON.stringify({ unit }, null, 2));
}

async function readUnitFrom(path: string): Promise<Unit | null> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    return null;
  }
  try {
    const parsed = (await file.json()) as { unit?: unknown };
    if (parsed.unit === "f") return "f";
    if (parsed.unit === "c") return "c";
    return null;
  } catch {
    return null;
  }
}
