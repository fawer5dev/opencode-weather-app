import { afterEach, describe, expect, it } from "bun:test";
import { geocodeCity } from "../../api/geocoding";
import { geocodingPayload, geocodingResult } from "../helpers/fixtures";
import { installFetchMock, jsonResponse, restoreFetch } from "../helpers/fetchMock";

describe("geocodeCity", () => {
  afterEach(restoreFetch);

  it("returns the results from the geocoding api", async () => {
    installFetchMock(() => jsonResponse(geocodingPayload([geocodingResult()])));
    const results = await geocodeCity("Ottawa");
    expect(results).toEqual([geocodingResult()]);
  });

  it("returns an empty array when there are no results", async () => {
    installFetchMock(() => jsonResponse({}));
    const results = await geocodeCity("Atlantis");
    expect(results).toEqual([]);
  });

  it("throws when the api responds with an error status", async () => {
    installFetchMock(() => new Response("server error", { status: 500 }));
    await expect(geocodeCity("Ottawa")).rejects.toThrow("Geocoding request failed (HTTP 500)");
  });

  it("sends the expected query parameters", async () => {
    const fetchMock = installFetchMock(() => jsonResponse(geocodingPayload([])));
    await geocodeCity("Buenos Aires");
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(`${url.origin}${url.pathname}`).toBe("https://geocoding-api.open-meteo.com/v1/search");
    expect(url.searchParams.get("name")).toBe("Buenos Aires");
    expect(url.searchParams.get("count")).toBe("5");
    expect(url.searchParams.get("language")).toBe("es");
    expect(url.searchParams.get("format")).toBe("json");
  });
});
