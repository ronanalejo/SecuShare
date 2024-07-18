import { db, storage } from './firebase.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

export const createUserProfile = async (userId, userData, profilePicture) => {
    const userRef = doc(db, "users", userId);
    try {
        if (profilePicture) {
            const fileType = profilePicture.type.split('/')[1];
            const profilePicturePath = `profile_pictures/${userId}/profile.${fileType}`;
            const storageRef = ref(storage, profilePicturePath);
            console.log(`Uploading profile picture to path: ${profilePicturePath}`);
            await uploadBytes(storageRef, profilePicture);
            console.log('Profile picture uploaded successfully');
            const profilePictureUrl = await getDownloadURL(storageRef);
            console.log(`Profile picture URL: ${profilePictureUrl}`);
            userData.profilePicture = profilePictureUrl;
        }
        console.log("Setting user data:", userData);
        await setDoc(userRef, userData);
        console.log("User profile created successfully.");
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

export const fetchUserProfile = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        return null;
    }
};
