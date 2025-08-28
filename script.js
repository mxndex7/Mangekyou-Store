
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

    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        const catalogSection = document.querySelector('#catalog');
        catalogSection.scrollIntoView({
            behavior: 'smooth'
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

    // Carousel functionality
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    // Auto-slide carousel
    setInterval(nextSlide, 5000);
});
