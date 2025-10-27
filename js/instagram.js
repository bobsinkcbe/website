// Instagram Feed Integration
document.addEventListener('DOMContentLoaded', function() {
    initInstagramFeed();
});

// Instagram configuration
const instagramConfig = {
    username: 'inkhavenstudio',
    postsToShow: 12,
    accessToken: 'YOUR_INSTAGRAM_ACCESS_TOKEN', // Replace with actual token
    refreshInterval: 300000 // 5 minutes
};

// Mock Instagram data (replace with actual API integration)
const mockInstagramPosts = [
    {
        id: '1',
        media_url: 'assets/images/instagram/post1.jpg',
        caption: 'Fresh ink by Marcus! This realistic portrait took 8 hours of detailed work. #realism #portrait #tattoo',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example1',
        timestamp: '2024-10-25T10:00:00Z',
        like_count: 245,
        comments_count: 18
    },
    {
        id: '2',
        media_url: 'assets/images/instagram/post2.jpg',
        caption: 'Traditional Japanese dragon by Sakura Chen. The detail in the scales is incredible! #japanese #traditional #dragon',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example2',
        timestamp: '2024-10-24T15:30:00Z',
        like_count: 312,
        comments_count: 25
    },
    {
        id: '3',
        media_url: 'assets/images/instagram/post3.jpg',
        caption: 'Neo-traditional rose sleeve in progress by Alex Thompson. Can\'t wait to see the final result! #neotrad #rose #sleeve',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example3',
        timestamp: '2024-10-23T12:15:00Z',
        like_count: 189,
        comments_count: 12
    },
    {
        id: '4',
        media_url: 'assets/images/instagram/post4.jpg',
        caption: 'Geometric mandala finished today! The symmetry is absolutely perfect ✨ #geometric #mandala #blackwork',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example4',
        timestamp: '2024-10-22T09:45:00Z',
        like_count: 167,
        comments_count: 8
    },
    {
        id: '5',
        media_url: 'assets/images/instagram/post5.jpg',
        caption: 'Watercolor phoenix rising from the ashes. The color blending is phenomenal! 🔥 #watercolor #phoenix #color',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example5',
        timestamp: '2024-10-21T16:20:00Z',
        like_count: 298,
        comments_count: 22
    },
    {
        id: '6',
        media_url: 'assets/images/instagram/post6.jpg',
        caption: 'Behind the scenes: Marcus working on another realistic masterpiece. The concentration is real! #behindthescenes #artist',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example6',
        timestamp: '2024-10-20T11:10:00Z',
        like_count: 156,
        comments_count: 15
    },
    {
        id: '7',
        media_url: 'assets/images/instagram/post7.jpg',
        caption: 'Traditional anchor with rope details. Classic sailor tattoo never goes out of style ⚓ #traditional #anchor #sailor',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example7',
        timestamp: '2024-10-19T14:30:00Z',
        like_count: 134,
        comments_count: 9
    },
    {
        id: '8',
        media_url: 'assets/images/instagram/post8.jpg',
        caption: 'Neo-traditional wolf with sacred geometry elements. The combination is stunning! 🐺 #neotrad #wolf #geometry',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example8',
        timestamp: '2024-10-18T13:45:00Z',
        like_count: 221,
        comments_count: 16
    },
    {
        id: '9',
        media_url: 'assets/images/instagram/post9.jpg',
        caption: 'Fresh blackwork tribal design. Bold lines and perfect execution by our team! #blackwork #tribal #bold',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example9',
        timestamp: '2024-10-17T10:20:00Z',
        like_count: 178,
        comments_count: 11
    },
    {
        id: '10',
        media_url: 'assets/images/instagram/post10.jpg',
        caption: 'Colorful koi fish swimming upstream. The gradient work is absolutely beautiful! 🐟 #koi #color #japanese',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example10',
        timestamp: '2024-10-16T17:15:00Z',
        like_count: 267,
        comments_count: 19
    },
    {
        id: '11',
        media_url: 'assets/images/instagram/post11.jpg',
        caption: 'Portrait session with incredible detail work. Every line tells a story ✨ #portrait #realism #detail',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example11',
        timestamp: '2024-10-15T12:00:00Z',
        like_count: 203,
        comments_count: 14
    },
    {
        id: '12',
        media_url: 'assets/images/instagram/post12.jpg',
        caption: 'Studio vibes tonight! The team is working on some amazing pieces 🎨 #studio #team #tattoolife',
        media_type: 'IMAGE',
        permalink: 'https://instagram.com/p/example12',
        timestamp: '2024-10-14T19:30:00Z',
        like_count: 145,
        comments_count: 20
    }
];

