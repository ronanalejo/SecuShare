import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('productName');
    const userId = urlParams.get('userId');

    if (!productName || !userId) {
        console.error("No product name or user ID found in the URL.");
        return;
    }

    try {
        const productRef = doc(db, `users/${userId}/products/${productName}`);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            const product = productSnap.data();
            const productDetailContainer = document.getElementById('productDetailContainer');

            let productDetail = `
                <div class="product-detail">
                    <div class="product-detail-info">
                        <h2>${product.name}</h2>
                        <p><strong>Type:</strong> ${product.type}</p>
                        <p><strong>Price:</strong> ₱${product.price}</p>
                        <p><strong>Description:</strong> ${product.description}</p>
                        <p><strong>Subcategory:</strong> ${product.subCategory}</p>
                        <button id="buyNowButton" class="buy-button">Buy Now</button>
                        <button id="addToCartButton" class="add-to-cart-button">Add to Cart</button>
                    </div>
            `;

            if (product.type === 'video') {
                const productTeaserUrl = product.productTeaserUrl;
                if (productTeaserUrl) {
                    productDetail += `
                        <video controls width="600">
                            <source src="${productTeaserUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    `;
                } else {
                    console.error("No video URL found for the product.");
                }
            } else {
                const productTeaserUrl = product.type === 'image' ? product.productFileUrl : product.coverImageUrl;
                productDetail += `
                    <img src="${productTeaserUrl}" alt="${product.name}" class="product-detail-img" style="${product.type === 'image' ? 'filter: blur(10px);' : ''}">
                `;
            }

            productDetail += `</div>`;
            productDetailContainer.innerHTML = productDetail;

            document.getElementById('buyNowButton').addEventListener('click', () => {
                addToCart(product);
                window.location.href = 'Cart.html';
            });

            document.getElementById('addToCartButton').addEventListener('click', () => {
                addToCart(product);
                alert(`${product.name} added to cart`);
            });
        } else {
            console.error("No such product!");
        }
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
});

const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProductIndex = cart.findIndex(item => item.id === product.userId + product.name);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        const cartProduct = {
            id: product.userId + product.name,
            userId: product.userId,
            name: product.name,
            price: product.price,
            image: product.coverImageUrl,
            quantity: 1
        };
        cart.push(cartProduct);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
};
