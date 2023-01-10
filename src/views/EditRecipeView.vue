<template>
  <v-container>
    <v-card>
      <v-card-title>{{ recipe.recipeName }}</v-card-title>
      <v-card-subtitle
        >{{ recipe.id }} CreatedBy: {{ recipe.createdBy }}
        <div>Erstellt am: {{ recipe.time }}</div></v-card-subtitle
      >
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" color="success" @click="editMode = !editMode"
          >Bearbeiten</v-btn
        >
        <v-btn variant="outlined" color="blue" @click="saveUpdateRecipe"
          >Speichern</v-btn
        >
      </v-card-actions>
      <template v-if="!editMode">
        <v-card-text>
          Zutaten
          <v-row>
            <v-col cols="12" md="6">
              <v-table class="text-justify" density="comfortable">
                <tr>
                  <th class="py-5">Menge</th>
                  <th class="py-5">Zutat</th>
                </tr>
                <tr
                  v-for="(ingredient, i) in recipe.ingredients"
                  :key="ingredient.nr"
                >
                  <th>
                    <template v-if="editItem === i">
                      <v-form
                        ref="editIngredient"
                        @submit.prevent="editItem = null"
                      >
                        <v-text-field
                          class="mr-1"
                          label="Name"
                          variant="outlined"
                          density="compact"
                          v-model="recipe.ingredients[i].menge"
                        />
                      </v-form>
                    </template>
                    <template v-else>{{ ingredient.menge }} </template>
                  </th>
                  <td>
                    <template v-if="editItem == i">
                      <v-form
                        ref="editIngredient"
                        @submit.prevent="editItem = null"
                      >
                        <v-text-field
                          label="Name"
                          variant="outlined"
                          density="compact"
                          v-model="recipe.ingredients[i].name"
                          @click:append.prevent="editItem = null"
                          append-icon="mdi-content-save"
                        />
                      </v-form>
                    </template>
                    <template v-else>
                      {{ ingredient.name }}
                    </template>
                  </td>
                  <td>
                    <template v-if="editItem != i">
                      <v-btn variant="text" @click="editItem = i">
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <template v-else>
                      <v-btn variant="text" @click="editItem = null">
                        <v-icon small>mdi-cancel</v-icon>
                      </v-btn>
                    </template>
                  </td>
                </tr>
              </v-table>
            </v-col>
            <v-col cols="12" md="6">
              <v-form @submit.prevent="addIngredient" ref="zutatForm">
                <v-row>
                  <v-col cols="1">
                    <v-icon left>mdi-tag-plus</v-icon>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      id="menge"
                      variant="outlined"
                      label="Menge"
                      :rules="filledRule"
                      name="quantity"
                      :placeholder="$vuetify.display.mdAndDown ? '' : 'Menge'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      id="name"
                      variant="outlined"
                      label="Zutat"
                      class="mx-2"
                      name="zutat"
                      :rules="filledRule"
                      placeholder="Zutat"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-btn variant="outlined" type="submit" height="70%"
                      ><v-icon>mdi-plus</v-icon></v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="item in recipe.recipeDescription"
              :key="item.nr"
            >
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <!--- Zubereitungsschritte -->
        <v-card-text>
          <v-card-title>Zubereitungsschritte</v-card-title>
          <v-row>
            <v-col>
              <v-sheet
                v-for="(step, i) in recipe.recipeDescription"
                :key="step.nr"
              >
                <v-row :key="i">
                  <v-col cols="3">
                    <v-skeleton-loader
                      type="image"
                      height="100"
                    ></v-skeleton-loader>
                  </v-col>
                  <v-col cols="9">
                    <v-textarea
                      background-color="white"
                      height="100px"
                      outlined
                      :label="step.nr + '. Schritt'"
                      v-model="step.text"
                      :rules="filled"
                      :append-icon="step.nr > 1 ? 'mdi-minus' : ''"
                      @click:append="deleteStep(i)"
                    ></v-textarea>
                    <v-btn
                      v-if="step.nr != recipe.recipeDescription.length"
                      color="white"
                      height="18px"
                      class="rounded-b-pill"
                      tile
                      style="position: relative; top: -35px; left: 45%"
                      @click="addStepBetween(step.nr)"
                      :key="`${i}+addStep`"
                      >+
                    </v-btn>
                  </v-col>
                </v-row>
              </v-sheet>
              <v-btn @click="addStep">Schritt hinzufügen</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </template>

      <!-- Im Editmode  -->
      <template v-else>
        <v-form ref="recipeForm">
          <v-row>
            <v-col>
              <v-text-field label="Rezept Name" v-model="recipe.recipeName" />
            </v-col>
          </v-row>
        </v-form>
      </template>
      {{ recipe }}
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import Recipe from "@/components/Models/Recipe.class";
import RecipeServiceApi from "@/api/recipeServiceApi";
import { VForm } from "vuetify/lib/components/index";

const editMode = ref(false);
const recipe = ref<Recipe>(Recipe.createEmtptyRecipe());
const router = useRoute();
const zutatForm = ref<typeof VForm>();
const filledRule = ref([(v) => v != null || "Name muss ausgefüllt sein"]);
const editItem = ref(null);

function loadRecipe(): void {
  RecipeServiceApi.getSingleRecipe(useRoute().params.id as string).then(
    (response) => {
      if (response) {
        const editRecipe = Recipe.createEmtptyRecipe();
        console.log(
          "edit: ",
          editRecipe,
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

async function addIngredient(): Promise<void> {
  console.clear();
  const { valid } = await (zutatForm.value || VForm).validate();
  console.log("valid", valid);
  if (valid) {
    let tempNr = 0;
    const newItem = {
      nr: tempNr + 1,
      menge: zutatForm.value?.quantity.value,
      name: zutatForm.value?.zutat.value,
    };
    if (recipe.value.ingredients != null) {
      newItem.nr = recipe.value.ingredients!.length + 1;
      console.log("add ingredient", newItem, "mit Nummer", tempNr);
      recipe.value.ingredients!.push(newItem);
    } else {
      recipe.value.ingredients = [];
      recipe.value.ingredients[tempNr] = newItem;
    }
    zutatForm.value?.reset();
  }
}

function addStep() {
  if (recipe.value.recipeDescription.length <= 9) {
    const x = { nr: recipe.value.recipeDescription.length + 1, text: "", img: "" };
    recipe.value.recipeDescription.push(x);
  }
}

function addStepBetween(nr: number) {
  console.log("nr", nr);
  console.log("länge", recipe.value.recipeDescription.length);
  recipe.value.recipeDescription.splice(nr, 0, { nr: nr + 1, text: "", img:"" });
  for (let i = nr + 1; i < recipe.value.recipeDescription.length; i++) {
    console.log("bearbeiten ", i);
    recipe.value.recipeDescription[i].nr += 1;
  }
  console.log(recipe.value.recipeDescription[nr]);
}

function deleteStep(n: number) {
  if (recipe.value.recipeDescription.length > 1) {
    recipe.value.recipeDescription.splice(n, 1);
  }
}

function saveUpdateRecipe(): void {
  recipe.value.active = false;
  console.info("save", recipe.value);
  RecipeServiceApi.updateRecipe(recipe.value).then((antwort) => {
    console.log("gespeichert", antwort);
  });
}

onBeforeMount(() => {
  loadRecipe();
  recipe.value.id = router.params.id as string;
});
</script>

<style scoped></style>
