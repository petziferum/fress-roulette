<template>
  <v-card
    elevation="8"
    rounded="xl"
    class="base-card"
    link
    @click="$emit('viewRecipe')"
  >
    <v-row no-gutters>
      <v-col cols="4">
        <v-img cover class="card-image" :src="recipe.imageSrc" />
      </v-col>
      <v-col cols="8">
        <v-card-item>
          <v-card-title>{{ recipe.recipeName }}</v-card-title>
        </v-card-item>
        <v-card-text>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="recipe?.rating"
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
              <v-chip
                size="small"
                v-for="t in recipe?.tags"
                :key="t"
                class="mr-1"
                >{{ t }}</v-chip
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              Zutaten:
              <p>
                <v-chip-group>
                  <v-chip
                    v-for="i in recipe?.ingredients"
                    :key="i"
                    variant="outlined"
                    rounded="0"
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
          {{ recipe.createdBy.name }}
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import Recipe from "@/components/Models/Recipe.class";

defineProps({ recipe: Recipe });
const image = "src/assets/whisky.jpg";
</script>

<style scoped>
.base-card {
  margin: 1em;
}
.card-image {
  height: 100%;
}
</style>
