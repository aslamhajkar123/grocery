let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCart() {
    let cartItems = document.getElementById("cart-items");
    let total = 0;
    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <p><strong>${item.name}</strong></p>
                <p>₹${item.price}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">➖</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">➕</button>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    document.getElementById("total-price").innerText = total;
    document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateQuantity(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

document.getElementById("clear-cart").addEventListener("click", function() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
});

document.getElementById("checkout-btn").addEventListener("click", function() {
    window.location.href = "checkout/checkout.html";
});

updateCart();
