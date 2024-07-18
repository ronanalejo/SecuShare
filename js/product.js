import { db, auth } from './firebase.js';
import { collection, query, where, getDocs } from './firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = auth.currentUser;
    if (!user) {
        console.error("User not authenticated");
        return;
    }

    const userId = user.uid;
    const productsCollection = collection(db, `users/${userId}/products`);

    try {
        const q = query(productsCollection);
        const querySnapshot = await getDocs(q);
        const productTableBody = document.getElementById('productTableBody');
        productTableBody.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productRow = `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.type}</td>
                    <td>₱${product.price}</td>
                    <td>${product.quantity}</td>
                    <td>
                        <a href="editProduct.html?id=${doc.id}" class="edit-btn">Edit</a>
                        <button class="delete-btn" data-id="${doc.id}">Delete</button>
                    </td>
                </tr>
            `;
            productTableBody.innerHTML += productRow;
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }

    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const productId = event.target.getAttribute('data-id');
            try {
                await deleteDoc(doc(db, `users/${userId}/products/${productId}`));
                event.target.closest('tr').remove();
                console.log(`Product ${productId} deleted successfully`);
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    });
});
