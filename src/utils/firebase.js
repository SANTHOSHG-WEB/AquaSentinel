import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDxbDncNNIfYuAIY3tnJDYjXZtcmLuAaNA",
    authDomain: "aqua-fa925.firebaseapp.com",
    databaseURL: "https://aqua-fa925-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "aqua-fa925",
    storageBucket: "aqua-fa925.firebasestorage.app",
    messagingSenderId: "24671990034",
    appId: "1:24671990034:web:28405436aae20b6e60c3cb",
    measurementId: "G-RXP4W066K9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
