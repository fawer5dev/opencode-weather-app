import type { City } from "../types/City";
import type { Unit } from "../types/Weather";

export function unitSymbol(unit: Unit): string {
  return unit === "c" ? "°C" : "°F";
}

export function cityLabel(city: City): string {
  const region = [city.admin1, city.country]
    .filter((part) => part.length > 0)
    .join(", ");
  return region.length > 0 ? `${city.name} (${region})` : city.name;
}
