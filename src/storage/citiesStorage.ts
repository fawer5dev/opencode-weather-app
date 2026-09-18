import { join } from "node:path";
import type { CitiesState } from "../types/AppState";
import { DATA_DIR, LEGACY_DATA_FILE } from "../utils/constants";

const CITIES_FILE = join(DATA_DIR, "cities.json");

export async function loadCities(): Promise<CitiesState> {
  const state = await readStateFrom(CITIES_FILE);
  if (state) {
    return state;
  }
  const legacy = await readStateFrom(LEGACY_DATA_FILE);
  if (legacy) {
    await saveCities(legacy);
    return legacy;
  }
  return { cities: [], defaultCityId: null };
}

export async function saveCities(state: CitiesState): Promise<void> {
  await Bun.write(CITIES_FILE, JSON.stringify(state, null, 2));
}

async function readStateFrom(path: string): Promise<CitiesState | null> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    return null;
  }
  try {
    const parsed = (await file.json()) as Partial<CitiesState>;
    return {
      cities: Array.isArray(parsed.cities) ? parsed.cities : [],
      defaultCityId:
        typeof parsed.defaultCityId === "number" ? parsed.defaultCityId : null,
    };
  } catch {
    return null;
  }
}
