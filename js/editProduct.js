import { db, storage } from './firebase.js';
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { auth } from './firebase.js';

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
            const productRef = doc(db, "products", `${userId}_${productName}`);
            const productData = {
                name: productName,
                price: productPrice,
                description: productDescription,
                quantity: productQty,
                userId: userId
            };

            const productStoragePath = `products/${userId}/${productName}`;

            if (coverImage) {
                const coverImageRef = ref(storage, `${productStoragePath}/cover/cover.jpg`);
                await uploadBytes(coverImageRef, coverImage);
                const coverImageUrl = await getDownloadURL(coverImageRef);
                productData.coverImageUrl = coverImageUrl;
            }

            if (thumbnailImage) {
                const thumbnailImageRef = ref(storage, `${productStoragePath}/thumbnail/thumbnail.jpg`);
                await uploadBytes(thumbnailImageRef, thumbnailImage);
                const thumbnailImageUrl = await getDownloadURL(thumbnailImageRef);
                productData.thumbnailImageUrl = thumbnailImageUrl;
            }

            await setDoc(productRef, productData);
            alert("Product saved successfully!");
            window.location.href = 'StorePage.html';
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product. Please try again.");
        }
    });
});
