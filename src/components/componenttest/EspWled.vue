<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          WLED
        </v-card-title>
        <v-btn @click="powerSwitch">on/off</v-btn>
        <v-btn @click="setEffect(4)">Effect</v-btn>
        <v-slider max="255" v-model="brightness" @end="setBrightness" />{{ brightness}}
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { ref } from "vue";

const power = ref(0);
const brightness = ref(125);
function powerSwitch(): void {
  console.log("powerSwitch", power.value);
  fetch("http://192.168.1.24/win&T=2&FX=2").then(() => {
    if (power.value == 0) {
      power.value = 1;
    } else {
      power.value = 0;
    }
  });
}

function setEffect(value: number): void {
  fetch("http://192.168.1.24/win&FX="+value);
};

function setBrightness(): void {
  console.log("setBrightness", brightness.value);
  fetch("http://192.168.1.24/win&A=" + brightness.value);
}
</script>
<style scoped></style>
