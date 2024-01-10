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
  {{ props.selected }}
  count: {{ props.statusCount }}
</template>
<script setup lang="ts">

const props = defineProps(["selected", "statusCount", "filterItems"]);

function isSelected(item) {
  console.log(item);
  return props.selected.indexOf(item) !== -1;
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
  return !props.selected.includes(item) && getBadgeCount(item) != "0";
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
