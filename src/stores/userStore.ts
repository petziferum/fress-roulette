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

  function getStoreUser(): any {
    return userFirestoreData;
  }

  return { userFirestoreData, getStoreUser };
});
