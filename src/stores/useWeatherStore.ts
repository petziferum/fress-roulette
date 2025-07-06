import { defineStore } from "pinia";
import { ref } from "vue";

// TypeScript interface matching the Java model
interface Weather {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  lastUpdated: string;
}

export const useWeatherStore = defineStore("weatherStore", () => {
  const weatherData = ref<Weather | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchWeatherData() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("http://localhost:8060/weather/");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      weatherData.value = data;
    } catch (err) {
      console.error("Error fetching weather data:", err);
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      loading.value = false;
    }
  }

  return {
    weatherData,
    loading,
    error,
    fetchWeatherData,
  };
});