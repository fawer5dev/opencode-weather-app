import { mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mock } from "bun:test";

export const TEMP_HOME = mkdtempSync(join(tmpdir(), "weather-cli-test-"));
export const TEST_DATA_DIR = join(TEMP_HOME, ".config", "weather-cli");
export const TEST_CITIES_FILE = join(TEST_DATA_DIR, "cities.json");
export const TEST_SETTINGS_FILE = join(TEST_DATA_DIR, "settings.json");
export const TEST_LEGACY_FILE = join(TEMP_HOME, ".weather-cli.json");

const constantsPath = realpathSync(join(import.meta.dir, "../../utils/constants.ts"));

mock.module(constantsPath, () => ({
  APP_NAME: "WEATHER CLI",
  DATA_DIR: TEST_DATA_DIR,
  LEGACY_DATA_FILE: TEST_LEGACY_FILE,
}));

const answers: string[] = [];
let closeCount = 0;

export function setAnswers(...next: string[]): void {
  answers.length = 0;
  answers.push(...next);
}

export function getCloseCount(): number {
  return closeCount;
}

const fakeInterface = {
  question: async (_query: string): Promise<string> => {
    const answer = answers.shift();
    if (answer === undefined) {
      throw new Error("No scripted answer available");
    }
    return answer;
  },
  close: (): void => {
    closeCount += 1;
  },
};

mock.module("node:readline/promises", () => ({
  createInterface: () => fakeInterface,
}));

export function resetStorage(): void {
  rmSync(TEST_CITIES_FILE, { force: true });
  rmSync(TEST_SETTINGS_FILE, { force: true });
  rmSync(TEST_LEGACY_FILE, { force: true });
}
