
// Shopping Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentStep = 1;
let orderNumber = '';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart display
    updateCartDisplay();
    updateCartCount();

    // Existing functionality
    initializeFilters();
    initializeSearch();
    initializeCarousels();
    initializePaymentMethods();
    initializeMangaCards();
    initializeSmoothScroll();
});

// Filter functionality
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mangaCards = document.querySelectorAll('.manga-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.textContent.trim();
            
            mangaCards.forEach(card => {
                if (filterValue === 'Todos') {
                    card.style.display = 'block';
                } else {
                    const genres = card.getAttribute('data-genre');
                    if (genres && genres.includes(filterValue)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const mangaCards = document.querySelectorAll('.manga-card');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        mangaCards.forEach(card => {
            const title = card.querySelector('.manga-title').textContent.toLowerCase();
            const genre = card.querySelector('.manga-genre').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || genre.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Carousel functionality
function initializeCarousels() {
    // Hero Carousel
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.hero-indicator');
    let currentHeroSlide = 0;

    function showHeroSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        if (heroSlides[index] && heroIndicators[index]) {
            heroSlides[index].classList.add('active');
            heroIndicators[index].classList.add('active');
            currentHeroSlide = index;
        }
    }

    function nextHeroSlide() {
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
    }

    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showHeroSlide(index));
    });

    // Auto-slide hero carousel
    setInterval(nextHeroSlide, 10000);

    // Store Carousel
    const storeSlides = document.querySelectorAll('.carousel-slide');
    const storeIndicators = document.querySelectorAll('.indicator');
    const storePrevBtn = document.querySelector('.prev-btn');
    const storeNextBtn = document.querySelector('.next-btn');
    let currentStoreSlide = 0;

    function showStoreSlide(index) {
        storeSlides.forEach(slide => slide.classList.remove('active'));
        storeIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        if (storeSlides[index] && storeIndicators[index]) {
            storeSlides[index].classList.add('active');
            storeIndicators[index].classList.add('active');
            currentStoreSlide = index;
        }
    }

    function nextStoreSlide() {
        currentStoreSlide = (currentStoreSlide + 1) % storeSlides.length;
        showStoreSlide(currentStoreSlide);
    }

    function prevStoreSlide() {
        currentStoreSlide = (currentStoreSlide - 1 + storeSlides.length) % storeSlides.length;
        showStoreSlide(currentStoreSlide);
    }

    if (storeNextBtn && storePrevBtn) {
        storeNextBtn.addEventListener('click', nextStoreSlide);
        storePrevBtn.addEventListener('click', prevStoreSlide);
    }

    storeIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showStoreSlide(index));
    });

    // Auto-slide store carousel
    setInterval(nextStoreSlide, 10000);
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
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartDisplay();
    updateCartCount();
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
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
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
        button.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        
        setTimeout(() => {
            button.classList.remove('adding');
            button.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar ao Carrinho';
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
    resetCheckoutForm();
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.remove('show');
    currentStep = 1;
    updateStepDisplay();
}

function nextStep() {
    if (validateCurrentStep()) {
        currentStep++;
        updateStepDisplay();
    }
}

function prevStep() {
    currentStep--;
    updateStepDisplay();
}

function updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 <= currentStep);
    });
    
    // Update form steps
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });
}

function validateCurrentStep() {
    const currentFormStep = document.getElementById(`step${currentStep}`);
    const requiredInputs = currentFormStep.querySelectorAll('input[required], select[required]');
    
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
            input.focus();
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return false;
        }
    }
    
    // Additional validation for specific steps
    if (currentStep === 1) {
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email').focus();
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return false;
        }
    }
    
    return true;
}

function resetCheckoutForm() {
    currentStep = 1;
    updateStepDisplay();
    
    // Clear all form fields
    document.querySelectorAll('.checkout-form input, .checkout-form select').forEach(input => {
        input.value = '';
    });
    
    // Reset payment method to credit card
    document.getElementById('creditCard').checked = true;
    toggleCardDetails();
}

function updateOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryTotal = document.getElementById('summaryTotal');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15.00;
    const total = subtotal + shipping;
    
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.title} (${item.quantity}x)</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
        </div>
    `).join('');
    
    summarySubtotal.textContent = subtotal.toFixed(2).replace('.', ',');
    summaryTotal.textContent = total.toFixed(2).replace('.', ',');
}

// Payment Methods
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', toggleCardDetails);
    });
}

function toggleCardDetails() {
    const cardDetails = document.getElementById('cardDetails');
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    
    if (selectedPayment === 'creditCard' || selectedPayment === 'debitCard') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

// CEP Search (Mock function)
function searchCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        showNotification('CEP deve ter 8 dígitos.', 'error');
        return;
    }
    
    // Mock API call - in real implementation, use ViaCEP or similar service
    showNotification('Buscando CEP...', 'info');
    
    setTimeout(() => {
        // Mock data
        document.getElementById('street').value = 'Rua das Flores';
        document.getElementById('neighborhood').value = 'Centro';
        document.getElementById('city').value = 'Recife';
        document.getElementById('state').value = 'PE';
        showNotification('CEP encontrado!', 'success');
    }, 1000);
}

// Complete Order
function completeOrder() {
    if (!validateCurrentStep()) return;
    
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
    return 'MV' + Date.now().toString().slice(-6);
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
        case 'success': return 'var(--success-color)';
        case 'error': return 'var(--error-color)';
        case 'warning': return 'var(--warning-color)';
        default: return 'var(--accent-purple)';
    }
}

// Manga Cards Enhancement
function initializeMangaCards() {
    const mangaCards = document.querySelectorAll('.manga-card');
    
    mangaCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click event for manga details (future implementation)
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the add to cart button
            if (!e.target.closest('.add-to-cart-btn')) {
                const title = this.querySelector('.manga-title').textContent;
                console.log('Manga clicked:', title);
                // Here you could open a modal with manga details
            }
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
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Load More Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<div class="spinner"></div> Carregando...';
            
            // Simulate loading more mangas
            setTimeout(() => {
                this.textContent = 'Carregar Mais';
                showNotification('Mais mangás carregados!', 'success');
            }, 1500);
        });
    }
});

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
`;
document.head.appendChild(style);

// Input Formatting
document.addEventListener('DOMContentLoaded', function() {
    // CPF formatting
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            this.value = value;
        });
    }
    
    // CEP formatting
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            this.value = value;
        });
    }
    
    // Phone formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            this.value = value;
        });
    }
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            this.value = value;
        });
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '$1/$2');
            this.value = value;
        });
    }
});
