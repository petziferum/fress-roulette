<template>
  <div class="about">
    <v-row>
      <v-col cols="12" style="text-align: center">
        <h1 class="ma-5">User Dashboard</h1>
        <v-spacer />
        <v-btn @click="logOut">Logout</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="4" class="align-center">
        <v-img :src="user.photoURL" width="120px"></v-img>
      </v-col>
      <v-col cols="12" md="4">
        <v-table density="compact">
          <tr v-for="(value, key) in user" :key="key">
            <th>
              {{ key }}
            </th>
            <td>
              {{ value }}
            </td>
          </tr>
        </v-table>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { logOut, user } from "@/plugins/firebase";
</script>
<style></style>
