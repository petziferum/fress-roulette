import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCPt03Bp5UBVXn72EVSWNAhvt4u0NI2m5M",
  authDomain: "recipes-petzi.firebaseapp.com",
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
const getCollection = async () => {
  const docRef = query(collection(db, "test")); // hier stand recipes
  return await getDocs(docRef);
};

export { fireAuth, fireBucket, db, getCollection };

export default firebaseApp;
