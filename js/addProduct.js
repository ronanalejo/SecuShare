document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("Form submitted");

            const productName = document.getElementById('productName').value;
            const productType = document.getElementById('productType').value;
            const price = document.getElementById('price').value;

            console.log("Product Data:", { productName, productType, price });

            if (!productName || !productType || !price) {
                console.error("All fields are required");
                return;
            }

            const productData = {
                name: productName,
                type: productType,
                price: price
            };

            const queryString = new URLSearchParams(productData).toString();
            console.log("Redirecting to:", `editProduct.html?${queryString}`);
            window.location.href = `editProduct.html?${queryString}`;
        });
    } else {
        console.error("addProductForm not found");
    }
});
