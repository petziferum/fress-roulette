<template>
  <v-badge
    v-for="item in filterItems"
    :key="item"
    class="ma-1"
    :value="showBadge(item)"
    :content="getBadgeCount(item)"
    overlap
  >
    <v-chip
      filter
      :input-value="isSelected(item)"
      :color="isSelected(item) ? 'primary' : ''"
      @click="toggle(item)"
    >
      {{ item }}
      <v-icon class="pr-2 success--text" right>{{ toIcon(item) }}</v-icon>
    </v-chip>
  </v-badge>
  {{ selected }}
</template>
<script setup lang="ts">
const props = defineProps(["statusCount", "filterItems"]);
const selected = defineModel<[string]>();

function isSelected(item) {
  console.log(item);
  return selected.value.indexOf(item) !== -1;
}

function toIcon(item) {
  if (item === "AVAILABLE") {
    return "mdi-storefront";
  } else if (item === "ORDER") {
    return "mdi-truck";
  } else if (item === "INSTOCK") {
    return "mdi-book";
  } else return "mdi-delete-restore";
}

function showBadge(item) {
  //status = ProductStatus
  //return [ProductStatus.AVAILABLE, ProductStatus.INSTOCK].includes(status)
  return !selected.value.includes(item) && getBadgeCount(item) != "0";
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
  const index = selected.value.indexOf(productStatus);
  if (index !== -1) {
    selected.value.splice(index, 1);
  } else {
    selected.value.push(productStatus);
  }
}
</script>
<style scoped></style>
