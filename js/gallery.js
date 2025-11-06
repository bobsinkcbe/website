// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initGalleryFilters();
    // Modal disabled for pure image grid
});

// Gallery data (local images available in the repo)
const galleryData = [
    {
        id: 1,
        src: 'assets/images/gallery/Custom_design.JPG',
        alt: 'Custom Tattoo Design',
        category: 'color',
        artist: 'Prabhu D.A',
        title: 'Custom Design',
        description: 'A bespoke tattoo concept crafted to tell a personal story.'
    },
    {
        id: 2,
        src: 'assets/images/gallery/Sterlie_env.png',
        alt: 'Studio Work - Fine Line Details',
        category: 'blackwork',
        artist: 'Prabhu D.A',
        title: 'Fine Line Work',
        description: 'Clean lines and meticulous technique in a sterile environment.'
    },
    {
        id: 3,
        src: 'assets/images/gallery/Gemini_Generated_Image_rg7vucrg7vucrg7v.png',
        alt: 'Studio Artwork',
        category: 'neo-traditional',
        artist: 'Prabhu D.A',
        title: 'Studio Artwork',
        description: 'Conceptual art direction showcased in-studio.'
    },
    {
        id: 4,
        src: 'blog/notattooimage.png',
        alt: 'Recognized Artist Feature',
        category: 'realism',
        artist: 'Prabhu D.A',
        title: 'Recognized Artist',
        description: 'Celebrating recognized artistry with years of experience.'
    }
];

let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 8;
let filteredGallery = [...galleryData];

function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    // If the grid already has static items, skip dynamic loading
    if (galleryGrid && galleryGrid.children.length > 0) {
        return;
    }
    loadGalleryItems();
    initLoadMoreButton();
}

function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery
            filterGallery(filter);
        });
    });
}

function filterGallery(filter) {
    currentFilter = filter;
    currentPage = 1;
    
    // Filter data
    if (filter === 'all') {
        filteredGallery = [...galleryData];
    } else {
        filteredGallery = galleryData.filter(item => item.category === filter);
    }
    
    // Clear gallery and reload
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = '';
    
    // Add fade out animation
    galleryGrid.style.opacity = '0';
    
    setTimeout(() => {
        loadGalleryItems();
        galleryGrid.style.opacity = '1';
    }, 300);
}

function loadGalleryItems() {
    const galleryGrid = document.getElementById('gallery-grid');
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const itemsToShow = filteredGallery.slice(startIndex, endIndex);
    
    itemsToShow.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, index);
        galleryGrid.appendChild(galleryItem);
    });
    
    // Update load more button visibility
    updateLoadMoreButton();
    
    // Animate items in
    animateGalleryItems();
}

function createGalleryItem(item, index) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.style.setProperty('--item-index', index);
    galleryItem.setAttribute('data-category', item.category);
    // Pure image (no overlay, no title/artist, no modal)
    galleryItem.innerHTML = `
        <img src="${item.src}" alt="${item.alt}" loading="lazy">
    `;
    return galleryItem;
}

function initLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            
            // Add loading state
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                loadGalleryItems();
                this.textContent = 'Load More';
                this.disabled = false;
            }, 500);
        });
    }
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more');
    const totalItems = filteredGallery.length;
    const loadedItems = currentPage * itemsPerPage;
    
    if (loadMoreBtn) {
        if (loadedItems >= totalItems) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
}

function animateGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) scale(0.9)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
}

// Gallery Modal
function initGalleryModal() {
    createGalleryModal();
}

