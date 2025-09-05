// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL01nzWQoPSkKwvK59v6emSrzOdCT-QEw",
  authDomain: "workouttracker-19a8c.firebaseapp.com",
  projectId: "workouttracker-19a8c",
  storageBucket: "workouttracker-19a8c.appspot.com",
  messagingSenderId: "727827721935",
  appId: "1:727827721935:web:d0cb13fc374d95cc35d1ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services so App.js can use them
export { auth, db };
