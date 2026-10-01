import { afterEach, describe, expect, it } from "bun:test";
import { getWeather } from "../../api/weather";
import { forecastPayload } from "../helpers/fixtures";
import { installFetchMock, jsonResponse, restoreFetch } from "../helpers/fetchMock";

describe("getWeather", () => {
  afterEach(restoreFetch);

  it("returns the current temperature", async () => {
    const fetchMock = installFetchMock(() => jsonResponse(forecastPayload(21.5)));
    const temperature = await getWeather(45.41117, -75.69812, "c");
    expect(temperature).toBe(21.5);
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(`${url.origin}${url.pathname}`).toBe("https://api.open-meteo.com/v1/forecast");
    expect(url.searchParams.get("latitude")).toBe("45.41117");
    expect(url.searchParams.get("longitude")).toBe("-75.69812");
    expect(url.searchParams.get("current")).toBe("temperature_2m");
  });

  it("does not request a temperature unit for celsius", async () => {
    const fetchMock = installFetchMock(() => jsonResponse(forecastPayload(21.5)));
    await getWeather(45.41117, -75.69812, "c");
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(url.searchParams.has("temperature_unit")).toBe(false);
  });

  it("requests fahrenheit when the unit is f", async () => {
    const fetchMock = installFetchMock(() => jsonResponse(forecastPayload(70)));
    await getWeather(45.41117, -75.69812, "f");
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(url.searchParams.get("temperature_unit")).toBe("fahrenheit");
  });

  it("throws when the api responds with an error status", async () => {
    installFetchMock(() => new Response("boom", { status: 503 }));
    await expect(getWeather(45.41117, -75.69812, "c")).rejects.toThrow(
      "Forecast request failed (HTTP 503)",
    );
  });

  it("throws when the response has no temperature", async () => {
    installFetchMock(() => jsonResponse({ current: {} }));
    await expect(getWeather(45.41117, -75.69812, "c")).rejects.toThrow(
      "The forecast response has no temperature",
    );
  });

  it("throws when the response has no current section", async () => {
    installFetchMock(() => jsonResponse({}));
    await expect(getWeather(45.41117, -75.69812, "c")).rejects.toThrow(
      "The forecast response has no temperature",
    );
  });
});
