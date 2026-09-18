import type { City } from "./City";

export interface CitiesState {
  cities: City[];
  defaultCityId: number | null;
}
