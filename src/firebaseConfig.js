// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkHZLF0bz4bmx_d6rb3C3GXIS-VQWKypI",
  authDomain: "lofidle.firebaseapp.com",
  projectId: "lofidle",
  storageBucket: "lofidle.appspot.com",
  messagingSenderId: "340185945447",
  appId: "1:340185945447:web:30f882212758e084804bc2",
  measurementId: "G-K461462XS6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {
    analytics
}