// editProduct.js
import { db, storage, auth } from './firebase.js';
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('productName').value = urlParams.get('name');
    document.getElementById('productPrice').value = urlParams.get('price');

    document.getElementById('editProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userId = user.uid;
        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productDescription = document.getElementById('productDescription').value;
        const productQty = document.getElementById('productQty').value;
        const coverImage = document.getElementById('coverImage').files[0];
        const thumbnailImage = document.getElementById('thumbnailImage').files[0];

        if (coverImage && !['image/png', 'image/jpeg'].includes(coverImage.type)) {
            alert('Please upload a valid PNG or JPG image for the Cover Image.');
            return;
        }

        if (thumbnailImage && !['image/png', 'image/jpeg'].includes(thumbnailImage.type)) {
            alert('Please upload a valid PNG or JPG image for the Thumbnail Image.');
            return;
        }

        try {
            // Define Firestore and Storage paths
            const productRef = doc(db, `users/${userId}/products/${productName}`);
            const productStoragePath = `products/${userId}/${productName}`;

            // Prepare product data
            const productData = {
                name: productName,
                type: urlParams.get('type'),
                price: productPrice,
                description: productDescription,
                quantity: productQty,
                userId: userId
            };

            // Upload Cover Image if available
            if (coverImage) {
                const coverImageRef = ref(storage, `${productStoragePath}/Cover/cover.jpg`);
                await uploadBytes(coverImageRef, coverImage);
                const coverImageUrl = await getDownloadURL(coverImageRef);
                productData.coverImageUrl = coverImageUrl;
            }

            // Upload Thumbnail Image if available
            if (thumbnailImage) {
                const thumbnailImageRef = ref(storage, `${productStoragePath}/Thumbnail/thumbnail.jpg`);
                await uploadBytes(thumbnailImageRef, thumbnailImage);
                const thumbnailImageUrl = await getDownloadURL(thumbnailImageRef);
                productData.thumbnailImageUrl = thumbnailImageUrl;
            }

            // Save product data in Firestore
            await setDoc(productRef, productData);

            alert("Product saved successfully!");
            window.location.href = 'StorePage.html';
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product. Please try again.");
        }
    });
});
