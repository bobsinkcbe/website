# Bob's Tattoo - Premium Tattoo Studio Website

A modern, visually striking website for a tattoo studio that blends edgy artistry with professional polish. Built with HTML5, CSS3, and vanilla JavaScript for optimal performance and SEO.

## 🎨 Features

### Design & Aesthetics
- **Dark, Moody Theme**: Professional dark aesthetic with bold typography
- **High-Resolution Imagery**: Optimized gallery showcasing tattoo artwork
- **Smooth Animations**: CSS3 and AOS library animations for engaging UX
- **Modern Typography**: Google Fonts (Oswald & Roboto) for striking headlines

### Core Sections
- **Hero Section**: Video background with compelling call-to-action
- **Artist Portfolios**: Individual artist showcases with specialties
- **Interactive Gallery**: Filterable portfolio with lightbox modal
- **Studio Story**: About section with statistics and history
- **Booking System**: Advanced form with price estimation
- **Aftercare Guide**: Step-by-step healing instructions
- **Client Testimonials**: Rotating testimonial slider
- **Blog Section**: SEO-optimized content management

### Technical Features
- **Mobile Responsive**: Optimized for all device sizes
- **Fast Loading**: Lazy loading, image optimization, service worker
- **SEO Friendly**: Semantic HTML, meta tags, structured data
- **Instagram Integration**: Live feed from studio social media
- **Form Validation**: Real-time validation with error handling
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development) or hosting service
- Text editor (VS Code recommended)

### Installation

1. **Clone/Download the Project**
   ```bash
   git clone <repository-url>
   cd bobs-website
   ```

2. **Set Up Local Server**
   
   **Option A: Using Python (if installed)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js (if installed)**
   ```bash
   npx http-server
   ```
   
   **Option C: Using VS Code Live Server Extension**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Access the Website**
   - Open browser and navigate to `http://localhost:8000`
   - Or the URL provided by your chosen server method

## 📁 Project Structure

```
bobs-website/
├── index.html              # Main homepage
├── blog.html              # Blog listing page
├── sw.js                  # Service worker for caching
├── css/
│   ├── styles.css         # Main stylesheet
│   ├── animations.css     # Animation utilities
│   ├── responsive.css     # Mobile responsiveness
│   └── blog.css          # Blog-specific styles
├── js/
│   ├── main.js           # Core functionality
│   ├── gallery.js        # Gallery & lightbox
│   ├── booking.js        # Booking form logic
│   └── instagram.js      # Social media integration
└── assets/
    ├── images/           # Image assets
    ├── videos/           # Video backgrounds
    └── favicon.ico       # Site favicon
```

## 🛠️ Customization

### Branding
1. **Logo & Studio Name**: Update in `index.html` and `blog.html`
   ```html
   <div class="nav-logo">
       <h2>YOUR STUDIO NAME</h2>
   </div>
   ```

2. **Color Scheme**: Modify CSS custom properties in `css/styles.css`
   ```css
   :root {
       --primary-color: #ff6b35;        /* Main accent color */
       --secondary-color: #1a1a1a;      /* Dark theme color */
       --background-dark: #0a0a0a;      /* Main background */
   }
   ```

3. **Contact Information**: Update in footer and contact sections

### Content Management

#### Adding Artists
1. Update the artists section in `index.html`
2. Add artist images to `assets/images/`
3. Update artist data in `js/booking.js` for booking integration

#### Gallery Management
1. Add images to `assets/images/gallery/`
2. Update gallery data array in `js/gallery.js`
3. Ensure proper categorization for filtering

#### Blog Posts
1. Create new HTML files in `blog/` directory
2. Update blog listing in `blog.html`
3. Add blog images to `assets/images/blog/`

### Instagram Integration
1. Obtain Instagram Access Token from Facebook Developers
2. Update `instagramConfig` in `js/instagram.js`
3. Replace mock data with live API integration

## 📱 Mobile Optimization

The website is fully responsive with breakpoints at:
- 576px (Mobile)
- 768px (Tablet)
- 992px (Desktop)
- 1200px (Large Desktop)

Key mobile features:
- Touch-friendly navigation
- Optimized image sizes
- Reduced animations for performance
- Swipe gestures for gallery

