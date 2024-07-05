import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const userId = urlParams.get('userId');

    if (!productId || !userId) {
        console.error("No product ID or user ID found in the URL.");
        return;
    }

    try {
        const productRef = doc(db, `users/${userId}/products/${productId}`);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            const product = productSnap.data();
            const productDetailContainer = document.getElementById('productDetailContainer');
            const productDetail = `
                <div class="product-detail">
                    <img src="${product.coverImageUrl || 'default-cover.jpg'}" alt="${product.name}" class="product-detail-img">
                    <div class="product-detail-info">
                        <h2>${product.name}</h2>
                        <p><strong>Type:</strong> ${product.type}</p>
                        <p><strong>Price:</strong> ₱${product.price}</p>
                        <p><strong>Description:</strong> ${product.description}</p>
                        <p><strong>Quantity Available:</strong> ${product.quantity}</p>
                        <button class="buy-button">Buy Now</button>
                    </div>
                </div>
            `;
            productDetailContainer.innerHTML = productDetail;
        } else {
            console.error("No such product!");
        }
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
});
