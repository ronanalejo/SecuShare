// storePage.js
import { db, auth } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userId = user.uid;
                const productsRef = collection(db, `users/${userId}/products`);
                const querySnapshot = await getDocs(productsRef);
                const productsContainer = document.querySelector('.products');

                querySnapshot.forEach((doc) => {
                    const product = doc.data();
                    const productId = doc.id; // Get the product ID
                    const productCard = `
                        <div class="row" data-id="${productId}">
                            <img src="${product.thumbnailImageUrl || 'default-thumbnail.jpg'}" alt="${product.name}">
                            <div class="product-text">
                                <h5>Sale</h5>
                                <div class="heart-icon">
                                    <i class="bx bx-heart"></i>
                                </div>
                                <div class="price">
                                    <h4>${product.name}</h4>
                                    <p>₱${product.price}</p>
                                </div>    
                            </div>
                        </div>
                    `;
                    productsContainer.innerHTML += productCard;
                });

                // Add click event listeners to each product card
                const productCards = document.querySelectorAll('.row');
                productCards.forEach(card => {
                    card.addEventListener('click', () => {
                        const productId = card.getAttribute('data-id');
                        window.location.href = `productDetail.html?id=${productId}`;
                    });
                });
            } else {
                console.error("User not authenticated");
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
});
