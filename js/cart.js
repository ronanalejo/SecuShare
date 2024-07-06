document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

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
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        console.log('Total calculated:', total);
        cartTotalElement.textContent = total.toFixed(2);
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

    checkoutButton.addEventListener('click', function () {
        window.location.href = 'Checkout.html';
    });

    renderCart();
});
