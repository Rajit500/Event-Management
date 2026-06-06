 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signOut,
         onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc,
         getDoc, collection, addDoc,
         getDocs, query, where,
         deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAeVk9nGdGMc5KDCoO7sDEi6eDusKQ6Ri0",
    authDomain: "event-management-8e6fe.firebaseapp.com",
    projectId: "event-management-8e6fe",
    storageBucket: "event-management-8e6fe.firebasestorage.app",
    messagingSenderId: "395662060452",
    appId: "1:395662060452:web:aedbad82ef2ffbdc4d2f31"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signOut,
         onAuthStateChanged, doc, setDoc,
         getDoc, collection, addDoc,
         getDocs, query, where,
         deleteDoc, updateDoc };