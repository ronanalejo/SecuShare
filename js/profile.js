import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { db } from "./firebase.js";

const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    const profileNameElement = document.getElementById('profileName');
    const profileEmailElement = document.getElementById('profileEmail');
    const profilePictureElement = document.getElementById('profilePicture');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is logged in:", user);
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (profileNameElement) profileNameElement.textContent = userData.name || 'No name provided';
                if (profileEmailElement) profileEmailElement.textContent = userData.email || user.email;
                if (userData.profilePicture && profilePictureElement) {
                    profilePictureElement.src = userData.profilePicture;
                } else if (profilePictureElement) {
                    profilePictureElement.alt = 'No profile picture';
                }
            } else {
                console.log("No such user data!");
            }
        } else {
            console.log("No user is logged in");
            window.location.href = 'login.html'; n
        }
    });
});
