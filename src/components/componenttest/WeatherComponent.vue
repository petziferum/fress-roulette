<template>
  <v-card>
    <v-card-title>Wetter-Information</v-card-title>
    <v-card-text>
      <v-btn color="primary" @click="fetchWeatherData" :loading="loading">
        Get Weather Data
      </v-btn>

      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>

      <div v-if="weatherData" class="mt-4">
        <h3>{{ weatherData.location }}</h3>
        <div class="d-flex align-center">
          <div>
            <h4>Weather</h4>
            <p>{{ weatherData.description }}</p>
          </div>
        </div>

        <v-row class="mt-2">
          <v-col cols="6">
            <v-card variant="outlined">
              <v-card-title>Temperature</v-card-title>
              <v-card-text>
                <p>Aktuell: {{ weatherData.temperature }}°C</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card variant="outlined">
              <v-card-title>Details</v-card-title>
              <v-card-text>
                <p v-if="weatherData.humidity !== undefined">
                  Luftfeuchtigkeit: {{ weatherData.humidity }}%
                </p>
                <p v-if="weatherData.pressure !== undefined">
                  Luftdruck: {{ weatherData.pressure }} hPa
                </p>
                <p v-if="weatherData.windSpeed !== undefined">
                  Wind: {{ weatherData.windSpeed }} m/s
                </p>
                <p v-if="weatherData.windDirection !== undefined">
                  Windrichtung: {{ weatherData.windDirection }}
                </p>
                <p v-if="weatherData.lastUpdated !== undefined">
                  Aktualisiert am:
                  {{ format(weatherData.lastUpdated, "dd.MM.yyyy HH:mm") }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { useWeatherStore } from "@/stores/useWeatherStore";
import { storeToRefs } from "pinia";

const weatherStore = useWeatherStore();
const { weatherData, loading, error } = storeToRefs(weatherStore);
const { fetchWeatherData } = weatherStore;
</script>

<style scoped></style>
