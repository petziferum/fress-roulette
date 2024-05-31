import { defineStore } from "pinia";
import { ref, watch } from "vue";

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

export const useUserStore = defineStore("userStore", () => {
  const userFirestoreData = ref(null);
  const userLoggedIn = ref(false);
  const user = ref({});
  const userLoading = ref(false);
  const userError = ref("");

  watch(userFirestoreData, (newVal) => {
    if (newVal) {
      user.value = newVal;
      userLoggedIn.value = true;
    }
  });

  function setUserFirestoreData(data) {
    userFirestoreData.value = data;
  }
  return {
    userFirestoreData,
    user,
    userError,
    userLoggedIn,
    userLoading,
    setUserFirestoreData,
  };
});
