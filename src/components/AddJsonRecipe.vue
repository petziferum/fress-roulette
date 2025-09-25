<template>
  <v-dialog v-model="isOpen" max-width="700">
    <template #activator="{ props }">
      <v-btn v-bind="props" class="rainbow-button" width="100" elevation="0">
        <div class="floating-stars">
          <span class="star">⭐</span>
          <span class="star">✨</span>
          <span class="star">💫</span>
          <span class="star">⭐</span>
        </div>
        <v-icon size="x-large" class="mdi-creation">mdi-creation</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>JSON-Rezept hinzufügen</v-card-title>
      <v-card-subtitle
        >Füge hier ein JSON-Objekt ein, das der Recipe.class.ts Struktur
        entspricht.</v-card-subtitle
      >
      <v-card-text>
        <v-alert
          v-if="errorMessage"
          type="error"
          density="comfortable"
          class="mb-3"
          >{{ errorMessage }}</v-alert
        >
        <v-textarea
          v-model="jsonText"
          label="Recipe JSON"
          auto-grow
          rows="10"
          variant="outlined"
          :spellcheck="false"
        />
      </v-card-text>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title
            >JSON <v-spacer /><v-btn
              variant="text"
              color="primary"
              :disabled="copying"
              @click="copyToClipboard"
            >
              <v-icon start>mdi-content-copy</v-icon>
              {{ copied ? "Kopiert!" : "In Zwischenablage" }}
            </v-btn>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <span class="text-caption">
              {{ recipeJson }}
            </span>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="red" @click="onCancel">Abbrechen</v-btn>
        <v-btn variant="flat" color="green" :loading="saving" @click="onSave"
          >Speichern</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  convertRecipe,
  saveRecipeToFirestore,
} from "@/api/Recipeconverter.service.api";
import { useUserStore } from "@/stores/useUserStore";
import { slugifyString } from "@/common/scripts";

const isOpen = ref(false);
const jsonText = ref<string>("");
const errorMessage = ref<string | null>(null);
const saving = ref(false);
const userStore = useUserStore();
const recipeJson = ref({
  id: "",
  createdBy: {
    id: "",
    name: "",
  },
  time: "",
  imageSrc: "",
  additionalImages: [],
  description: "",
  recipeName: "",
  type: "",
  ingredients: [],
  recipeDescription: [],
  active: false,
  tags: [],
  rating: 0,
  difficulty: 0,
  meta: {
    changed: "",
    changedBy: {
      id: "",
      name: "",
    },
  },
});
const copied = ref(false);
const copying = ref(false);

async function copyToClipboard() {
  try {
    copying.value = true;
    await navigator.clipboard.writeText(
      JSON.stringify(recipeJson.value, null, 2)
    );
    console.log("✅ JSON erfolgreich in die Zwischenablage kopiert!");
    copying.value = false;
  } catch (err) {
    console.error("❌ Fehler beim Kopieren in die Zwischenablage:", err);
  }
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

async function onSave() {
  errorMessage.value = null;
  try {
    saving.value = true;
    let recipe = convertRecipe(jsonText.value);
    if (!recipe.createdBy && userStore?.user) {
      recipe.createdBy = {
        id: userStore.user.uid,
        name: userStore.user.displayName ?? "",
      } as any;
    }
    if (!recipe.time) {
      recipe.time = new Date();
    }
    const id = slugifyString(recipe.recipeName.substring(0, 128));
    recipe.id = id;
    await saveRecipeToFirestore(recipe);
    isOpen.value = false;
    jsonText.value = "";
  } catch (e: any) {
    errorMessage.value = e?.message ?? String(e);
  } finally {
    saving.value = false;
  }
}

function onCancel() {
  errorMessage.value = null;
  isOpen.value = false;
}
</script>

<style scoped>
.rainbow-button {
  position: relative;
  background: linear-gradient(
    45deg,
    #ff0000,
    #ff8000,
    #ffff00,
    #80ff00,
    #00ff80,
    #0080ff,
    #8000ff,
    #ff0080
  );
  background-size: 500% 500%;
  animation: rainbowShift 3s ease infinite;
  border-radius: 8px;
  border: none !important;
  overflow: hidden;
  margin-right: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.rainbow-button:hover {
  transform: scale(120%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.rainbow-button .v-btn__content {
  position: relative;
  z-index: 2;
}

.rainbow-button .mdi-creation {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0);
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes rainbowShift {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

@keyframes sparkle {
  0%,
  100% {
    transform: scale(1.2) rotate(0deg);
  }
  50% {
    transform: scale(1.9) rotate(17deg);
  }
}

/* Sternchen in den Ecken */
.rainbow-button::before,
.rainbow-button::after {
  content: "✨";
  position: absolute;
  font-size: 19px;
  border: none !important;
  z-index: 3;
  animation: twinkle 2s ease-in-out infinite;
}

.rainbow-button::before {
  top: 50px;
  left: 1px;
  animation-delay: 1s;
}

.rainbow-button::after {
  bottom: 22px;
  right: 12px;
  animation-delay: 1s;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.4);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.floating-stars {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.star {
  position: absolute;
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  animation: float 3s ease-in-out infinite;
}

.star:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}
.star:nth-child(2) {
  top: 30%;
  right: 15%;
  animation-delay: 0.5s;
}
.star:nth-child(3) {
  bottom: 15%;
  left: 15%;
  animation-delay: 1s;
}
.star:nth-child(4) {
  bottom: 10%;
  right: 20%;
  animation-delay: 1.5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-3px) rotate(180deg);
    opacity: 1;
  }
}
</style>
