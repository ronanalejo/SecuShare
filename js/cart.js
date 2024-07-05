document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
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
        const total = cart.reduce((sum, item) => sum + item.price, 0); // No need to multiply by quantity
        cartTotalElement.textContent = total.toFixed(2);
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }

    cartItemsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-item')) {
            const index = event.target.dataset.index;
            removeItem(index);
        }
    });

    checkoutButton.addEventListener('click', function () {
        alert('Checkout functionality is not implemented yet.');
    });

    renderCart();
});
