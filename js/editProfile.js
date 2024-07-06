// editProfile.js

import { auth } from './firebase.js';
import { createUserProfile, fetchUserProfile } from './firestore.js';

document.addEventListener('DOMContentLoaded', function () {
    const editProfileForm = document.getElementById('editProfileForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userId = auth.currentUser.uid;
            const name = document.getElementById('profileName').value;
            const email = document.getElementById('profileEmail').value;
            const profilePicture = document.getElementById('profilePicture').files[0];
            
            // Validate image type
            if (profilePicture && !['image/png', 'image/jpeg'].includes(profilePicture.type)) {
                alert('Please upload a valid PNG or JPG image.');
                return;
            }
        
            try {
                await createUserProfile(userId, { name, email }, profilePicture);
                window.location.href = 'profile.html';
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }

    const loadProfile = async () => {
        const userId = auth.currentUser.uid;
        const userProfile = await fetchUserProfile(userId);
        if (userProfile) {
            document.getElementById('profileName').value = userProfile.name;
            document.getElementById('profileEmail').value = userProfile.email;
            if (userProfile.profilePicture) {
                document.getElementById('currentProfilePicture').src = userProfile.profilePicture;
            }
        }
    };

    auth.onAuthStateChanged((user) => {
        if (user) {
            loadProfile();
        } else {
            window.location.href = 'login.html';
        }
    });
});
