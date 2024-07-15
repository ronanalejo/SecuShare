document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('productName').value = urlParams.get('name');
    document.getElementById('productPrice').value = urlParams.get('price');

    const subcategories = {
        image: ['Photos', 'Vectors', 'Illustrations', 'Background', 'More'],
        video: ['Animation', 'Gifs', 'Transitions', 'Tutorial', 'Trailers', 'More'],
        audio: ['Musics', 'Sound Effects', 'Loop', 'Voice Overs', 'Ambients', 'More'],
        pdf: ['Educational', 'Review', 'Research Paper', 'More'],
        ebook: ['Educational', 'E-Book', 'Research Paper', 'More']
    };

    const productTypeElement = document.getElementById('productType');
    const subCategoryGroup = document.getElementById('subCategoryGroup');
    const subCategoryElement = document.getElementById('subCategory');

    productTypeElement.addEventListener('change', () => {
        const selectedType = productTypeElement.value;
        const options = subcategories[selectedType] || [];

        subCategoryElement.innerHTML = options.map(option => `<option value="${option.toLowerCase()}">${option}</option>`).join('');
        subCategoryGroup.style.display = options.length ? 'block' : 'none';
    });

    productTypeElement.dispatchEvent(new Event('change'));

    document.getElementById('editProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userId = user.uid;
        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productDescription = document.getElementById('productDescription').value;
        const productQty = document.getElementById('productQty').value;
        const coverImage = document.getElementById('coverImage').files[0];
        const thumbnailImage = document.getElementById('thumbnailImage').files[0];

        const productType = productTypeElement.value;
        const subCategory = subCategoryElement.value;

        if (coverImage && !['image/png', 'image/jpeg'].includes(coverImage.type)) {
            alert('Please upload a valid PNG or JPG image for the Cover Image.');
            return;
        }

        if (thumbnailImage && !['image/png', 'image/jpeg'].includes(thumbnailImage.type)) {
            alert('Please upload a valid PNG or JPG image for the Thumbnail Image.');
            return;
        }

        try {
            const productRef = doc(db, `users/${userId}/products/${productName}`);
            const productStoragePath = `products/${userId}/${productName}`;

            const productData = {
                name: productName,
                type: productType,
                subCategory: subCategory,
                price: productPrice,
                description: productDescription,
                quantity: productQty,
                userId: userId
            };

            if (coverImage) {
                const coverImageRef = ref(storage, `${productStoragePath}/Cover/cover.jpg`);
                await uploadBytes(coverImageRef, coverImage);
                const coverImageUrl = await getDownloadURL(coverImageRef);
                productData.coverImageUrl = coverImageUrl;
            }
            if (thumbnailImage) {
                const thumbnailImageRef = ref(storage, `${productStoragePath}/Thumbnail/thumbnail.jpg`);
                await uploadBytes(thumbnailImageRef, thumbnailImage);
                const thumbnailImageUrl = await getDownloadURL(thumbnailImageRef);
                productData.thumbnailImageUrl = thumbnailImageUrl;
            }

            await setDoc(productRef, productData);

            alert("Product saved successfully!");
            window.location.href = 'StorePage.html';
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product. Please try again.");
        }
    });
});
