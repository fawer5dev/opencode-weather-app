import type { GeocodingResult, Unit } from "./types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function geocodeCity(name: string): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name,
    count: "5",
    language: "es",
    format: "json",
  });
  const res = await fetch(`${GEOCODING_URL}?${params}`);
  if (!res.ok) {
    throw new Error(`Geocoding request failed (HTTP ${res.status})`);
  }
  const data = (await res.json()) as { results?: GeocodingResult[] };
  return data.results ?? [];
}

export async function getWeather(latitude: number, longitude: number, unit: Unit): Promise<number> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m",
  });
  if (unit === "f") {
    params.set("temperature_unit", "fahrenheit");
  }
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) {
    throw new Error(`Forecast request failed (HTTP ${res.status})`);
  }
  const data = (await res.json()) as { current?: { temperature_2m?: number } };
  const temperature = data.current?.temperature_2m;
  if (typeof temperature !== "number") {
    throw new Error("The forecast response has no temperature");
  }
  return temperature;
}
