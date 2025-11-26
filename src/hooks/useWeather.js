import { useEffect, useState } from "react";

const WEATHER_NEUTRAL = { status: "idle", weatherTag: "neutral" };

const deriveWeatherTag = (data) => {
  if (!data) return "neutral";
  const temp = data?.current?.temperature_2m;
  const rain = data?.current?.rain || data?.current?.precipitation || 0;
  const snow = data?.current?.snowfall || 0;

  if (snow > 0) return "snow";
  if (rain > 0.1) return "rain";
  if (typeof temp === "number") {
    if (temp > 24) return "hot";
    if (temp > 16) return "warm";
    if (temp > 6) return "cool";
    return "cold";
  }
  return "neutral";
};

export default function useWeather(location) {
  const [state, setState] = useState(WEATHER_NEUTRAL);

  useEffect(() => {
    let aborted = false;
    if (!location) {
      setState(WEATHER_NEUTRAL);
      return;
    }

    const fetchWeather = async () => {
      setState({ status: "loading", weatherTag: "neutral" });
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?count=1&name=${encodeURIComponent(
            location
          )}`
        );
        const geoJson = await geoRes.json();
        const first = geoJson?.results?.[0];
        if (!first?.latitude || !first?.longitude) {
          setState({ status: "error", weatherTag: "neutral" });
          return;
        }

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${first.latitude}&longitude=${first.longitude}&current=temperature_2m,rain,precipitation,snowfall`
        );
        const weatherJson = await weatherRes.json();
        if (aborted) return;
        setState({
          status: "success",
          weatherTag: deriveWeatherTag(weatherJson),
        });
      } catch (err) {
        if (aborted) return;
        setState({ status: "error", weatherTag: "neutral" });
      }
    };

    fetchWeather();

    return () => {
      aborted = true;
    };
  }, [location]);

  return state;
}
