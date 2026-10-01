import type { GeocodingResult } from "../../api/geocoding";
import type { City } from "../../types/City";

export function makeCity(overrides: Partial<City> = {}): City {
  return {
    id: 1,
    name: "Ottawa",
    country: "Canada",
    admin1: "Ontario",
    latitude: 45.41117,
    longitude: -75.69812,
    ...overrides,
  };
}

export function makeMadrid(): City {
  return makeCity({
    id: 7,
    name: "Madrid",
    admin1: "Madrid",
    country: "Spain",
    latitude: 40.4165,
    longitude: -3.70256,
  });
}

export function geocodingResult(overrides: Partial<GeocodingResult> = {}): GeocodingResult {
  return {
    id: 1,
    name: "Ottawa",
    country: "Canada",
    admin1: "Ontario",
    latitude: 45.41117,
    longitude: -75.69812,
    ...overrides,
  };
}

export function geocodingPayload(results: GeocodingResult[]): { results: GeocodingResult[] } {
  return { results };
}

export function forecastPayload(temperature: number): { current: { temperature_2m: number } } {
  return { current: { temperature_2m: temperature } };
}