let instagramPosts = [];
let isLoading = false;

function initInstagramFeed() {
    const instagramGrid = document.getElementById('instagram-grid');
    if (!instagramGrid) return;
    
    // Show loading state
    showInstagramLoading();
    
    // Load Instagram posts
    loadInstagramPosts();
    
    // Set up periodic refresh
    setInterval(refreshInstagramFeed, instagramConfig.refreshInterval);
}

function loadInstagramPosts() {
    if (isLoading) return;
    
    isLoading = true;
    
    // In a real application, this would make an API call to Instagram
    // For demo purposes, we'll use mock data
    setTimeout(() => {
        instagramPosts = mockInstagramPosts.slice(0, instagramConfig.postsToShow);
        renderInstagramFeed();
        isLoading = false;
    }, 1000);
}

function showInstagramLoading() {
    const instagramGrid = document.getElementById('instagram-grid');
    instagramGrid.innerHTML = '';
    
    // Create loading skeleton
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'instagram-skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-content">
                <div class="skeleton-image"></div>
                <div class="skeleton-overlay">
                    <div class="skeleton-icon"></div>
                </div>
            </div>
        `;
        
        // Style the skeleton
        skeleton.style.cssText = `
            aspect-ratio: 1;
            border-radius: var(--border-radius);
            overflow: hidden;
            position: relative;
            background: var(--background-light);
        `;
        
        instagramGrid.appendChild(skeleton);
    }
    
    // Add skeleton styles
    addSkeletonStyles();
}

function addSkeletonStyles() {
    if (document.getElementById('skeleton-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'skeleton-styles';
    styles.textContent = `
        .skeleton-content {
            width: 100%;
            height: 100%;
            position: relative;
        }
        
        .skeleton-image {
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, var(--background-light) 25%, var(--background-dark) 50%, var(--background-light) 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
        }
        
        .skeleton-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .skeleton-icon {
            width: 30px;
            height: 30px;
            background: rgba(255, 107, 53, 0.3);
            border-radius: 50%;
            animation: skeleton-pulse 1s infinite alternate;
        }
        
        @keyframes skeleton-loading {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }
        
        @keyframes skeleton-pulse {
            0% {
                opacity: 0.3;
            }
            100% {
                opacity: 0.7;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

function renderInstagramFeed() {
    const instagramGrid = document.getElementById('instagram-grid');
    instagramGrid.innerHTML = '';
    
    instagramPosts.forEach((post, index) => {
        const postElement = createInstagramPost(post, index);
        instagramGrid.appendChild(postElement);
    });
    
    // Animate posts in
    animateInstagramPosts();
}

function createInstagramPost(post, index) {
    const postElement = document.createElement('div');
    postElement.className = 'instagram-post';
    postElement.style.setProperty('--item-index', index);
    
    // Create fallback image URL
    const fallbackImage = `https://picsum.photos/400/400?random=${post.id}`;
    
    postElement.innerHTML = `
        <img src="${post.media_url || fallbackImage}" 
             alt="${truncateCaption(post.caption)}" 
             loading="lazy"
             onerror="this.src='${fallbackImage}'">
        <div class="instagram-overlay">
            <div class="instagram-stats">
                <span class="instagram-likes">
                    <i class="fas fa-heart"></i>
                    ${formatCount(post.like_count)}
                </span>
                <span class="instagram-comments">
                    <i class="fas fa-comment"></i>
                    ${formatCount(post.comments_count)}
                </span>
            </div>
            <div class="instagram-caption">
                ${truncateCaption(post.caption, 60)}
            </div>
        </div>
    `;
    
    // Add click handler
    postElement.addEventListener('click', () => {
        openInstagramPost(post);
    });
    
    return postElement;
}

function truncateCaption(caption, maxLength = 100) {
    if (!caption) return 'View on Instagram';
    
    if (caption.length <= maxLength) return caption;
    
    return caption.substring(0, maxLength).trim() + '...';
}

function formatCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

function animateInstagramPosts() {
    const posts = document.querySelectorAll('.instagram-post');
    
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            post.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            post.style.opacity = '1';
            post.style.transform = 'scale(1)';
        }, index * 100);
    });
}

