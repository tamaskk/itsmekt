// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtxy8vEb4HOF1AQCtJTJE_DCI-dzKuYuA",
  authDomain: "djkt-25556.firebaseapp.com",
  projectId: "djkt-25556",
  storageBucket: "djkt-25556.firebasestorage.app",
  messagingSenderId: "1046782325243",
  appId: "1:1046782325243:web:27c628dbb70e27f256db5e",
  measurementId: "G-MG9VP7C562"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize analytics on the client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const storage = getStorage(app);

export { storage };