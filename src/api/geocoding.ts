const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export interface GeocodingResult {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

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
