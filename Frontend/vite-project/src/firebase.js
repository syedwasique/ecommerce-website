// src/firebaseConfig.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFxZ8va0lxdw6Ev4MrAGFaTz6WcsEaDV4",
  authDomain: "ecommerce-ff3f4.firebaseapp.com",
  projectId: "ecommerce-ff3f4",
  storageBucket: "ecommerce-ff3f4.firebasestorage.app",
  messagingSenderId: "412714981428",
  appId: "1:412714981428:web:fbffd08af7923201921261"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Export signInWithPopup method
const signInWithPopup = (provider) => auth.signInWithPopup(provider);

export { app, auth, googleProvider, signInWithPopup };