<template>
  <v-table>
    <thead>
      <tr>
        <th>name</th>
        <th>Rating</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.name">
        <td>{{ item.recipeName }}</td>
        <td>{{ item.rating }}</td>
      </tr>
    </tbody></v-table
  >
</template>
<script setup lang="ts">
import { ref } from "vue";
defineProps({items: Array});

</script>
<style scoped></style>
