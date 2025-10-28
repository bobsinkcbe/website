# Assets Directory Structure

This directory contains all media assets for the Bob's Tattoo website.

## Directory Structure

```
assets/
├── images/
│   ├── gallery/          # Tattoo portfolio images
│   │   ├── tattoo1.jpg   # Realistic portrait work
│   │   ├── tattoo2.jpg   # Japanese traditional
│   │   ├── tattoo3.jpg   # Neo-traditional designs
│   │   └── ...
│   ├── blog/             # Blog post featured images
│   │   ├── featured-post.jpg
│   │   ├── tattoo-styles.jpg
│   │   └── ...
│   ├── instagram/        # Instagram feed images
│   │   ├── post1.jpg
│   │   ├── post2.jpg
│   │   └── ...
│   ├── artist1.jpg       # Marcus Rivera photo
│   ├── artist2.jpg       # Sakura Chen photo
│   ├── artist3.jpg       # Alex Thompson photo
│   ├── studio-interior.jpg
│   ├── client1.jpg       # Testimonial photos
│   ├── client2.jpg
│   └── client3.jpg
├── videos/
│   └── hero-bg.mp4       # Hero section background video
└── favicon.ico           # Site favicon
```

## Image Requirements

### Gallery Images
- **Resolution**: 1200x1200px minimum
- **Format**: JPG or WebP
- **Quality**: High (tattoo details must be clear)
- **Naming**: Descriptive (e.g., `realistic-portrait-marcus.jpg`)

### Artist Photos
- **Resolution**: 800x800px
- **Format**: JPG
- **Style**: Professional headshots or action shots

### Blog Images
- **Resolution**: 1200x600px (2:1 aspect ratio)
- **Format**: JPG or WebP
- **Quality**: Medium-high for web performance

### Video Requirements
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD)
- **Duration**: 10-30 seconds (looping)
- **Size**: Under 5MB for web performance

## Optimization Tips

1. **Compress Images**: Use tools like TinyPNG or ImageOptim
2. **WebP Format**: Provide WebP versions for better compression
3. **Responsive Images**: Create multiple sizes for different devices
4. **Alt Text**: Always include descriptive alt text
5. **Lazy Loading**: Implemented in JavaScript for performance

## Placeholder Images

For development/testing, you can use:
- **Unsplash**: High-quality stock photos
- **Picsum**: Random placeholder images
- **Lorem Picsum**: Specific size placeholders

Example placeholder URLs:
- Gallery: `https://picsum.photos/800/800?random=1`
- Blog: `https://picsum.photos/1200/600?random=2`
- Artists: `https://picsum.photos/400/400?random=3`

## Copyright Notice

Ensure all images used have proper licensing:
- Original photography from the studio
- Licensed stock photos
- Creative Commons images with attribution
- Client work with signed releases