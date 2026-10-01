import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { TEST_SETTINGS_FILE, resetStorage, setAnswers } from "../helpers/setup";
import { captureConsoleLog } from "../helpers/consoleSpy";
import { openSettings } from "../../actions/settings";
import type { ConsoleCapture } from "../helpers/consoleSpy";

describe("openSettings", () => {
  let captured: ConsoleCapture;

  beforeEach(() => {
    resetStorage();
    captured = captureConsoleLog();
  });

  afterEach(() => {
    captured.restore();
  });

  it("switches to celsius and persists it", async () => {
    setAnswers("1");
    const unit = await openSettings("f");
    expect(unit).toBe("c");
    const plain = captured.plain();
    expect(plain).toContain("Current unit: °F");
    expect(plain).toContain("Unit set to °C.");
    expect(await Bun.file(TEST_SETTINGS_FILE).json()).toEqual({ unit: "c" });
  });

  it("switches to fahrenheit and persists it", async () => {
    setAnswers("2");
    const unit = await openSettings("c");
    expect(unit).toBe("f");
    expect(captured.plain()).toContain("Unit set to °F.");
    expect(await Bun.file(TEST_SETTINGS_FILE).json()).toEqual({ unit: "f" });
  });

  it("keeps the unit on an invalid choice", async () => {
    setAnswers("3");
    const unit = await openSettings("c");
    expect(unit).toBe("c");
    expect(captured.plain()).toContain("Invalid option.");
    expect(await Bun.file(TEST_SETTINGS_FILE).exists()).toBe(false);
  });
});
