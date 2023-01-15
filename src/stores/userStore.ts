import { defineStore } from "pinia";

export interface stateInterface {
  userFirestoreData: {
    email: string,
    firstName: string,
    lastName: string,
    lastLogin: Date,
    recipes: string[],
    id: string,
    userName: string,
  };
}

export const userStore = defineStore("userStore", {
  state: () =>
    ({
      userFirestoreData: {},
    } as stateInterface),
  actions: {
  },
  getters: {
    getStoreUser(state): any {
      return state.userFirestoreData;
    }
  },
});
