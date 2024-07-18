import { auth } from './firebase.js';
import { createUserProfile, fetchUserProfile } from './firestore.js';

document.addEventListener('DOMContentLoaded', function () {
    const editProfileForm = document.getElementById('editProfileForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userId = auth.currentUser ? auth.currentUser.uid : null;
            if (!userId) {
                console.error("User not logged in.");
                return;
            }

            const name = document.getElementById('profileName').value;
            const email = document.getElementById('profileEmail').value;
            const bio = document.getElementById('profileBio').value;
            const profilePictureInput = document.getElementById('profilePicture');
            const profilePicture = profilePictureInput && profilePictureInput.files ? profilePictureInput.files[0] : null;

            console.log('Profile Picture Input Element:', profilePictureInput);
            console.log('Profile Picture Files:', profilePictureInput.files);
            console.log(`Profile Picture: ${profilePicture ? profilePicture.name : 'None'}`);

            if (profilePicture && !['image/png', 'image/jpeg'].includes(profilePicture.type)) {
                alert('Please upload a valid PNG or JPG image.');
                return;
            }

            try {
                const userData = { name, email, bio };
                console.log(`User data before saving: ${JSON.stringify(userData)}`);
                await createUserProfile(userId, userData, profilePicture);
                console.log("User profile updated successfully.");
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
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (!userId) {
            console.error("User not logged in.");
            return;
        }

        const userProfile = await fetchUserProfile(userId);
        if (userProfile) {
            document.getElementById('profileName').value = userProfile.name || '';
            document.getElementById('profileEmail').value = userProfile.email || '';
            document.getElementById('profileBio').value = userProfile.bio || '';
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
