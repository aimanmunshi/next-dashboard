// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSz_jgs2t6RJ4gOE4x1-JFo-nwGbUSzu8",
  authDomain: "next-dashboard-app-2c496.firebaseapp.com",
  projectId: "next-dashboard-app-2c496",
  storageBucket: "next-dashboard-app-2c496.appspot.com",
  messagingSenderId: "87894063895",
  appId: "1:87894063895:web:659b6b0c476edb9c59d552",
  measurementId: "G-HS27JEJCLK"
}

// Prevent re-initialization in dev/hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const db = getFirestore(app);

// Export auth service to use in login/signup
export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider();

export const githubProvider = new GithubAuthProvider();

export { db};