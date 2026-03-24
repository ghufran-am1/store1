// =========================================
// المتغيرات العامة
// =========================================
const API_URL = 'https://fakestoreapi.com/products';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
// جلب وعرض المنتجات في الصفحة الرئيسية
// =========================================
async function fetchAndDisplayProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) return;
    
    try {
        // عرض حالة التحميل
        productsGrid.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading luxury products...</p>
            </div>
        `;
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        
        // عرض المنتجات
        displayProducts(products);
        
    } catch (error) {
        console.error('Error:', error);
        productsGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #ff6b6b;"></i>
                <p>Failed to load products. Please try again.</p>
                <button onclick="fetchAndDisplayProducts()" class="add-to-cart-btn" style="width: auto; margin: 1rem auto;">
                    Retry
                </button>
            </div>
        `;
    }
}

// =========================================
// عرض المنتجات في الشبكة
// =========================================
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="image-container">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.title.substring(0, 20)}...</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// =========================================
// عرض تفاصيل المنتج
// =========================================
async function displayProductDetails() {
    const detailsContainer = document.getElementById('product-details');
    if (!detailsContainer) return;
    
    // الحصول على ID المنتج من URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        detailsContainer.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading product details...</p>
            </div>
        `;
        
        const response = await fetch(`${API_URL}/${productId}`);
        const product = await response.json();
        
        detailsContainer.innerHTML = `
            <div class="details-card">
                <div class="details-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="details-info">
                    <h1 class="details-title">${product.title}</h1>
                    <p class="details-category">${product.category}</p>
                    <p class="details-price">$${product.price}</p>
                    <p class="details-description">${product.description}</p>
                    <div class="details-rating">
                        <i class="fas fa-star"></i>
                        ${product.rating.rate} (${product.rating.count} reviews)
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error:', error);
        detailsContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #ff6b6b;"></i>
                <p>Failed to load product details.</p>
                <a href="index.html" class="continue-shopping">Back to Shop</a>
            </div>
        `;
    }
}

// =========================================
// الانتقال إلى صفحة التفاصيل
// =========================================
function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// =========================================
// إضافة منتج إلى السلة
// =========================================
function addToCart(product) {
    // استدعاء cart من localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // تحديث عداد السلة
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
    
    // إظهار رسالة تأكيد
    showNotification('Product added to cart!');
}

// =========================================
// إظهار إشعار
// =========================================
function showNotification(message) {
    // التأكد من عدم وجود إشعار سابق
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) oldNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    // إضافة التنسيقات
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, gold, #ffb347);
        color: #0a0a1a;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// =========================================
// تهيئة الصفحة
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // تحديث عداد السلة
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
    
    // تحديد الصفحة الحالية وتشغيل الدالة المناسبة
    if (document.getElementById('products-grid')) {
        fetchAndDisplayProducts();
    }
    
    if (document.getElementById('product-details')) {
        displayProductDetails();
    }
});

// إضافة animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);