import { homedir } from "node:os";
import { join } from "node:path";
import type { AppData } from "./types";

const DATA_FILE = join(homedir(), ".weather-cli.json");

const DEFAULT_DATA: AppData = {
  cities: [],
  defaultCityId: null,
  unit: "c",
};

export async function loadData(): Promise<AppData> {
  const file = Bun.file(DATA_FILE);
  if (!(await file.exists())) {
    return { ...DEFAULT_DATA };
  }
  try {
    const parsed = (await file.json()) as Partial<AppData>;
    return {
      cities: Array.isArray(parsed.cities) ? parsed.cities : [],
      defaultCityId:
        typeof parsed.defaultCityId === "number" ? parsed.defaultCityId : null,
      unit: parsed.unit === "f" ? "f" : "c",
    };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export async function saveData(data: AppData): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(data, null, 2));
}
