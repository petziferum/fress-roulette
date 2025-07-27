<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-btn @click="loadPricetagList">
          <v-icon>mdi-refresh</v-icon>
          Load Products
        </v-btn>
      </v-card-title>
      <v-card-text>
        Berechne Betriebsdauer der Kühlbox mit einer 12 Volt Batterie: <br />
        <v-text-field label="Betteriegrösse in Ah" v-model="ah"></v-text-field
        ><br />
        <p>Bei {{ usableCapacityPercent }}% Batterieentladung.</p>
        <p>
          <v-btn @click="calculateOperationTime" class="mt-3" color="red"
            >Berechne</v-btn
          >
        </p>
        <div
          style="
            display: inline-flex;
            height: 50px;
            align-items: center;
            align-content: center;
            margin: 10px;
          "
        >
          <span class="mr-4">Betriebsdauer:</span>
          <div class="text-blue-accent-2 text-h4" v-if="!loading">
            {{ loading ? "..." : betriebsdauer }}
          </div>
          <div class="text-blue-accent-2 text-h6" v-else>
            <v-icon>mdi-loading mdi-spin</v-icon>
          </div>
          <span class="text-blue-accent-2 text-h4 ml-2">Std</span>
        </div>
      </v-card-text>
      <v-card-text>
        <v-row v-for="(item, index) in pricetagList" :key="index">
          <v-col cols="5">
            <tr>
              <th style="text-align: left; min-width: 200px;">Name</th>
              <td>{{ item.productName }}</td>
            </tr>
            <tr>
              <th style="text-align: left">Beschreibung</th>
              <td>{{ item.description }}</td>
            </tr>
            <tr>
              <th style="text-align: left">Preise</th>
              <td>
                <div class="d-flex">
                  <v-chip v-for="(e, i) in item.entries" :key="i" class="mx-1">
                    {{ getDate(e.date) }} {{ e.amount }}g {{ e.location }}
                    {{ e.price }}€
                  </v-chip>
                </div>
              </td>
            </tr></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { useDevStore } from "@/components/componenttest/devStore";
import { ref } from "vue";
import Pricetag from "@/components/pricetag/Pricetag";
import { usePricetagStore } from "@/stores/PricetagStore";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const devStore = useDevStore();
const pricetagStore = usePricetagStore();
const pricetagList = ref([]);
const ah = ref(0);
const batteryVoltage = 12.8;
const averagePowerWatts = 13.33; //durchschnittlicher Verbrauch bei 40W/15min für 5min.
const loading = ref(false);
const betriebsdauer = ref(0);
const usableCapacityPercent = ref(90);
const DEFAULT_DATE_FORMAT = "dd.MM.yyyy";

const loadPricetagList = () => {
  pricetagStore.loadAllProducts().then(() => {
    pricetagList.value = pricetagStore.getAllProducts;
  });
};
function calculateOperationTime() {
  const batteryWh =
    ah.value * batteryVoltage * (usableCapacityPercent.value / 100);
  betriebsdauer.value = 0;
  const operationTimeHours = batteryWh / averagePowerWatts;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    betriebsdauer.value = Math.floor(operationTimeHours);
  }, 1000);
}

const getDate = (timestamp: { seconds: number }): string => {
  const date = new Date(timestamp.seconds * 1000); // Firebase Timestamp zu Date konvertieren
  return format(date, DEFAULT_DATE_FORMAT, { locale: de });
};
</script>
<style scoped></style>
