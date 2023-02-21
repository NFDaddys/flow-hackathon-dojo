// JavaScript
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
apiKey: "AIzaSyBe2_mydq7MxewDn4RmrZw6IvuiZTy64vM",
authDomain: "valorpdsapp.firebaseapp.com",
projectId: "valorpdsapp",
storageBucket: "valorpdsapp.appspot.com",
messagingSenderId: "795252048936",
appId: "1:795252048936:web:6ee93f33f82d12cb4da11d"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export {db}
