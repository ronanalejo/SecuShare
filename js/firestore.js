import { db } from './firebase.js';
import { doc, setDoc, getDoc, getDocs, query, where, collection } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

export const createUserProfile = async (userId, userData) => {
    const userRef = doc(db, "users", userId);
    try {
        await setDoc(userRef, userData);
        console.log("User profile created successfully.");
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

export const isEmailRegistered = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

export const fetchUserProfile = async (userId) => {
    const userRef = doc(db, "users", userId);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};
