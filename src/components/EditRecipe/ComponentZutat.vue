<template>
  <v-container>
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
                <v-form ref="editIngredient" @submit.prevent="editItem = null">
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
                <v-form ref="editIngredient" @submit.prevent="editItem = null">
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
    </v-row>
    <v-form @submit.prevent="addIngredient" ref="zutatForm">
      <v-row no-gutters class="mt-8">
        <v-col cols="4" xs="2" sm="2" lg="3">
          <v-text-field
            id="menge"
            ref="mengeField"
            variant="outlined"
            label="Menge"
            name="quantity"
            :placeholder="$vuetify.display.mdAndDown ? '' : 'Menge'"
          />
        </v-col>
        <v-col cols="8" xs="10" sm="10" lg="7">
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
        <v-col cols="12" xs="12" sm="12" lg="2" class="pb-2">
          <v-btn elevation="6" color="blue" height="60px" type="submit" block
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { VForm } from "vuetify/components";

const props = defineProps(["modelValue"]);
const emitValue = defineEmits(["update:modelValue", "add"]);
const filledRule = ref([(v) => v != null || "Name muss ausgefüllt sein"]);
const editItem = ref(null);
const zutatForm = ref<typeof VForm>();
const mengeField = ref(null);

const recipe = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emitValue("update:modelValue", value);
  },
});

async function addIngredient(): Promise<void> {
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
    await nextTick(() => mengeField.value.focus());
  }
}
</script>

<style scoped></style>
