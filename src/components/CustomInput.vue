<template>
  <v-text-field v-model="value" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["modelValue"]);
const emitValue = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emitValue("update:modelValue", value);
  },
});
</script>
