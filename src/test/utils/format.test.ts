import { describe, expect, it } from "bun:test";
import { cityLabel, unitSymbol } from "../../utils/format";

describe("unitSymbol", () => {
  it("returns °C for celsius", () => {
    expect(unitSymbol("c")).toBe("°C");
  });

  it("returns °F for fahrenheit", () => {
    expect(unitSymbol("f")).toBe("°F");
  });
});

describe("cityLabel", () => {
  it("joins admin1 and country into the region", () => {
    expect(cityLabel({ name: "Ottawa", admin1: "Ontario", country: "Canada" })).toBe(
      "Ottawa (Ontario, Canada)",
    );
  });

  it("skips an empty admin1", () => {
    expect(cityLabel({ name: "Ottawa", admin1: "", country: "Canada" })).toBe("Ottawa (Canada)");
  });

  it("skips an empty country", () => {
    expect(cityLabel({ name: "Ottawa", admin1: "Ontario", country: "" })).toBe("Ottawa (Ontario)");
  });

  it("returns only the name when the region is empty", () => {
    expect(cityLabel({ name: "Ottawa", admin1: "", country: "" })).toBe("Ottawa");
  });

  it("returns only the name when region fields are missing", () => {
    expect(cityLabel({ name: "Ottawa" })).toBe("Ottawa");
  });
});
