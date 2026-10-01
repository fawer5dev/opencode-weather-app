import { beforeEach, describe, expect, it } from "bun:test";
import { TEST_LEGACY_FILE, TEST_SETTINGS_FILE, resetStorage } from "../helpers/setup";
import { loadUnit, saveUnit } from "../../storage/settingsStorage";

describe("settingsStorage", () => {
  beforeEach(resetStorage);

  it("defaults to celsius when no file exists", async () => {
    expect(await loadUnit()).toBe("c");
  });

  it("saves and loads the unit", async () => {
    await saveUnit("f");
    expect(await loadUnit()).toBe("f");
    expect(await Bun.file(TEST_SETTINGS_FILE).json()).toEqual({ unit: "f" });
  });

  it("migrates the legacy unit and leaves the legacy file untouched", async () => {
    await Bun.write(TEST_LEGACY_FILE, JSON.stringify({ unit: "f" }));
    const legacyContent = await Bun.file(TEST_LEGACY_FILE).text();
    expect(await loadUnit()).toBe("f");
    expect(await Bun.file(TEST_SETTINGS_FILE).json()).toEqual({ unit: "f" });
    expect(await Bun.file(TEST_LEGACY_FILE).text()).toBe(legacyContent);
  });

  it("falls back to celsius for an invalid unit value", async () => {
    await Bun.write(TEST_SETTINGS_FILE, JSON.stringify({ unit: "k" }));
    expect(await loadUnit()).toBe("c");
  });

  it("falls back to celsius when the unit field is missing", async () => {
    await Bun.write(TEST_SETTINGS_FILE, JSON.stringify({}));
    expect(await loadUnit()).toBe("c");
  });

  it("falls back to celsius on corrupt json", async () => {
    await Bun.write(TEST_SETTINGS_FILE, "{oops");
    expect(await loadUnit()).toBe("c");
  });
});
