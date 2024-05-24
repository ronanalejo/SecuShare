document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('searchIcon');
    const searchBar = document.getElementById('searchBar');
    const searchSuggestions = document.createElement('div');
    searchSuggestions.id = 'searchSuggestions';
    searchSuggestions.className = 'search-suggestions';
    searchBar.parentNode.insertBefore(searchSuggestions, searchBar.nextSibling);

    searchIcon.addEventListener('click', (event) => {
        event.preventDefault();
        if (searchBar.classList.contains('hidden')) {
            searchBar.classList.remove('hidden');
            searchBar.classList.add('visible');
            searchBar.focus();
        } else {
            searchBar.classList.remove('visible');
            searchBar.classList.add('hidden');
        }
    });

    searchBar.addEventListener('input', function() {
        const inputVal = this.value.toLowerCase();
        searchSuggestions.innerHTML = ''; 

        if (inputVal.length > 0) {
            const productItems = JSON.parse(localStorage.getItem('productItems')) || [];
            const filteredProducts = productItems.filter(product => product.name.toLowerCase().includes(inputVal));

            searchSuggestions.style.display = filteredProducts.length > 0 ? 'block' : 'none';

            filteredProducts.forEach(product => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'search-suggestion-item';
                suggestionItem.innerHTML = `
                    <img src="${product.img}" alt="${product.name}" style="width: 30px; height: 30px; object-fit: cover;">
                    <span style="margin-left: 10px; color: black;">${product.name} - $${product.price}</span>
                `;
                suggestionItem.addEventListener('click', () => {
                    window.location.href = `productPage.html?name=${product.name}`;
                });
                searchSuggestions.appendChild(suggestionItem);
            });
        } else {
            searchSuggestions.style.display = 'none';
        }
    });
});
