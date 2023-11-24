import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import router from "@/router";
import { computed } from "vue";
import Recipe, { recipeConverter } from "@/components/Models/Recipe.class";
import { userStore } from "@/stores/userStore";

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
  const docRef = query(collection(db, name));
  return getDocs(docRef);
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
    console.log("user eingelogged", user.uid);
    getUserFirestoreData(user.uid);
    return user;
  } else {
    onAuthStateChanged(getAuth(), (authUser) => {
      console.info("authstatechanged", authUser);
      user = authUser;
      getUserFirestoreData(user!.uid);
    });
    return user;
  }
});

export const registerWithGoogle = () => {
  const userState = userStore();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      getUserFirestoreData(user.uid);
      router.push("/user/dashboard");
    })
    .catch((error) => {
      console.error("Fehler", error.message);
      userState.userError = error.message;
    });
};

export const getUserFirestoreData = async (userId: string) => {
  const userState = userStore();
  console.info("getUserFirestoreData", userId);

  const userStoreRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userStoreRef);
  if (userDocSnap.exists()) {
    const d = userDocSnap.data();
    const data = {
      email: d.email,
      firstName: d.firstName,
      lastName: d.lastName,
      lastLogin: d.lastLogin,
      recipes: d.recipes,
      id: d.id,
      userName: d.userName,
    };
    console.log("user store data: ", data);
    userState.userFirestoreData = data;
    console.log(
      "userFirestoreData aus firebase.ts",
      userState.userFirestoreData
    );
  } else {
    console.log("user wurde nicht gefunden", userId);
  }
};

export async function getUserRecipe(): Promise<Recipe[]> {
  const COLLECTION_NAME = "reipes";
  const userRecipes: Recipe[] = [];
  if (user.value) {
    const userid = user.value.uid;
    const collectionRef = collection(db, COLLECTION_NAME);
    console.info("get user recipes", userid, collectionRef);
    const q = query(
      collectionRef,
      where("createdBy.id", "==", userid)
    ).withConverter(recipeConverter);

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      console.log("rezepte:", doc);
      if (doc.exists()) {
        // Convert to Recipe object
        const r = doc.data();
        // Use a Recipe instance method
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
