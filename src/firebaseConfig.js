// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMes4ETkXbbuACC0-C727wtOu3E35ph-g",
  authDomain: "nihongo-app-6dba9.firebaseapp.com",
  projectId: "nihongo-app-6dba9",
  storageBucket: "nihongo-app-6dba9.firebasestorage.app",
  messagingSenderId: "892656268744",
  appId: "1:892656268744:web:e7be09f14c5c35c182fcfd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Services
export const auth = getAuth(app);
export const db = getFirestore(app);