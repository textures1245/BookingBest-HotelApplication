// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyB5rslJanCrFhBA2FJC0pW3rrj1bjIjROg",
  authDomain: "booking-best-application.firebaseapp.com",
  projectId: "booking-best-application",
  storageBucket: "booking-best-application.appspot.com",
  messagingSenderId: "640772910926",
  appId: "1:640772910926:web:4ee2c25416c7323627b81f",
  measurementId: "G-292YMQ03K8",
};

export const firebaseApp = initializeApp(firebaseConfig);