function openInstagramPost(post) {
    // Open Instagram post in new tab/window
    if (post.permalink) {
        window.open(post.permalink, '_blank', 'noopener,noreferrer');
    } else {
        // Fallback to Instagram profile
        window.open(`https://instagram.com/${instagramConfig.username}`, '_blank', 'noopener,noreferrer');
    }
    
    // Track engagement (analytics)
    trackInstagramEngagement(post.id, 'click');
}

function refreshInstagramFeed() {
    // Only refresh if the Instagram section is visible
    const instagramSection = document.querySelector('.instagram-feed');
    if (!instagramSection || !isElementInViewport(instagramSection)) {
        return;
    }
    
    console.log('Refreshing Instagram feed...');
    loadInstagramPosts();
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function trackInstagramEngagement(postId, action) {
    // In a real application, this would send analytics data
    console.log(`Instagram engagement: ${action} on post ${postId}`);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'instagram_engagement', {
            'event_category': 'Social Media',
            'event_label': postId,
            'custom_parameter': action
        });
    }
}

// Error handling for Instagram API
function handleInstagramError(error) {
    console.error('Instagram feed error:', error);
    
    const instagramGrid = document.getElementById('instagram-grid');
    instagramGrid.innerHTML = `
        <div class="instagram-error">
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Unable to load Instagram feed</h4>
                <p>Please visit our Instagram profile directly</p>
                <a href="https://instagram.com/${instagramConfig.username}" 
                   target="_blank" 
                   class="btn btn-primary">
                    <i class="fab fa-instagram"></i>
                    Visit Instagram
                </a>
            </div>
        </div>
    `;
    
    // Style the error message
    const errorElement = instagramGrid.querySelector('.instagram-error');
    errorElement.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px 20px;
        background: var(--background-light);
        border-radius: var(--border-radius);
        border: 2px dashed var(--text-secondary);
    `;
}

// Instagram API integration (commented out - requires actual API setup)
/*
async function fetchInstagramPosts() {
    try {
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,permalink,timestamp&access_token=${instagramConfig.accessToken}&limit=${instagramConfig.postsToShow}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        handleInstagramError(error);
        return [];
    }
}
*/

// Intersection Observer for lazy loading Instagram section
function initInstagramLazyLoading() {
    const instagramSection = document.querySelector('.instagram-feed');
    if (!instagramSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && instagramPosts.length === 0) {
                loadInstagramPosts();
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    observer.observe(instagramSection);
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', function() {
    initInstagramLazyLoading();
});

// Utility function to validate Instagram access token
function validateAccessToken() {
    // In a real application, this would validate the token with Instagram API
    return instagramConfig.accessToken && instagramConfig.accessToken !== 'YOUR_INSTAGRAM_ACCESS_TOKEN';
}

// Handle Instagram widget resize
function handleInstagramResize() {
    const instagramGrid = document.getElementById('instagram-grid');
    if (!instagramGrid) return;
    
    // Recalculate grid layout if needed
    const posts = instagramGrid.querySelectorAll('.instagram-post');
    posts.forEach(post => {
        // Force repaint for proper sizing
        post.style.height = post.offsetWidth + 'px';
    });
}

// Add resize listener
window.addEventListener('resize', debounce(handleInstagramResize, 250));

// Export functions for external use
window.refreshInstagramFeed = refreshInstagramFeed;
window.openInstagramProfile = function() {
    window.open(`https://instagram.com/${instagramConfig.username}`, '_blank', 'noopener,noreferrer');
};