<template>
  <v-badge
    v-for="status in recipeTags"
    :key="status"
    class="ma-1"
    :value="showBadge(status)"
    bordered
    :content="getBadgeCount(status)"
    overlap
  >
    <v-chip
      filter
      :input-value="isSelected(status)"
      :color="isSelected(status) ? 'primary' : ''"
      @click="toggle(status)"
    >
      {{ status }}
      <v-icon class="pr-2 success--text" right>{{ toIcon(status) }}</v-icon>
    </v-chip>
  </v-badge>
</template>
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["selected", "statusCount"]);

const recipeTags = ref(["Deftig", "Abendessen", "Süß", "Vietnamesisch"]);

function isSelected(item) {
  return props.selected.indexOf(item) !== -1;
}

function toIcon(status) {
  if (status === "AVAILABLE") {
    return "mdi-storefront";
  } else if (status === "ORDER") {
    return "mdi-truck";
  } else if (status === "INSTOCK") {
    return "mdi-book";
  } else return "mdi-delete-restore";
}

function showBadge(status) {
  //status = ProductStatus
  //return [ProductStatus.AVAILABLE, ProductStatus.INSTOCK].includes(status)
  return !props.selected.includes(status) && getBadgeCount(status) != "0";
}

function getBadgeCount(s) {
  if (props.statusCount) {
    const statusCountResult = props.statusCount.get(s);
    if (statusCountResult === undefined) {
      return "0";
    } else {
      return statusCountResult;
    }
  }
}

function toggle(productStatus) {
  const index = props.selected.indexOf(productStatus);
  if (index !== -1) {
    props.selected.splice(index, 1);
  } else {
    props.selected.push(productStatus);
  }
}
</script>
<style scoped></style>
