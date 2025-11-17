// One-time cache reset to ensure users receive the latest assets
(function() {
    const CLEAR_VERSION = '2025-11-07-18';
    const KEY = 'bobs-cache-cleared';
    try {
        const stored = localStorage.getItem(KEY);
        const force = new URLSearchParams(location.search).has('clear-cache');
        if (stored !== CLEAR_VERSION || force) {
            // Delete all caches
            if ('caches' in window) {
                caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).catch(() => {});
            }
            // Unregister any existing service workers
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations()
                    .then(regs => Promise.all(regs.map(r => r.unregister())))
                    .catch(() => {});
            }
            localStorage.setItem(KEY, CLEAR_VERSION);
            // Small delay to allow unregister/delete to settle, then reload once
            setTimeout(() => {
                try { history.replaceState(null, '', location.pathname); } catch(e) {}
                location.reload();
            }, 200);
        }
    } catch (e) {
        console.warn('Cache reset skipped:', e);
    }
})();

// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initScrollEffects();
    initTestimonialSlider();
    initBackToTop();
    initAOS();
    initFormValidation();
    initLazyLoading();
    initPerformanceOptimizations();
    initCategoryFilters();
    // Hide category tiles that currently have no images in the manifest
    initCategoryAvailability();
});

// Preloader
function initPreloader() {
    const preloader = document.getElementById('preloader');
    // If there's no preloader element on the page, skip safely.
    if (!preloader) return;
    // Fallback: hide preloader even if 'load' is delayed by external assets
    const hidePreloader = () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.style.overflow = 'visible';
        }, 500);
    };

    // Hide shortly after the real load
    window.addEventListener('load', function() {
        setTimeout(hidePreloader, 600);
    });

    // Safety timeout in case 'load' is delayed or blocked
    setTimeout(hidePreloader, 4000);
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'visible';
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'visible';
        });
    });
    
    // Active link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            heroContent.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Testimonial slider
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let currentTestimonial = 0;
    
    if (testimonialCards.length === 0) return;
    
    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = currentTestimonial === 0 ? testimonialCards.length - 1 : currentTestimonial - 1;
        showTestimonial(currentTestimonial);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
    }
    
    // Auto-play testimonials
    setInterval(nextTestimonial, 5000);
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize AOS (Animate On Scroll)
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0
        });
    }
}

// Form validation and submission
function initFormValidation() {
    const bookingForm = document.getElementById('booking-form');
    
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'description'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            const value = formObject[field];
            
            if (!value || value.trim() === '') {
                showFieldError(input, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                isValid = false;
            } else {
                clearFieldError(input);
            }
        });
        
        // Email validation
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formObject.email && !emailRegex.test(formObject.email)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Phone validation
        const phoneInput = document.getElementById('phone');
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (formObject.phone && !phoneRegex.test(formObject.phone.replace(/\s/g, ''))) {
            showFieldError(phoneInput, 'Please enter a valid phone number');
            isValid = false;
        }
        
        if (isValid) {
            submitBookingForm(formObject);
        }
    });
    
    function showFieldError(input, message) {
        clearFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--primary-color)';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '5px';
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = 'var(--primary-color)';
    }
    
    function clearFieldError(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }
    
    function submitBookingForm(data) {
        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            bookingForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Booking request submitted successfully! We\'ll contact you within 24 hours.', 'success');
        }, 2000);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-color)' : 'var(--background-light)'};
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-dark);
        z-index: 10000;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    function removeNotification(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }, 300);
    }
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 16); // ~60fps
    });
}

// END initPerformanceOptimizations

// Categories -> filter static gallery items
function initCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');
    if (!categoryCards.length) return;

    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Allow smooth scroll to gallery if needed
            const category = this.getAttribute('data-category');
            // Delay filter to after scroll start
            setTimeout(() => filterStaticGallery(category), 50);
        });
    });
}

function filterStaticGallery(category) {
    const items = document.querySelectorAll('#gallery-grid .gallery-item');
    if (!items.length) return;

    if (!category || category === 'all') {
        items.forEach(el => el.style.display = '');
        return;
    }

    items.forEach(el => {
        const cat = el.getAttribute('data-category') || 'uncategorized';
        el.style.display = (cat === category) ? '' : 'none';
    });
}

