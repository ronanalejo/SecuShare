import { getFirestore, collectionGroup, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { db } from "./firebase.js";

document.addEventListener('DOMContentLoaded', async () => {
    const subcategories = {
        image: {
            photos: document.querySelector('#photos .product-container'),
            vectors: document.querySelector('#vectors .product-container'),
            illustrations: document.querySelector('#illustrations .product-container'),
            background: document.querySelector('#background .product-container')
        },
        video: {
            animation: document.querySelector('#animation .product-container'),
            gifs: document.querySelector('#gif .product-container'),
            transitions: document.querySelector('#transitions .product-container'),
            tutorial: document.querySelector('#tutorial .product-container'),
            trailers: document.querySelector('#trailers .product-container')
        },
        audio: {
            musics: document.querySelector('#music .product-container'),
            soundEffects: document.querySelector('#soundeEffect .product-container'),
            loop: document.querySelector('#loop .product-container'),
            voiceOvers: document.querySelector('#voiceOver .product-container'),
            ambients: document.querySelector('#ambient .product-container')
        },
        pdf: {
            educational: document.querySelector('#educational .product-container'),
            review: document.querySelector('#review .product-container'),
            researchPaper: document.querySelector('#research .product-container')
        },
        ebook: {
            educational: document.querySelector('#educational .product-container'),
            selfHelp: document.querySelector('#selfHelp .product-container'),
            researchPaper: document.querySelector('#research .product-container')
        }
    };

    const fetchProducts = async () => {
        const productsQuery = collectionGroup(db, 'products');
        const querySnapshot = await getDocs(productsQuery);

        querySnapshot.forEach((doc) => {
            const productData = doc.data();
            const productType = productData.type;
            const subCategory = productData.subCategory;

            if (subcategories[productType] && subcategories[productType][subCategory]) {
                const productElement = createProductElement(productData);
                subcategories[productType][subCategory].appendChild(productElement);
            }
        });
    };

    const createProductElement = (product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product__article');
        productDiv.onclick = () => location.href = `productDetail.html?userId=${product.userId}&productName=${product.name}`;

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('product__image');

        const imgElement = document.createElement('img');
        imgElement.src = product.type === 'image' ? product.productFileUrl : product.coverImageUrl;
        imgElement.alt = product.name;
        imgElement.classList.add('product__img');

        if (product.type === 'image') {
            imgElement.style.filter = 'blur(10px)';
        }

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
                image: product.coverImageUrl,
                quantity: 1
            };
            cart.push(cartProduct);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart`);
    };

    await fetchProducts();
});
