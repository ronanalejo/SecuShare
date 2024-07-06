document.addEventListener('DOMContentLoaded', function () {
    const gcashForm = document.getElementById('gcash-form');
    const amountField = document.getElementById('amount');
    const paymentResult = document.getElementById('payment-result');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    amountField.value = totalAmount.toFixed(2);

    gcashForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;
        const customerPhone = document.getElementById('customer-phone').value;

        const paymentData = {
            amount: totalAmount * 100,
            currency: 'PHP',
            type: 'gcash',
            redirect: {
                success: 'https://yourdomain.com/success',
                failed: 'https://yourdomain.com/failed'
            },
            billing: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone
            }
        };

        try {
            const response = await fetch('https://api.paymongo.com/v1/sources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('YOUR_PUBLIC_KEY:')
                },
                body: JSON.stringify({ data: { attributes: paymentData } })
            });
            
            const result = await response.json();
            if (result.data && result.data.attributes && result.data.attributes.redirect) {
                window.location.href = result.data.attributes.redirect.checkout_url;
            } else {
                paymentResult.textContent = 'Payment failed. Please try again.';
            }
        } catch (error) {
            console.error('Error:', error);
            paymentResult.textContent = 'Payment failed. Please try again.';
        }
    });
});