// Hide empty categories based on gallery manifest
function initCategoryAvailability() {
    try {
        fetch('/assets/gallery-manifest.json?v=' + Date.now(), { cache: 'no-store' })
            .then(res => res.ok ? res.json() : null)
            .then(manifest => {
                const catsFromManifest = manifest && manifest.categories ? manifest.categories : null;
                const cards = document.querySelectorAll('.category-card');
                // Build a simple lookup of first image per category
                const firstByCat = {};
                if (catsFromManifest) {
                    Object.keys(catsFromManifest).forEach(cat => {
                        const arr = catsFromManifest[cat] || [];
                        if (arr.length) firstByCat[cat] = arr[0];
                    });
                }
                // Find a decent default image for the "All" card
                const allDefault = Object.values(firstByCat)[0] || '/blog/notattooimage.png';
                cards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (!cat) return;
                    if (cat === 'all') {
                        // Ensure an <img> thumb exists
                        ensureCategoryThumb(card, allDefault);
                        setBgFallback(card, allDefault);
                        return;
                    }
                    const arr = catsFromManifest ? catsFromManifest[cat] : null;
                    if (arr && arr.length) {
                        ensureCategoryThumb(card, arr[0]);
                        setBgFallback(card, arr[0]);
                    } else {
                        // Try a directory discovery fallback (works on local dev servers)
                        discoverFirstFromDirectories(cat).then(src => {
                            if (src) {
                                ensureCategoryThumb(card, src);
                                setBgFallback(card, src);
                            } else {
                                // Hide tiles with no images to avoid dead-ends
                                card.style.display = 'none';
                            }
                        });
                    }
                });
            })
            .catch(() => {});
    } catch (_) { /* ignore */ }
}

function ensureCategoryThumb(card, src) {
    try {
        let img = card.querySelector('img.bg-img');
        if (!img) {
            img = document.createElement('img');
            img.className = 'bg-img';
            img.alt = '';
            img.loading = 'lazy';
            img.decoding = 'async';
            img.onerror = function() {
                this.onerror = null;
                this.src = '/blog/notattooimage.png';
            };
            card.prepend(img); // place behind gradient and title
        }
        img.src = encodeURI(src);
    } catch (_) { /* ignore */ }
}

function setBgFallback(card, src) {
    try {
        card.style.backgroundImage = `url('${encodeURI(src)}')`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
    } catch (_) { /* ignore */ }
}

async function discoverFirstFromDirectories(cat) {
    const aliasMap = {
        fineline: ['fineline','thineline'],
        big: ['big','BIG','buddha']
    };
    const folders = aliasMap[cat] || [cat];
    const exts = ['.jpg','.jpeg','.png','.webp','.gif','.JPG','.JPEG','.PNG','.WEBP','.GIF'];
    const isImage = href => exts.some(ext => href.endsWith(ext));
    for (const folder of folders) {
        try {
            const resp = await fetch(`/assets/images/gallery/${folder}/`, { cache: 'no-store' });
            if (!resp.ok) continue;
            const html = await resp.text();
            const hrefs = Array.from(html.matchAll(/href=\"([^\"]+)\"/g)).map(m => m[1]);
            const first = hrefs.find(isImage);
            if (first) return `/assets/images/gallery/${folder}/${first}`;
        } catch (_) { /* ignore */ }
    }
    return null;
}
    // Preload only existing background images to avoid 404 noise
    const criticalImages = [
        'assets/images/background.jpg',
        'assets/images/background1.jpg',
        'assets/images/background2.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Service worker registration for caching
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }


// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
const isTouch = 'ontouchstart' in window;

// Add device classes to body
document.body.classList.add(isMobile ? 'mobile' : 'desktop');
if (isTablet) document.body.classList.add('tablet');
if (isTouch) document.body.classList.add('touch');

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'visible';
        }
    }
});

// Focus management for keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Optionally send error to analytics service
});

// Console branding
console.log('%c🎨 Bob\'s Tattoo', 'color: #ff6b35; font-size: 24px; font-weight: bold;');
console.log('%cWebsite crafted with ❤️', 'color: #666; font-size: 14px;');