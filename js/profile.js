import { auth } from './firebase.js';
import { fetchUserProfile } from './firestore.js';

const loadProfile = async () => {
    const userId = auth.currentUser.uid;
    const userProfile = await fetchUserProfile(userId);
    if (userProfile) {
        const profileNameElement = document.getElementById('profileName');
        const profileEmailElement = document.getElementById('profileEmail');
        const profilePictureElement = document.getElementById('profilePicture');

        if (profileNameElement && profileEmailElement) {
            profileNameElement.textContent = userProfile.name;
            profileEmailElement.textContent = userProfile.email;
        } else {
            console.error("Profile name or email element not found");
        }

        if (profilePictureElement && userProfile.profilePicture) {
            profilePictureElement.src = userProfile.profilePicture;
        } else {
            console.error("Profile picture element not found or userProfile.profilePicture is null");
        }
    } else {
        console.log("No user profile found");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadProfile();
        } else {
            window.location.href = 'login.html';
        }
    });
});