function createGalleryModal() {
    const modalHTML = `
        <div id="gallery-modal" class="gallery-modal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-image-container">
                    <img id="modal-image" src="" alt="">
                    <button class="modal-nav modal-prev" aria-label="Previous image">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="modal-nav modal-next" aria-label="Next image">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="modal-info">
                    <h3 id="modal-title"></h3>
                    <p id="modal-artist"></p>
                    <p id="modal-description"></p>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="bookConsultation()">
                            Book Consultation
                        </button>
                        <button class="btn btn-outline" onclick="shareImage()">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Style the modal
    const modalStyles = `
        <style>
            .gallery-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .gallery-modal.active {
                display: flex;
                opacity: 1;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
            }
            
            .modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                background: var(--background-dark);
                border-radius: var(--border-radius);
                overflow: hidden;
                display: grid;
                grid-template-columns: 2fr 1fr;
                box-shadow: var(--shadow-heavy);
            }
            
            .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.5);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                z-index: 1001;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition-fast);
            }
            
            .modal-close:hover {
                background: var(--primary-color);
            }
            
            .modal-image-container {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--background-light);
            }
            
            #modal-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
            
            .modal-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.5);
                border: none;
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition-fast);
            }
            
            .modal-prev {
                left: 20px;
            }
            
            .modal-next {
                right: 20px;
            }
            
            .modal-nav:hover {
                background: var(--primary-color);
            }
            
            .modal-info {
                padding: 40px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .modal-actions {
                display: flex;
                gap: 15px;
                margin-top: auto;
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    grid-template-columns: 1fr;
                    max-width: 95vw;
                    max-height: 95vh;
                }
                
                .modal-info {
                    padding: 20px;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    
    // Add event listeners
    const modal = document.getElementById('gallery-modal');
    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');
    
    modalClose.addEventListener('click', closeGalleryModal);
    modalOverlay.addEventListener('click', closeGalleryModal);
    modalPrev.addEventListener('click', showPreviousImage);
    modalNext.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeGalleryModal();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
}

let currentModalIndex = 0;

function openGalleryModal(item) {
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalArtist = document.getElementById('modal-artist');
    const modalDescription = document.getElementById('modal-description');
    
    // Find current index in filtered gallery
    currentModalIndex = filteredGallery.findIndex(galleryItem => galleryItem.id === item.id);
    
    // Update modal content
    modalImage.src = item.src;
    modalImage.alt = item.alt;
    modalTitle.textContent = item.title;
    modalArtist.textContent = `Artist: ${item.artist}`;
    modalDescription.textContent = item.description;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    modal.querySelector('.modal-close').focus();
}

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'visible';
}

function showPreviousImage() {
    currentModalIndex = currentModalIndex === 0 ? filteredGallery.length - 1 : currentModalIndex - 1;
    const item = filteredGallery[currentModalIndex];
    updateModalContent(item);
}

function showNextImage() {
    currentModalIndex = (currentModalIndex + 1) % filteredGallery.length;
    const item = filteredGallery[currentModalIndex];
    updateModalContent(item);
}

function updateModalContent(item) {
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalArtist = document.getElementById('modal-artist');
    const modalDescription = document.getElementById('modal-description');
    
    modalImage.style.opacity = '0';
    
    setTimeout(() => {
        modalImage.src = item.src;
        modalImage.alt = item.alt;
        modalTitle.textContent = item.title;
        modalArtist.textContent = `Artist: ${item.artist}`;
        modalDescription.textContent = item.description;
        modalImage.style.opacity = '1';
    }, 150);
}

// Action functions
function bookConsultation() {
    closeGalleryModal();
    
    // Scroll to booking section
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-fill description with reference to the viewed image
        setTimeout(() => {
            const descriptionField = document.getElementById('description');
            if (descriptionField && filteredGallery[currentModalIndex]) {
                const item = filteredGallery[currentModalIndex];
                descriptionField.value = `I'm interested in a design similar to "${item.title}" by ${item.artist}. `;
                descriptionField.focus();
            }
        }, 1000);
    }
}

function shareImage() {
    const item = filteredGallery[currentModalIndex];
    
    if (navigator.share) {
        navigator.share({
            title: `${item.title} - Bob's Tattoo`,
            text: `Check out this amazing tattoo: ${item.title} by ${item.artist}`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        const text = `Check out this amazing tattoo: ${item.title} by ${item.artist} at Bob's Tattoo`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${text} - ${url}`);
            showNotification('Link copied to clipboard!', 'success');
        } else {
            // Further fallback
            const shareText = `${text} - ${url}`;
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Link copied to clipboard!', 'success');
        }
    }
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    const modal = document.getElementById('gallery-modal');
    if (modal && modal.classList.contains('active')) {
        touchStartX = e.changedTouches[0].screenX;
    }
});

document.addEventListener('touchend', function(e) {
    const modal = document.getElementById('gallery-modal');
    if (modal && modal.classList.contains('active')) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            showNextImage();
        } else {
            // Swipe right - previous image
            showPreviousImage();
        }
    }
}