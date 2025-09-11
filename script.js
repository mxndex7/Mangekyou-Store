
// Shopping Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orderNumber = '';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart display
    updateCartDisplay();
    updateCartCount();

    // Initialize functionality
    initializeFilters();
    initializeSearch();
    initializeCarousels();
    initializeProductCards();
    initializeSmoothScroll();
});

// Filter functionality
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.textContent.trim();
            
            productCards.forEach(card => {
                const category = card.querySelector('.product-category').textContent.trim();
                
                if (filterValue === 'Todos') {
                    card.style.display = 'block';
                } else if (filterValue === 'Karate' && category === 'Karatê') {
                    card.style.display = 'block';
                } else if (filterValue === 'Muaythai' && category === 'Muay Thai') {
                    card.style.display = 'block';
                } else if (filterValue === 'MMA' && category === 'MMA') {
                    card.style.display = 'block';
                } else if (filterValue === 'Acessórios' && (category === 'Proteções' || category === 'Muay Thai' || category === 'Acessórios')) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const productCards = document.querySelectorAll('.product-card');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const category = card.querySelector('.product-category').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Carousel functionality (removed - using static banner now)
function initializeCarousels() {
    // Carousel functionality removed - using static banner
}

// Shopping Cart Functions
function addToCart(id, title, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            title: title,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    updateCartCount();
    showAddToCartAnimation(id);
    showNotification('Produto adicionado ao carrinho!', 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartDisplay();
    updateCartCount();
    showNotification('Produto removido do carrinho', 'info');
}

function updateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(id);
        return;
    }
    
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        cartTotal.textContent = '0,00';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2).replace('.', ',');
        checkoutBtn.disabled = false;
    }
}

function showAddToCartAnimation(id) {
    const button = document.querySelector(`button[onclick*="addToCart(${id}"]`);
    if (button) {
        button.classList.add('adding');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        
        setTimeout(() => {
            button.classList.remove('adding');
            button.innerHTML = originalText;
        }, 1500);
    }
}

// Cart Sidebar Functions
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('show');
}

// Checkout Functions
function openCheckout() {
    if (cart.length === 0) return;
    
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.add('show');
    updateOrderSummary();
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.remove('show');
}

function updateOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTotal = document.getElementById('summaryTotal');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const address = document.getElementById('customerAddress') ? document.getElementById('customerAddress').value.trim() : '';
    const shipping = address ? 25.00 : 0.00;
    const total = subtotal + shipping;
    
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.title} (${item.quantity}x)</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
        </div>
    `).join('');
    
    summarySubtotal.textContent = subtotal.toFixed(2).replace('.', ',');
    summaryShipping.textContent = shipping.toFixed(2).replace('.', ',');
    summaryTotal.textContent = total.toFixed(2).replace('.', ',');
    
    // Update shipping display
    const shippingElement = document.querySelector('.summary-line:nth-child(2) span:last-child');
    if (shippingElement) {
        if (!address) {
            shippingElement.innerHTML = '<em style="color: var(--text-secondary);">Informe o endereço</em>';
        } else {
            shippingElement.innerHTML = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
        }
    }
}

// Complete Order
function completeOrder() {
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    const completeBtn = document.querySelector('.complete-order-btn');
    completeBtn.innerHTML = '<div class="spinner"></div> Processando...';
    completeBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        orderNumber = generateOrderNumber();
        closeCheckout();
        showSuccessModal();
        clearCart();
        completeBtn.innerHTML = '<i class="fas fa-lock"></i> Finalizar Pedido';
        completeBtn.disabled = false;
    }, 3000);
}

function generateOrderNumber() {
    return 'MK' + Date.now().toString().slice(-6);
}

function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    const orderNumberSpan = document.getElementById('orderNumber');
    
    orderNumberSpan.textContent = orderNumber;
    successModal.classList.add('show');
}

function closeSuccess() {
    const successModal = document.getElementById('successModal');
    successModal.classList.remove('show');
    toggleCart(); // Close cart if open
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid ${getNotificationColor(type)};
        box-shadow: var(--shadow);
        z-index: 1003;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        border: 1px solid var(--border-color);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'var(--accent-red)';
        case 'error': return '#ff4444';
        case 'warning': return '#ffaa00';
        default: return 'var(--accent-red)';
    }
}

// Product Cards Enhancement
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    // Product cards hover effects only
    productCards.forEach((card) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Smooth Scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add CSS animations for notifications
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
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .product-card, .category-card {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Input Formatting for checkout
document.addEventListener('DOMContentLoaded', function() {
    // Phone formatting
    const phoneInput = document.getElementById('customerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            this.value = value;
        });
    }
    
    // Address input listener to update shipping
    const addressInput = document.getElementById('customerAddress');
    if (addressInput) {
        addressInput.addEventListener('input', function() {
            updateOrderSummary();
        });
    }
});

// Scroll animations
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.pageYOffset + window.innerHeight;
    
    sections.forEach(section => {
        if (scrollPosition > section.offsetTop + 100) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
    });
    
    // Show first section immediately
    if (sections[0]) {
        sections[0].style.opacity = '1';
        sections[0].style.transform = 'translateY(0)';
    }
});

// Performance optimization - Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.image-placeholder').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
