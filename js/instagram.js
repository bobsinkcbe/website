// Instagram Feed Integration
document.addEventListener('DOMContentLoaded', function() {
    initInstagramFeed();
});

// Instagram configuration
const instagramConfig = {
    username: 'bobs_tattoo',
    postsToShow: 12,
    accessToken: 'YOUR_INSTAGRAM_ACCESS_TOKEN', // Not used for embed option
    refreshInterval: 300000, // 5 minutes
    useEmbeds: true, // Can be used as fallback, but we'll prefer tiles from permalinks
};

// Removed legacy mock Instagram data to avoid shipping unused assets.

let instagramPosts = [];
let isLoading = false;

function initInstagramFeed() {
    const instagramGrid = document.getElementById('instagram-grid');
    if (!instagramGrid) return;
    
    // Show loading state
    showInstagramLoading();
    
    // Load Instagram posts (embeds first, then fallback to mock)
    loadInstagramPosts();
    
    // Set up periodic refresh
    setInterval(refreshInstagramFeed, instagramConfig.refreshInterval);
}

async function loadInstagramPosts() {
    if (isLoading) return;
    
    isLoading = true;

    // Try to load local permalinks for official Instagram embeds
    let permalinks = [];
    let tileItems = [];
    try {
        const res = await fetch('assets/instagram.json?cb=' + Date.now());
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
                // Determine if array of strings (permalinks) or objects ({url, image})
                if (data.length && typeof data[0] === 'string') {
                    permalinks = data;
                } else if (data.length && typeof data[0] === 'object') {
                    tileItems = data.filter(x => x && x.url && x.image);
                }
            } else if (data) {
                if (Array.isArray(data.permalinks)) permalinks = data.permalinks;
                if (Array.isArray(data.items)) {
                    // Normalize items from workflow (may include id/ts)
                    tileItems = data.items
                      .filter(x => x && (x.image || x.media_url) && (x.url || x.permalink))
                      .map(x => ({ image: x.image || x.media_url, url: x.url || x.permalink }));
                }
            }
        }
    } catch (e) {
        // ignore and fallback
    }

    if (tileItems.length > 0) {
        // Show all tiles in scrolling mode
        renderInstagramTiles(tileItems);
        isLoading = false;
        return;
    }

    // Prefer horizontal tiles using Instagram-hosted preview images derived from permalinks
    if (permalinks.length > 0) {
        const itemsFromPermalinks = permalinks
            .slice(0, instagramConfig.postsToShow)
            .map(url => ({ url, image: permalinkToImage(url, 'l') }));
        renderInstagramTiles(itemsFromPermalinks);
        isLoading = false;
        return;
    }

    // Do NOT fallback to mock images; show a clean message instead
    renderNoInstagramPosts();
    isLoading = false;
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

function renderInstagramTiles(items) {
    const instagramGrid = document.getElementById('instagram-grid');
    instagramGrid.innerHTML = '';

    // Make it a horizontal scroller
    instagramGrid.classList.add('instagram-scroll');

    items.forEach((item, index) => {
        const tile = document.createElement('div');
        tile.className = 'instagram-tile';
        tile.style.setProperty('--item-index', index);

        const a = document.createElement('a');
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.ariaLabel = 'Open on Instagram';

        const img = document.createElement('img');
        img.alt = 'Instagram post';
        img.loading = 'lazy';

        // Try multiple image sizes; if all fail, fallback to official embed
        const sizes = ['l', 'm', 't'];
        let attempt = 0;
        const tryNext = () => {
            if (attempt < sizes.length) {
                img.src = permalinkToImage(item.url, sizes[attempt++]);
            } else {
                // Fallback to official embed inside the scroller to ensure content shows
                const grid = document.getElementById('instagram-grid');
                grid.classList.add('embeds');
                const embedWrap = document.createElement('div');
                embedWrap.className = 'instagram-post embed';
                embedWrap.style.flex = '0 0 auto';

                const block = document.createElement('blockquote');
                block.className = 'instagram-media';
                block.setAttribute('data-instgrm-permalink', item.url);
                block.setAttribute('data-instgrm-version', '14');
                block.style.background = 'transparent';
                block.style.border = '0';
                block.style.margin = '0 auto';
                block.style.width = '100%';

                embedWrap.appendChild(block);
                tile.replaceWith(embedWrap);
                ensureInstagramEmbedScript();
            }
        };
        img.addEventListener('error', tryNext);
        tryNext();

        a.appendChild(img);
        tile.appendChild(a);
        instagramGrid.appendChild(tile);
    });
}

function renderInstagramEmbeds(permalinks) {
    const instagramGrid = document.getElementById('instagram-grid');
    instagramGrid.innerHTML = '';

    // Grid embeds (kept as fallback; default path uses tiles now)
    instagramGrid.classList.remove('instagram-scroll', 'embeds');

    permalinks.forEach((url, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'instagram-post embed';
        wrapper.style.setProperty('--item-index', index);

        // No special sizing here; grid fallback

        const block = document.createElement('blockquote');
        block.className = 'instagram-media';
        block.setAttribute('data-instgrm-permalink', url);
        block.setAttribute('data-instgrm-version', '14');
        block.style.background = 'transparent';
        block.style.border = '0';
        block.style.margin = '0 auto';
        block.style.maxWidth = '540px';
        block.style.width = '100%';

        wrapper.appendChild(block);
        instagramGrid.appendChild(wrapper);
    });

    ensureInstagramEmbedScript();
}

function ensureInstagramEmbedScript() {
    function process() {
        if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
            window.instgrm.Embeds.process();
        }
    }

    if (window.instgrm && window.instgrm.Embeds) {
        process();
        return;
    }

    // Load script once
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.instagram.com/embed.js';
        s.onload = process;
        document.body.appendChild(s);
    } else {
        // Script present but not ready yet
        setTimeout(process, 500);
    }
}

function renderNoInstagramPosts() {
    const instagramGrid = document.getElementById('instagram-grid');
    if (!instagramGrid) return;
    instagramGrid.classList.remove('instagram-scroll');
    instagramGrid.innerHTML = `
        <div class="instagram-error" style="grid-column: 1 / -1; text-align: center; padding: 30px; border-radius: var(--border-radius); background: var(--background-secondary);">
            <h4 style="margin-bottom: 10px;">Instagram posts unavailable</h4>
            <p style="color: var(--text-secondary); margin-bottom: 15px;">We couldn't load posts right now.</p>
            <a href="https://instagram.com/${instagramConfig.username}" target="_blank" class="btn btn-primary">View on Instagram</a>
        </div>
    `;
}

// Build an image URL from an Instagram permalink by extracting the shortcode
function permalinkToImage(url, size = 'l') {
    try {
        // Accept /p/, /reel/, /tv/ formats
        const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([^\/?#]+)/i);
        const code = m && m[1] ? m[1] : '';
        if (!code) return 'https://picsum.photos/400/400?random=9999';
        // This endpoint redirects to the CDN image; works fine as <img src>
        return `https://www.instagram.com/p/${code}/media/?size=${size}`;
    } catch (e) {
        return 'https://picsum.photos/400/400?random=9999';
    }
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