## 🔧 Performance Features

### Optimization Techniques
- **Lazy Loading**: Images load as needed
- **Service Worker**: Caches resources for offline use
- **Minified Assets**: Compressed CSS and JS
- **Optimized Images**: WebP format support with fallbacks
- **Critical CSS**: Above-the-fold styling prioritized

### Speed Enhancements
- **Preloader**: Smooth loading experience
- **Debounced Events**: Optimized scroll and resize handlers
- **Efficient Animations**: GPU-accelerated transforms
- **Font Loading**: Optimized Google Fonts loading

## 🔍 SEO Features

### On-Page SEO
- Semantic HTML5 structure
- Meta descriptions and keywords
- Open Graph tags for social sharing
- Structured data markup
- XML sitemap ready

### Content Strategy
- Blog section for content marketing
- Artist bio pages for local SEO
- Gallery with alt text descriptions
- Contact information for local business

## 🧪 Testing

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Device Testing
- iPhone SE to iPhone 14 Pro Max
- iPad Mini to iPad Pro
- Android devices (various sizes)
- Desktop monitors up to 4K

## 🚢 Deployment

### Static Hosting (Recommended)
1. **Netlify**: Drag & drop deployment
2. **Vercel**: Git integration with automatic deploys
3. **GitHub Pages**: Free hosting for repositories

### Traditional Hosting
1. Upload files via FTP to web server
2. Ensure HTTPS is enabled
3. Configure server for single-page application if needed

### Pre-Deployment Checklist
- [ ] Update contact information
- [ ] Replace placeholder images
- [ ] Configure Instagram API
- [ ] Test all forms and functionality
- [ ] Verify mobile responsiveness
- [ ] Check loading speeds

## 📊 Analytics & Tracking

### Google Analytics Setup
1. Create Google Analytics account
2. Add tracking code to all HTML files
3. Set up goal conversions for bookings

### Recommended Events to Track
- Booking form submissions
- Gallery image views
- Social media clicks
- Blog post reads
- Contact form interactions

## 🔧 Maintenance

### Regular Updates
- **Content**: Update portfolio images monthly
- **Blog**: Publish new articles weekly
- **Social Media**: Refresh Instagram feed
- **Software**: Update dependencies as needed

### Backup Strategy
- Regular file backups
- Database backups (if dynamic content added)
- Version control with Git

## 🆘 Troubleshooting

### Common Issues

**Images Not Loading**
- Check file paths are correct
- Ensure images are in proper format (JPG, PNG, WebP)
- Verify image file permissions

**Forms Not Working**
- Check form validation JavaScript
- Ensure proper form action endpoints
- Verify server-side processing if implemented

### Booking emails (FormSubmit setup)
This site is static and uses FormSubmit to email booking requests directly to `bobsinkcbe@gmail.com`.

Configured files:
- `index.html`: booking form `action="https://formsubmit.co/bobsinkcbe@gmail.com"` with hidden `_captcha=false`, `_template=table`, `_subject`, and `_next`.
- `assets/booking-config.json`: provider set to `formsubmit` with the AJAX endpoint.
- `js/booking.js`: sends via AJAX first; if it fails, it falls back to posting the form to FormSubmit in a new tab.

First-time verification: FormSubmit sends a verification email to the recipient the first time. Please check the inbox/spam folder and click the verification link. Emails will not deliver until verified.

Alternatives: If you prefer EmailJS, Getform, Netlify Forms, or Formspree, we can switch the adapter by updating the config and a small part of `booking.js`.

**Slow Loading**
- Optimize image sizes
- Check network requests in browser dev tools
- Verify service worker is functioning

**Mobile Issues**
- Test on actual devices, not just browser dev tools
- Check touch event handlers
- Verify viewport meta tag is present

## 📞 Support

For technical support or customization services:
- Email: bobsinkcbe@gmail.com
- Documentation: Check inline code comments
- Issues: Create GitHub issue for bugs

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Credits

- **Fonts**: Google Fonts (Oswald, Roboto)
- **Icons**: Font Awesome
- **Animations**: AOS (Animate On Scroll)
- **Images**: Custom photography and stock images
- **Design**: Modern tattoo studio aesthetic inspiration

---

**Built with ❤️ for the tattoo community**