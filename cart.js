// =========================================
// تحميل السلة من localStorage
// =========================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =========================================
// حفظ السلة في localStorage
// =========================================
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// =========================================
// تحديث عداد السلة
// =========================================
function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

// =========================================
// عرض عناصر السلة
// =========================================
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="index.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        updateCartSummary();
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-info">
                <h3>${item.title.substring(0, 30)}...</h3>
                <p class="item-price">$${item.price}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

// =========================================
// تحديث كمية المنتج
// =========================================
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        displayCartItems();
    }
}

// =========================================
// إزالة منتج من السلة
// =========================================
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCartItems();
}

// =========================================
// تحديث ملخص السلة
// =========================================
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 10 : 0;
    const total = subtotal + shipping;
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// =========================================
// تفريغ السلة
// =========================================
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        displayCartItems();
    }
}

// =========================================
// متابعة الشراء
// =========================================
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Thank you for your purchase! This is a demo.');
}

// =========================================
// تهيئة صفحة السلة
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCartItems();
});