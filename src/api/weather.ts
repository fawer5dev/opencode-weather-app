import type { Unit, WeatherResponse } from "../types/Weather";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(
  latitude: number,
  longitude: number,
  unit: Unit,
): Promise<number> {
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
  const data = (await res.json()) as WeatherResponse;
  const temperature = data.current?.temperature_2m;
  if (typeof temperature !== "number") {
    throw new Error("The forecast response has no temperature");
  }
  return temperature;
}
