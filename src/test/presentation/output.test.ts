import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { printCityList, printError, printInfo, printWeather } from "../../presentation/output";
import { captureConsoleLog } from "../helpers/consoleSpy";
import { makeCity, makeMadrid } from "../helpers/fixtures";
import type { ConsoleCapture } from "../helpers/consoleSpy";

describe("output", () => {
  let captured: ConsoleCapture;

  beforeEach(() => {
    captured = captureConsoleLog();
  });

  afterEach(() => {
    captured.restore();
  });

  describe("printWeather", () => {
    it("prints the city and its temperature in celsius", () => {
      printWeather(makeCity(), 21.5, "c");
      const plain = captured.plain();
      expect(plain).toContain("Weather in Ottawa (Ontario, Canada)");
      expect(plain).toContain("Temperature: 21.5°C");
    });

    it("prints the temperature with the fahrenheit symbol", () => {
      printWeather(makeCity(), 70, "f");
      expect(captured.plain()).toContain("Temperature: 70°F");
    });

    it("prints a separator line above and below the report", () => {
      printWeather(makeCity(), 21.5, "c");
      const lines = captured.lines();
      expect(lines[0]).toContain("───");
      expect(lines[lines.length - 1]).toContain("───");
    });
  });

  describe("printCityList", () => {
    it("numbers the cities and marks the default one", () => {
      printCityList([makeCity(), makeMadrid()], 7);
      const plain = captured.plain();
      expect(plain).toContain("1. Ottawa (Ontario, Canada)");
      expect(plain).toContain("2. Madrid (Madrid, Spain) (default)");
    });

    it("does not mark any city when there is no default", () => {
      printCityList([makeCity()], null);
      expect(captured.plain()).not.toContain("(default)");
    });
  });

  it("printInfo prefixes the message with indentation", () => {
    printInfo("Saved.");
    const line = captured.lines()[0];
    expect(line).toBe("  Saved.");
  });

  it("printError prefixes the message with [ERROR]", () => {
    printError("Boom.");
    expect(captured.lines()[0]).toBe("  [ERROR] Boom.");
  });
});
