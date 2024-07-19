import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

document.addEventListener('DOMContentLoaded', () => {
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
    const productTeasersGroup = document.getElementById('productTeasersGroup');
    const productFileGroup = document.getElementById('productFileGroup');

    const updateFileInputs = () => {
        const selectedType = productTypeElement.value;
        const selectedSubCategory = subCategoryElement.value;

        // Reset all file input displays
        coverImageGroup.style.display = 'none';
        productTeasersGroup.style.display = 'none';
        productFileGroup.style.display = 'none';

        if (selectedType === 'image') {
            productFileGroup.style.display = 'block';
            document.getElementById('productFile').accept = "image/png, image/jpeg";
        } else if (selectedType === 'video') {
            coverImageGroup.style.display = 'block';
            productFileGroup.style.display = 'block';
            document.getElementById('productFile').accept = "video/mp4";

            productTeasersGroup.style.display = 'block';
            if (selectedSubCategory === 'transitions' || selectedSubCategory === 'gifs') {
                document.querySelector(`label[for='productTeaser1']`).textContent = `Product Teasers`;
                for (let i = 1; i <= 5; i++) {
                    const teaserInput = document.getElementById(`productTeaser${i}`);
                    teaserInput.style.display = 'block';
                    teaserInput.accept = "image/png, image/jpeg";
                }
            } else {
                document.querySelector(`label[for='productTeaser1']`).textContent = `Product Teaser`;
                const teaserInput = document.getElementById('productTeaser1');
                teaserInput.style.display = 'block';
                teaserInput.accept = "video/mp4";
                for (let i = 2; i <= 5; i++) {
                    document.getElementById(`productTeaser${i}`).style.display = 'none';
                }
            }
        } else if (['audio', 'pdf', 'ebook'].includes(selectedType)) {
            coverImageGroup.style.display = 'block';
            productTeasersGroup.style.display = 'block';
            productFileGroup.style.display = 'block';
            document.getElementById('productFile').accept = "*/*";
            document.querySelector(`label[for='productTeaser1']`).textContent = `Product Teasers`;

            for (let i = 1; i <= 5; i++) {
                const teaserInput = document.getElementById(`productTeaser${i}`);
                teaserInput.style.display = 'block';
                teaserInput.accept = "image/png, image/jpeg";
            }
        } else {
            coverImageGroup.style.display = 'block';
            productTeasersGroup.style.display = 'block';
            document.getElementById('productTeaser1').style.display = 'block';
            for (let i = 2; i <= 5; i++) {
                document.getElementById(`productTeaser${i}`).style.display = 'none';
            }
        }
    };

    productTypeElement.addEventListener('change', () => {
        const selectedType = productTypeElement.value;
        const options = subcategories[selectedType] || [];
        subCategoryElement.innerHTML = options.map(option => `<option value="${option.toLowerCase()}">${option}</option>`).join('');
        subCategoryGroup.style.display = options.length ? 'block' : 'none';
        updateFileInputs();
    });

    subCategoryElement.addEventListener('change', updateFileInputs);

    // Initialize the form
    updateFileInputs();

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
        const coverImage = document.getElementById('coverImage').files[0];
        const productTeasers = [
            document.getElementById('productTeaser1').files[0],
            document.getElementById('productTeaser2').files[0],
            document.getElementById('productTeaser3').files[0],
            document.getElementById('productTeaser4').files[0],
            document.getElementById('productTeaser5').files[0],
        ];
        const productType = productTypeElement.value;
        const subCategory = subCategoryElement.value;
        const productFile = document.getElementById('productFile').files[0];

        if (isNaN(productPrice) || productPrice < 0) {
            alert("Price must be a non-negative number.");
            return;
        }

        const productData = {
            name: productName,
            type: productType,
            subCategory: subCategory,
            price: productPrice,
            description: productDescription,
            userId: userId
        };

        try {
            const productRef = doc(db, `users/${userId}/products/${productName}`);
            const productStoragePath = `products/${userId}/${productName}`;

            if (productType === 'image') {
                if (productFile) {
                    const productFileRef = ref(storage, `${productStoragePath}/file.jpg`);
                    await uploadBytes(productFileRef, productFile);
                    const productFileUrl = await getDownloadURL(productFileRef);
                    productData.productFileUrl = productFileUrl;
                }
            } else {
                if (productFile) {
                    const productFileRef = ref(storage, `${productStoragePath}/file.mp4`);
                    await uploadBytes(productFileRef, productFile);
                    const productFileUrl = await getDownloadURL(productFileRef);
                    productData.productFileUrl = productFileUrl;
                }

                if (coverImage && !['image/png', 'image/jpeg', 'image/jpg'].includes(coverImage.type)) {
                    alert("Cover image must be a PNG or JPEG/JPG.");
                    return;
                }
                if (coverImage) {
                    const coverImageRef = ref(storage, `${productStoragePath}/cover.jpg`);
                    await uploadBytes(coverImageRef, coverImage);
                    const coverImageUrl = await getDownloadURL(coverImageRef);
                    productData.coverImageUrl = coverImageUrl;
                }

                for (let i = 0; i < productTeasers.length; i++) {
                    if (productTeasers[i]) {
                        const productTeaserRef = ref(storage, `${productStoragePath}/teaser${i + 1}.jpg`);
                        await uploadBytes(productTeaserRef, productTeasers[i]);
                        const productTeaserUrl = await getDownloadURL(productTeaserRef);
                        productData[`productTeaser${i + 1}Url`] = productTeaserUrl;
                    }
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
