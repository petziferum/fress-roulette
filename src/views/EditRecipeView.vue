<template>
  <v-container>
    <v-card>
      <v-card-title>{{ recipe.recipeName }}</v-card-title>
      <v-card-subtitle
        >{{ recipe.id }} CreatedBy: {{ recipe.createdBy }}</v-card-subtitle
      >
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" color="success" @click="editMode = !editMode"
          >Bearbeiten</v-btn
        >
      </v-card-actions>
      <template v-if="!editMode">
        <v-card-text>
          Zutaten
          <v-row>
            <v-col cols="12" md="6">
              <v-table class="text-justify" density="comfortable">
                <tr>
                  <th>Menge</th>
                  <th>Zutat</th>
                </tr>
                <tr
                  v-for="ingredient in recipe.ingredients"
                  :key="ingredient.nr"
                >
                  <th>{{ ingredient.menge }}</th>
                  <td>{{ ingredient.name }}</td>
                </tr>
              </v-table>
              <!--<v-list>
                <v-row>
                  <v-col cols="4"><b>Menge</b></v-col>
                  <v-col cols="8"><b>Zutat</b></v-col>
                </v-row>
                <v-divider></v-divider>
                <transition-group name="slide">
                  <template
                    v-for="(item, i) in recipe.ingredients"
                    :key="item.nr"
                  >
                    <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
                    <v-list-item class="slide">
                      <v-list-item-title>
                        <v-row>
                          <v-col cols="3">
                            {{ item.menge }}
                          </v-col>
                          <v-col cols="9">
                            <template v-if="i == editItem">
                              <v-form
                                ref="editIngredient"
                                @submit.prevent="editItem = null"
                              >
                                <v-text-field
                                  label="Name"
                                  v-model="recipe.ingredients[i].name"
                                  @click:append.prevent="editItem = null"
                                  append-icon="mdi-content-save"
                                ></v-text-field>
                              </v-form>
                              <v-btn x-small color="red" @click="deleteItem(i)"
                                >delete
                              </v-btn>
                            </template>
                            <template v-else>
                              {{ item.name }}
                              <div class="float-right" v-if="editMode">
                                <v-btn
                                  class="mr-1"
                                  x-small
                                  @click="editItem = i"
                                  >edit
                                </v-btn>
                              </div>
                            </template>
                          </v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </transition-group>
              </v-list>
              -->
            </v-col>
            <v-col cols="12" md="6">
              <v-form @submit.prevent="addIngredient" ref="zutatForm">
                <v-row no-gutters>
                  <v-col cols="1">
                    <v-icon left>mdi-tag-plus</v-icon>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      id="menge"
                      variant="outlined"
                      label="Menge"
                      style="width: 100px"
                      name="menge"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      id="name"
                      variant="outlined"
                      label="Zutat"
                      class="mx-2"
                      name="name"
                      placeholder="Zutat"
                    >
                      <template v-slot:clear>
                        <v-btn
                          variant="outlined"
                          @click="addIngredient"
                          style="top: -8px; height: 100%; width: 100%"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        {{ recipe }}
      </template>
      <template v-else>
        <v-form ref="recipeForm">
          <v-row>
            <v-col>
              <v-text-field label="Rezept Name" v-model="recipe.recipeName" />
            </v-col>
          </v-row>
        </v-form>
      </template>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import Recipe from "@/components/Models/Recipe.class";
import RecipeServiceApi from "@/api/recipeServiceApi";
import {VForm} from "vuetify/lib/components/index";

const editMode = ref(false);
const recipe = ref<Recipe>(Recipe.createEmtptyRecipe());
const router = useRoute();
const zutatForm = ref<typeof VForm>();

function loadRecipe(): void {
  RecipeServiceApi.getSingleRecipe(useRoute().params.id as string).then(
    (response) => {
      if (response) {
        console.log(
          "response recipe id:",
          response.id,
          "params id",
          router.params.id,
          "same?",
          response.id === router.params.id
        );
        recipe.value = response!;
      }
    }
  );
}

function addIngredient(event): void {
  console.clear();
  console.log("Add Ingredient", zutatForm.value?.items);
  let tempNr = 0;
  if (recipe.value) {
    recipe.value.ingredients!.forEach((element) => {
      if (tempNr < element.nr) {
        tempNr = element.nr;
      }
    });
    const newItem = {
      nr: tempNr + 1,
      menge: event.target.menge.value,
      name: event.target.name.value,
    };

    console.log("add ingredient", newItem, "mit Nummer", tempNr);
    recipe.value.ingredients!.push(newItem);
    zutatForm.value.reset();
  }
}

onBeforeMount(() => {
  loadRecipe();
  recipe.value.id = router.params.id as string;
});
</script>

<style scoped></style>
