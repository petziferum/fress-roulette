<template>
  <v-card
    elevation="8"
    rounded="xl"
    class="base-card"
    link
    :to="'/recipe/view/' + recipe.id"
  >
    <v-img cover class="card-image" :src="image" />
    <v-card-item>
      <v-card-title>{{ recipe.recipeName }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-row align="center" class="mx-0">
        <v-rating
          v-model="recipe.rating"
          dense
          half-increments
          readonly
          color="amber"
          background-color="grey lighten-2"
          class="mr-2"
        ></v-rating>
      </v-row>
      <v-row>
        <v-col cols="12">
          Zutaten:
          <p>
            <v-chip-group>
              <v-chip
                v-for="i in recipe.ingredients"
                :key="i"
                variant="outlined"
                size="small"
                >{{ i.name }}</v-chip
              >
            </v-chip-group>
          </p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-item>
      <v-avatar size="30" class="mr-2">
        <v-icon color="grey">mdi-account-cowboy-hat</v-icon>
      </v-avatar>
      {{ recipe.createdBy }}
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import Recipe from "@/components/Models/Recipe.class";

const props = defineProps({recipe: Recipe});
const image = "src/assets/whisky.jpg";
</script>

<style scoped>
.base-card {
  margin: 1em;
  width: 300px;
}
.card-image {
  height: 200px;
}
</style>
