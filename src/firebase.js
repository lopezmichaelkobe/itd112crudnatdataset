// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKe4GVvzlbW5UKgbUJ1eJZJeMPf7i0LYI",
  authDomain: "itd112lab1lopez.firebaseapp.com",
  projectId: "itd112lab1lopez",
  storageBucket: "itd112lab1lopez.appspot.com",
  messagingSenderId: "472154764985",
  appId: "1:472154764985:web:1ddcd91c6b30070b3b0d68",
  measurementId: "G-PHBQ7QS2BL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export {db};