import { defineStore } from "pinia";
import { ref } from "vue";

export interface stateInterface {
  userFirestoreData: {
    email: string;
    firstName: string;
    lastName: string;
    lastLogin: Date;
    recipes: string[];
    id: string;
    userName: string;
  };
}

export const userStore = defineStore("userStore", () => {
  const userFirestoreData = ref({});
  const user = ref({});
  const userLoading = ref(false);
  const userError = ref("");

  function getStoreUser(): any {
    return userFirestoreData;
  }

  return { userFirestoreData, userError , getStoreUser };
});
