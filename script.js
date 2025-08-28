
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mangaCards = document.querySelectorAll('.manga-card');
    const searchInput = document.querySelector('.search-input');
    const loadMoreBtn = document.querySelector('.load-more-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
        
            filterBtns.forEach(b => b.classList.remove('active'));
           
            this.classList.add('active');
            
            console.log('Filter selected:', this.textContent);
        });
    });

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

    loadMoreBtn.addEventListener('click', function() {

        console.log('Loading more mangas...');
        
        this.textContent = 'Carregando...';
        setTimeout(() => {
            this.textContent = 'Carregar Mais';
        }, 1000);
    });

    mangaCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.manga-title').textContent;
            console.log('Manga clicked:', title);
        });
    });

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

    

    mangaCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Hero Carousel functionality
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.hero-indicator');
    const heroPrevBtn = document.querySelector('.hero-prev-btn');
    const heroNextBtn = document.querySelector('.hero-next-btn');
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

    function prevHeroSlide() {
        currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
    }

    if (heroNextBtn && heroPrevBtn) {
        heroNextBtn.addEventListener('click', nextHeroSlide);
        heroPrevBtn.addEventListener('click', prevHeroSlide);
    }

    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showHeroSlide(index));
    });

    // Auto-slide hero carousel
    setInterval(nextHeroSlide, 6000);

    // Store Carousel functionality
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
    setInterval(nextStoreSlide, 5000);
});
