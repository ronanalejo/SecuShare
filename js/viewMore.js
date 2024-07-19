document.addEventListener('DOMContentLoaded', () => {
    const viewMoreButtons = document.querySelectorAll('.view-more');
    const viewLessButtons = document.querySelectorAll('.view-less');

    viewMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            const container = document.getElementById(`${sectionId}Container`);
            const hiddenProducts = container.querySelectorAll('.hidden');

            hiddenProducts.forEach(product => {
                product.classList.remove('hidden');
            });

            button.style.display = 'none';
            container.nextElementSibling.style.display = 'block';
        });
    });

    viewLessButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            const container = document.getElementById(`${sectionId}Container`);
            const allProducts = container.querySelectorAll('.product__article');

            allProducts.forEach((product, index) => {
                if (index >= 5) {
                    product.classList.add('hidden');
                }
            });

            button.style.display = 'none';
            container.previousElementSibling.style.display = 'block'; 
        });
    });
});
