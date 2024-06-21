import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('productList');
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    querySnapshot.forEach((doc) => {
        const product = doc.data();
        const productElement = document.createElement('div');
        productElement.className = 'row';

        productElement.innerHTML = `
            <img src="${product.coverImageUrl}" alt="${product.name}">
            <div class="product-text"> 
                <h5>Sale</h5>
                <div class="heart-icon">
                    <i class="bx bx-heart"></i>
                </div>
                <div class="price">
                    <h4>${product.name}</h4>
                    <p>$${product.price}</p>
                </div>    
            </div>
        `;

        productList.appendChild(productElement);
    });
});
