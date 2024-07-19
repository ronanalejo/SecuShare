import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Initialize Firestore
const db = getFirestore();
const auth = getAuth();

async function fetchPurchasedItems() {
    const user = auth.currentUser;
    if (!user) {
        console.log('No user is signed in.');
        return;
    }

    const purchasedItemsContainer = document.getElementById('purchased-items');
    purchasedItemsContainer.innerHTML = '';

    try {
        const q = query(collection(db, 'purchases'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            const item = doc.data();
            const itemElement = document.createElement('div');
            itemElement.className = 'purchased-item';

            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}" class="purchased-item__image">
                <div class="purchased-item__details">
                    <h3 class="purchased-item__title">${item.title}</h3>
                    <p class="purchased-item__description">${item.description}</p>
                    <p class="purchased-item__price">${item.price}</p>
                    <a href="${item.downloadUrl}" download="${item.title}" class="purchased-item__download-button">Download</a>
                </div>
            `;

            purchasedItemsContainer.appendChild(itemElement);
        });
    } catch (error) {
        console.error('Error fetching purchased items: ', error);
    }
}

window.addEventListener('load', fetchPurchasedItems);
