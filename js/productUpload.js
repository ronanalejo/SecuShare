// Open modal function
function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

// Close modal function
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
    // Add your form submission logic here
    closeModal();
}

// Event listener for form submission
document.getElementById("productForm").addEventListener("submit", handleSubmit);

// Event listener for plus button to open modal
document.getElementById("plusBtn").addEventListener("click", openModal);
