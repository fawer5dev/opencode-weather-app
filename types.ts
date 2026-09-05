export interface City {
  id: number;
  name: string;
  country: string;
  admin1: string;
  latitude: number;
  longitude: number;
}

export type Unit = "c" | "f";

export interface AppData {
  cities: City[];
  defaultCityId: number | null;
  unit: Unit;
}

export interface GeocodingResult {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
