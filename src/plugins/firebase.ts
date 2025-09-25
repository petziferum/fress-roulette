import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
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
import { useUserStore } from "@/stores/useUserStore";
import UserState from "@/stores/types/UserState.class";

export const COLLECTION_NAME = "recipes";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
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

// Helper function to get collection
const getCollection = async (name: string) => {
  const docRef = query(collection(db, name));
  return getDocs(docRef);
};

export function logOut() {
  signOut(fireAuth).then(() => {
    router.push("/");
  });
}

export const user = computed(() => {
  const currentUser = fireAuth.currentUser;
  if (currentUser) {
    console.log("user eingelogged", currentUser.uid);
    return currentUser;
  } else {
    console.log("user nicht eingelogged");
    return null;
  }
});

export const registerWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  const userStore = useUserStore();

  signInWithPopup(fireAuth, provider)
    .then((result) => {
      const user = result.user;
      getUserFirestoreData(user.uid);
      router.push("/user/dashboard");
    })
    .catch((error) => {
      console.error("Fehler", error.message);
      userStore.userError = error.message;
    });
};

export const getUserFirestoreData = async (userId: string) => {
  console.info("getUserFirestoreData", userId);
  const userStore = useUserStore();
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
    userStore.userFirestoreData = data;
    console.log(
      "userFirestoreData aus firebase.ts",
      userStore.userFirestoreData
    );
  } else {
    console.log("user wurde nicht gefunden", userId);
  }
};

export async function getUserRecipe(): Promise<Recipe[]> {
  const userRecipes: Recipe[] = [];
  if (user.value) {
    const userid = user.value.uid;
    const collectionRef = collection(db, COLLECTION_NAME);
    console.info("get user recipes", userid, collectionRef);
    if (userid === "qzkYAA74nXevBDXOGzHHXm0NJmq2") {
      const getall = await getDocs(
        collectionRef.withConverter(recipeConverter)
      );
      getall.forEach((doc) => {
        if (doc.exists()) {
          userRecipes.push(doc.data() as Recipe);
        }
      });
    } else {
      const q = query(
        collectionRef,
        where("createdBy.id", "==", userid)
      ).withConverter(recipeConverter);

      const docSnap = await getDocs(q);
      docSnap.forEach((doc) => {
        console.log("rezepte:", doc);
        if (doc.exists()) {
          userRecipes.push(doc.data());
        } else {
          console.log("No such document!");
        }
      });
    }
  } else {
    console.info("noch kein user: ", user.value);
  }
  return userRecipes;
}

export async function getUserStateFromFirebase(id: string): Promise<UserState> {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return new UserState(
      data.firstName,
      data.lastName,
      data.email,
      data.lastLogin,
      data.recipes,
      data.id,
      data.userName
    );
  } else {
    console.log("No such document!");
    return UserState.createEmptyUserState();
  }
}

export { fireAuth, fireBucket, db, getCollection };
export default firebaseApp;
