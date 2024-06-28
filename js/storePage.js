// storePage.js
import { getFirestore, collectionGroup, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { db } from "./firebase.js";

document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.getElementById('productsContainer');

    const fetchProducts = async () => {
        const productsQuery = collectionGroup(db, 'products');
        const querySnapshot = await getDocs(productsQuery);

        querySnapshot.forEach((doc) => {
            const productData = doc.data();
            const productElement = createProductElement(productData);
            productsContainer.appendChild(productElement);
        });
    };

    const createProductElement = (product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('swiper-slide', 'product__article');
        productDiv.onclick = () => location.href = `productDetail.html?userId=${product.userId}&productName=${product.name}`;

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('product__image');

        const imgElement = document.createElement('img');
        imgElement.src = product.thumbnailImageUrl;
        imgElement.alt = product.name;
        imgElement.classList.add('product__img');

        imgDiv.appendChild(imgElement);

        const productDataDiv = document.createElement('div');
        productDataDiv.classList.add('product__data');

        const nameElement = document.createElement('h3');
        nameElement.classList.add('product__name');
        nameElement.textContent = product.name;

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('product__description');
        descriptionElement.textContent = product.description;

        const priceElement = document.createElement('p');
        priceElement.classList.add('product__price');
        priceElement.textContent = `₱${product.price}`;

        const viewMoreButton = document.createElement('a');
        viewMoreButton.classList.add('product__button');
        viewMoreButton.href = `productDetail.html?userId=${product.userId}&productName=${product.name}`;
        viewMoreButton.textContent = 'View More';

        productDataDiv.appendChild(nameElement);
        productDataDiv.appendChild(descriptionElement);
        productDataDiv.appendChild(priceElement);
        productDataDiv.appendChild(viewMoreButton);

        productDiv.appendChild(imgDiv);
        productDiv.appendChild(productDataDiv);

        return productDiv;
    };

    await fetchProducts();
});
