import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAQnPwCSfxQftT2WI8c5cf8oIBbhAmWK6Q",
    authDomain: "habitad-para-la-humanidad.firebaseapp.com",
    projectId: "habitad-para-la-humanidad",
    storageBucket: "habitad-para-la-humanidad.firebasestorage.app",
    messagingSenderId: "337876665141",
    appId: "1:337876665141:web:239d6ae37273d3cb87827c"
};

// Evita inicializaciones duplicadas
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
