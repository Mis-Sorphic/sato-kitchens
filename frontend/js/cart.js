const CART_KEY = "sato_cart";
// Sato Kitchens WhatsApp number in international format, no + or leading 0
const WHATSAPP_NUMBER = "263773855042";

// --- Core cart storage helpers ---
function getCart() {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(item) {
    const cart = getCart();

    // Don't add the same service twice — just let the user know it's already there
    const alreadyInCart = cart.some(function (c) { return c.id === item.id; });
    if (alreadyInCart) {
        alert(item.name + " is already in your cart.");
        return;
    }

    cart.push(item);
    saveCart(cart);
    alert(item.name + " added to your cart.");
}

function removeFromCart(id) {
    const cart = getCart().filter(function (item) { return item.id !== id; });
    saveCart(cart);
    renderCartPage(); // refresh the visible list if we're on cart.html
}

// --- Navbar badge, runs on every page that loads cart.js ---
function updateCartBadge() {
    const badge = document.getElementById("cartCount");
    if (!badge) return;
    const cart = getCart();
    badge.textContent = cart.length;
}

// --- "Add to Cart" buttons on the Services page ---
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll(".add-to-cart-btn");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            addToCart({
                id: button.dataset.id,
                name: button.dataset.name,
                img: button.dataset.img,
            });
        });
    });
}

// --- Cart page rendering ---
function renderCartPage() {
    const cartList = document.getElementById("cartList");
    if (!cartList) return; // not on cart.html, nothing to do

    const cart = getCart();

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="empty-cart">Your cart is empty. Browse our <a href="services.html">services</a> to add something.</p>';
        document.getElementById("checkoutSection").style.display = "none";
        return;
    }

    cartList.innerHTML = cart.map(function (item) {
        return `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <span class="cart-item-name">${item.name}</span>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        `;
    }).join("");

    document.getElementById("checkoutSection").style.display = "block";
}

// --- Build and open the WhatsApp checkout link ---
function checkoutViaWhatsApp() {
    const cart = getCart();
    if (cart.length === 0) return;

    const itemLines = cart.map(function (item, index) {
        return (index + 1) + ". " + item.name;
    }).join("\n");

    const message = "Hi Sato Kitchens, I'd like a quote for:\n\n" + itemLines;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(url, "_blank");
}

// --- Run on every page load ---
document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    setupAddToCartButtons();
    renderCartPage();

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkoutViaWhatsApp);
    }
});