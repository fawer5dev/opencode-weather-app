export type Unit = "c" | "f";

export interface WeatherResponse {
  current?: {
    temperature_2m?: number;
  };
}
