// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFtTJDutMpT2WBaFXqGtB5UlU79WLZOeo",
  authDomain: "inventort-react-app.firebaseapp.com",
  projectId: "inventort-react-app",
  storageBucket: "inventort-react-app.appspot.com",
  messagingSenderId: "1033460805380",
  appId: "1:1033460805380:web:49fa78a90c1617a33aaa51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
