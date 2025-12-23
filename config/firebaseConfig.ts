import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDcy3f47YOFTm5Irknp1fyM-P80eDWudk",
  authDomain: "fruitfreshnessai-reactnative.firebaseapp.com",
  projectId: "fruitfreshnessai-reactnative",
  storageBucket: "fruitfreshnessai-reactnative.firebasestorage.app",
  messagingSenderId: "51386529168",
  appId: "1:51386529168:web:fed35d0b5701460b79ef15",
  measurementId: "G-3L6G8QP8WP"
};

const app = initializeApp(firebaseConfig);
// @ts-ignore
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
