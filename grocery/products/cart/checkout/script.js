document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let orderItemsContainer = document.getElementById("order-items");
    let totalPriceElement = document.getElementById("total-price");

    let total = 0;
    orderItemsContainer.innerHTML = ""; 

    cart.forEach(item => {
        total += item.price * item.quantity;
        orderItemsContainer.innerHTML += `
            <div class="order-item">
                <span>${item.name} (Qty: ${item.quantity})</span>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    totalPriceElement.innerText = `₹${total.toFixed(2)}`;

    document.getElementById("pay-now").addEventListener("click", function () {
        let paymentMethod = document.querySelector('input[name="payment"]:checked');

        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        alert(`Payment successful via ${paymentMethod.value.toUpperCase()}!`);
        alert('Thanks for buying in Harvest Hub!!!');

                localStorage.removeItem("cart");

       
        setTimeout(() => {
            window.location.href = "b.html";         }, 100);
    });
});
