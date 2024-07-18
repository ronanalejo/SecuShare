import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('productName').value = urlParams.get('productName');
    document.getElementById('productPrice').value = urlParams.get('price');

    const subcategories = {
        image: ['Photos', 'Vectors', 'Illustrations', 'Background'],
        video: ['Animation', 'Gifs', 'Transitions', 'Tutorial', 'Trailers'],
        audio: ['Musics', 'Sound Effects', 'Loop', 'Voice Overs', 'Ambients'],
        pdf: ['Educational', 'Review', 'Research Paper'],
        ebook: ['Educational', 'Self-Help', 'Research Paper']
    };

    const productTypeElement = document.getElementById('productType');
    const subCategoryGroup = document.getElementById('subCategoryGroup');
    const subCategoryElement = document.getElementById('subCategory');
    const coverImageGroup = document.getElementById('coverImageGroup');
    const productPicturesGroup = document.getElementById('productPicturesGroup');
    const productFileGroup = document.getElementById('productFileGroup');

    productTypeElement.addEventListener('change', () => {
        const selectedType = productTypeElement.value;
        const options = subcategories[selectedType] || [];

        subCategoryElement.innerHTML = options.map(option => `<option value="${option.toLowerCase()}">${option}</option>`).join('');
        subCategoryGroup.style.display = options.length ? 'block' : 'none';

        if (selectedType === 'image') {
            coverImageGroup.style.display = 'none';
            productPicturesGroup.style.display = 'none';
            productFileGroup.style.display = 'block';
        } else {
            coverImageGroup.style.display = 'block';
            productPicturesGroup.style.display = 'block';
            productFileGroup.style.display = 'none';
        }
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
        const productPictures = [
            document.getElementById('productPicture1').files[0],
            document.getElementById('productPicture2').files[0],
            document.getElementById('productPicture3').files[0],
            document.getElementById('productPicture4').files[0],
            document.getElementById('productPicture5').files[0],
        ];

        const productType = productTypeElement.value;
        const subCategory = subCategoryElement.value;
        const productFile = document.getElementById('productFile').files[0];

        const productData = {
            name: productName,
            type: productType,
            subCategory: subCategory,
            price: productPrice,
            description: productDescription,
            quantity: productQty,
            userId: userId
        };

        try {
            const productRef = doc(db, `users/${userId}/products/${productName}`);
            const productStoragePath = `products/${userId}/${productName}`;

            if (productFile && productType === 'image') {
                const productFileRef = ref(storage, `${productStoragePath}/file.jpg`);
                await uploadBytes(productFileRef, productFile);
                const productFileUrl = await getDownloadURL(productFileRef);
                productData.productFileUrl = productFileUrl;
            }

            if (coverImage && productType !== 'image') {
                const coverImageRef = ref(storage, `${productStoragePath}/cover.jpg`);
                await uploadBytes(coverImageRef, coverImage);
                const coverImageUrl = await getDownloadURL(coverImageRef);
                productData.coverImageUrl = coverImageUrl;
            }

            for (let i = 0; i < productPictures.length; i++) {
                if (productPictures[i] && productType !== 'image') {
                    const productPictureRef = ref(storage, `${productStoragePath}/picture${i + 1}.jpg`);
                    await uploadBytes(productPictureRef, productPictures[i]);
                    const productPictureUrl = await getDownloadURL(productPictureRef);
                    productData[`productPicture${i + 1}Url`] = productPictureUrl;
                }
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
