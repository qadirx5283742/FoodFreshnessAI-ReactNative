import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACXBnUm4wwk4hEKWkDsi-GYmQGXjSUi3E",
  authDomain: "foodfreshnessai-reactnative.firebaseapp.com",
  projectId: "foodfreshnessai-reactnative",
  storageBucket: "foodfreshnessai-reactnative.firebasestorage.app",
  messagingSenderId: "959084930434",
  appId: "1:959084930434:web:1aaf8b21a53f5a40929b9b",
  measurementId: "G-YF22VW491X"
};

const app = initializeApp(firebaseConfig);
// @ts-ignore
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
