<template>
  <v-card>
    <v-img :src="recipe.img" width="10%" />
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title
          >{{ recipe.recipeName }}
          <v-btn :to="`/recipe/view/` + recipe.recipeName">Zum Rezept</v-btn
        ></v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col>
              {{ recipe.id }}
            </v-col>
            <v-col>
              {{ recipe.createdBy }}
            </v-col>
            <v-col cols="12">
              {{ recipe.ingredients }}
            </v-col>
            <v-col>
              {{ recipe.description }}
            </v-col>
            <v-col>
              {{ recipe.tags }}
            </v-col>
          </v-row>
          <div>{{ recipe }}</div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps(["recipe"]);
</script>

<style scoped></style>
