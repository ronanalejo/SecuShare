document.addEventListener('DOMContentLoaded', function () {
    const gcashForm = document.getElementById('gcash-form');
    const amountField = document.getElementById('amount');
    const paymentResult = document.getElementById('payment-result');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const serviceFeeCountElement = document.getElementById('service-fee-count');
    const serviceFeeTotalElement = document.getElementById('service-fee-total');

    const SERVICE_FEE_PER_ITEM = 5.00;
    const MINIMUM_AMOUNT = 20.00; // Minimum amount in PHP

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart loaded:', cart);

    function renderCart() {
        console.log('Rendering cart');
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            console.log('Item:', item);
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item__img">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>₱${item.price}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        updateCartTotal();
    }

    function updateCartTotal() {
        console.log('Updating cart total');
        const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        const serviceFee = cart.length * SERVICE_FEE_PER_ITEM;
        const finalTotal = total + serviceFee;
        console.log('Total calculated:', total);
        console.log('Service fee:', serviceFee);
        console.log('Final total:', finalTotal);
        serviceFeeCountElement.textContent = cart.length;
        serviceFeeTotalElement.textContent = serviceFee.toFixed(2);
        cartTotalElement.textContent = finalTotal.toFixed(2);
        amountField.value = finalTotal.toFixed(2);
    }

    function saveCart() {
        console.log('Saving cart:', cart);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function removeItem(index) {
        console.log('Removing item at index:', index);
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }

    cartItemsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-item')) {
            const index = event.target.dataset.index;
            console.log('Remove button clicked for index:', index);
            removeItem(index);
        }
    });

    gcashForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const amount = parseFloat(amountField.value);

        if (amount < MINIMUM_AMOUNT) {
            paymentResult.textContent = 'The total amount must be at least ₱20.00. Please add more items to your cart.';
            return;
        }

        const paymentData = {
            attributes: {
                amount: Math.round(amount * 100),
                currency: 'PHP',
                type: 'gcash',
                redirect: {
                    success: 'http://127.0.0.1:5500/paymentS.html',
                    failed: 'http://127.0.0.1:5500/paymentF.html'
                },
                billing: {
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone
                }
            }
        };

        try {
            const response = await fetch('https://api.paymongo.com/v1/sources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('sk_test_4UvY7jjuoWuwMJuuf1xcGi7g:')
                },
                body: JSON.stringify({ data: paymentData })
            });

            const result = await response.json();
            console.log(result);
            if (result.data && result.data.attributes && result.data.attributes.redirect) {
                window.location.href = result.data.attributes.redirect.checkout_url;
            } else {
                paymentResult.textContent = 'Payment failed. Please try again.';
            }
        } catch (error) {
            console.error('Error:', error);
            paymentResult.textContent = 'Payment failed. Please try again.';
        }
    });

    renderCart();
});
