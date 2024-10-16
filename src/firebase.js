// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1_dpxExAl9rjq9WoXJQ8WOwbZ_q1z8uQ",
  authDomain: "itd112labact2lopez.firebaseapp.com",
  projectId: "itd112labact2lopez",
  storageBucket: "itd112labact2lopez.appspot.com",
  messagingSenderId: "644476366222",
  appId: "1:644476366222:web:b47b85a490b6ee205408df",
  measurementId: "G-9G745R2T0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export {db};