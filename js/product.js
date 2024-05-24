document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');
    const productItems = JSON.parse(localStorage.getItem('productItems')) || [];
    const product = productItems.find(item => item.name === productName);

    if (product) {
        document.getElementById('productImg').src = product.img;
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productDescription').textContent = product.description;
        document.getElementById('productPrice').textContent = product.price;
    } else {
        window.location.href = 'store.html';
    }

    document.getElementById('buyNowBtn').addEventListener('click', () => {
        // To be immplement buy now functionality!!!!!!
        alert('Buy Now functionality to be implemented.');
    });
});
