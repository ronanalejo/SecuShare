import { db, storage } from './firebase.js';
import { doc, getDoc, setDoc, query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

export const isEmailRegistered = async (email) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const createUserProfile = async (userId, userData, profilePicture) => {
  const userRef = doc(db, "users", userId);
  try {
    console.log("Setting user data:", userData);
    await setDoc(userRef, userData);
    if (profilePicture) {
      console.log("Uploading profile picture...");
      console.log("Storage object:", storage); // Check if storage is defined
      const profilePicRef = ref(storage, `profile_pictures/${userId}/profile.jpg`);
      await uploadBytes(profilePicRef, profilePicture);
      const profilePicUrl = await getDownloadURL(profilePicRef);
      console.log("Profile picture URL:", profilePicUrl);
      await setDoc(userRef, { profilePicture: profilePicUrl }, { merge: true });
    }
    console.log("User profile created successfully.");
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
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
