import { getFirestore, collectionGroup, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { db } from "./firebase.js";

document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.querySelector('.swiper-wrapper');

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

        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('product__button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.onclick = (event) => {
            event.stopPropagation(); // Prevents the product detail page from opening
            addToCart(product);
        };

        productDataDiv.appendChild(nameElement);
        productDataDiv.appendChild(descriptionElement);
        productDataDiv.appendChild(priceElement);
        productDataDiv.appendChild(viewMoreButton);
        productDataDiv.appendChild(addToCartButton);

        productDiv.appendChild(imgDiv);
        productDiv.appendChild(productDataDiv);

        return productDiv;
    };

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
                image: product.thumbnailImageUrl,
                quantity: 1
            };
            cart.push(cartProduct);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart`);
    };

    await fetchProducts();
});



function fetchTrendingProducts() {
    db.collection("products").where("trending", "==", true).get()
        .then((querySnapshot) => {
            const productsList = document.querySelector('.products-list');
            productsList.innerHTML = '';

            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const productItem = `
                    <div class="product-item">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="product__price">$${product.price}</p>
                        <a href="#" class="product__button">Add to Cart</a>
                    </div>
                `;
                productsList.innerHTML += productItem;
            });
        })
        .catch((error) => {
            console.error("Error fetching trending products: ", error);
        });
}

document.addEventListener('DOMContentLoaded', fetchTrendingProducts);