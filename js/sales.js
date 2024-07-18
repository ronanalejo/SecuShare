import { getAuth, onAuthStateChanged } from "./firebase.js";
import { getFirestore, collection, getDocs } from "./firebase.js";
import { db } from "./firebase.js";

const auth = getAuth();
const transactionsCollection = collection(db, 'transactions');

document.addEventListener('DOMContentLoaded', () => {
    const totalSalesElement = document.getElementById('totalSales');
    const tbody = document.querySelector('#salesTable tbody');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const querySnapshot = await getDocs(transactionsCollection);
                let totalSales = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${doc.id}</td>
                        <td>${data.name}</td>
                        <td>${data.invoiceNumber}</td>
                        <td>${data.sourceNumber}</td>
                        <td>${data.paymentNumber}</td>
                        <td>${data.amount}</td>
                        <td>${data.status}</td>
                        <td>${data.created}</td>
                    `;
                    tbody.appendChild(row);

                    if (data.status === 'Successful') {
                        totalSales += parseFloat(data.amount);
                    }
                });

                totalSalesElement.textContent = totalSales.toFixed(2);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        } else {
            console.log("No user is logged in");
            window.location.href = 'login.html';
        }
    });
});
