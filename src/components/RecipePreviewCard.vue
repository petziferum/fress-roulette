<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :elevation="isHovering ? 10 : 2"
        rounded="xl"
        :class="isHovering ? 'base-card-hover' : 'base-card'"
        :color="isHovering ? 'blue' : 'white'"
        link
        @click="$emit('viewRecipe')"
      >
        <v-row no-gutters>
          <v-col cols="4">
            <v-img
              cover
              class="card-image"
              :width="isHovering ? '400px' : '300px'"
              :src="recipe.imageSrc"
            />
          </v-col>
          <v-col cols="8">
            <v-card-item>
              <v-card-title>{{ recipe.recipeName }}</v-card-title>
            </v-card-item>
            <v-card-text>
              <v-rating
                :model-value="recipe?.rating"
                active-color="yellow"
                length="10"
                size="30"
                half-increments
                readonly
                color="amber"
                background-color="grey lighten-2"
                class="mr-0"
              ></v-rating>
              {{ recipe.rating }}
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
                  Tags:
                  <p>
                    <v-chip-group>
                      <v-chip
                        v-for="i in recipe?.tags"
                        :key="i"
                        variant="outlined"
                        rounded="0"
                        size="small"
                        >{{ i }}</v-chip
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
              Rezept erstellt von:
              {{ recipe.createdBy.name }}
            </v-card-item>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-hover>
</template>

<script setup lang="ts">
import Recipe from "@/components/Models/Recipe.class";

defineProps({ recipe: Recipe });
const image = "src/assets/whisky.jpg";
</script>

<style scoped>
.base-card {
  margin: 2em;
}
.base-card-hover {
  margin: 2em;
  transition: all 0.3s ease-in-out;
  transform: scale(1.1);
  transform: translatey(-10px);
  box-shadow: 0 0 10px 10px rgba(70, 150, 255, 0.5) !important;
}
.card-image {
  height: 100%;
}
</style>
