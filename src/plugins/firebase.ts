import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import router from "@/router";
import { computed } from "vue";
import Recipe, { recipeConverter } from "@/components/Models/Recipe.class";

const firebaseConfig = {
  apiKey: "AIzaSyCPt03Bp5UBVXn72EVSWNAhvt4u0NI2m5M",
  authDomain: "recipes-petzi.firebaseapp.com",
  databaseURL:
    "https://recipes-petzi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "recipes-petzi",
  storageBucket: "recipes-petzi.appspot.com",
  messagingSenderId: "214936827568",
  appId: "1:214936827568:web:345c47274d065fe45c6d75",
  measurementId: "G-15T3BLM6BP",
};

const firebaseApp = initializeApp(firebaseConfig);
const fireBucket = getStorage(firebaseApp);
const fireAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const getCollection = async (name: string) => {
  const docRef = query(collection(db, name)); // hier stand recipes
  return await getDocs(docRef);
};

export function logOut() {
  const auth = getAuth();
  signOut(auth).then(() => {
    router.push("/");
  });
}
export const user = computed(() => {
  let user = getAuth().currentUser;
  if (user) {
    return user;
  } else {
    onAuthStateChanged(getAuth(), (authUser) => {
      user = authUser;
    });
    return user;
  }
});

export async function getUserRecipe(): Promise<Recipe[]> {
  const userRecipes: Recipe[] = [];
  if (user.value) {
    const userid = user.value.uid;
    const collectionRef = collection(db, "test");
    console.info("get user recipes", userid, collectionRef);
    const q = query(
      collectionRef,
      where("createdBy", "==", userid)
    ).withConverter(recipeConverter);

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      if (doc.exists()) {
        // Convert to City object
        const r = doc.data();
        // Use a City instance method
        userRecipes.push(r);
      } else {
        console.log("No such document!");
      }
    });
  } else {
    console.info("noch kein user: ", user.value);
  }
  return userRecipes;
}

export { fireAuth, fireBucket, db, getCollection };

export default firebaseApp;
