import { homedir } from "node:os";
import { join } from "node:path";

export const APP_NAME = "WEATHER CLI";

export const DATA_DIR = join(homedir(), ".config", "weather-cli");

export const LEGACY_DATA_FILE = join(homedir(), ".weather-cli.json");
