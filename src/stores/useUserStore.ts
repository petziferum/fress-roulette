import { defineStore } from "pinia";
import { ref, watch } from "vue";
import UserState from "@/stores/types/UserState.class";
import { getUserStateFromFirebase } from "@/plugins/firebase";

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
  const userState = ref<UserState>(UserState.createEmptyUserState());
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
    getUserStateFromFirebase(data.uid).then((user) => {
      userState.value = user;
    });
  }
  return {
    userFirestoreData,
    user,
    userState,
    userError,
    userLoggedIn,
    userLoading,
    setUserFirestoreData,
  };
});
