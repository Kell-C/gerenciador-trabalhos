// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // Certifique-se de importar corretamente o getAuth

// Substitua com suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbFZmdPgCYJdJijy37BDwterrDPNgpLng",
  authDomain: "gerenciador-trabalhos.firebaseapp.com",
  databaseURL: "https://gerenciador-trabalhos-default-rtdb.firebaseio.com",
  projectId: "gerenciador-trabalhos",
  storageBucket: "gerenciador-trabalhos.appspot.com",
  messagingSenderId: "392899809287",
  appId: "1:392899809287:web:df9183c3cf34145b815aa2",
  measurementId: "G-M83QHPHBLX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
// Inicializa o Realtime Database

export { db, auth };
