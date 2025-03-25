// Cache DOM elements
const elements = {
    fadeElements: document.querySelectorAll('.hero-content, .hero-image'),
    phoneLinks: document.querySelectorAll('a[href^="tel:"]'),
    faqItems: document.querySelectorAll('.faq-item'),
    stickyCall: document.querySelector('.mobile-sticky-call')
};

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for fade-in animations
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize fade elements
    elements.fadeElements.forEach(element => {
        fadeObserver.observe(element);
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Phone number click tracking
    elements.phoneLinks.forEach(link => {
        link.addEventListener('click', () => {
            const phoneNumber = link.getAttribute('href').replace('tel:', '');
            // Here you would typically send this event to Google Analytics
            // Example: gtag('event', 'click', {'event_category': 'Phone Call', 'event_label': phoneNumber});
        });
    });

    // FAQ Toggle Functionality
    elements.faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            elements.faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Handle sticky call button visibility with debounce
    let lastScrollTop = 0;
    const scrollThreshold = 100;

    const handleScroll = debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            elements.stickyCall.classList.add('show');
        } else {
            elements.stickyCall.classList.remove('show');
        }
        
        lastScrollTop = scrollTop;
    }, 100);

    // Add passive scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
});

// Add CSS for fade effect
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);