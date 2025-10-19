// Utility function to handle paths for both GitHub Pages and local development
function getBasePath() {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const path = window.location.pathname;
    
    if (isGitHubPages) {
        return '/crumbsblog/';
    } else {
        // Local development paths
        if (path.includes('/p/')) {
            return '../';
        } else if (path.match(/\/\d{4}\/\d{2}\//)) {
            return '../../';
        } else {
            return '';
        }
    }
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const basePath = getBasePath();
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    // Update all resource links that need the base path
    document.querySelectorAll('link[rel="stylesheet"], script[src]').forEach(element => {
        const src = element.getAttribute('src') || element.getAttribute('href');
        if (src && src.startsWith('/crumbsblog/')) {
            const relativePath = src.replace('/crumbsblog/', '');
            const newPath = basePath + relativePath;
            if (element.tagName === 'LINK') {
                element.setAttribute('href', newPath);
            } else {
                element.setAttribute('src', newPath);
            }
        }
    });

    // Also update image sources and links
    document.querySelectorAll('img[src], a[href]').forEach(element => {
        const src = element.getAttribute('src') || element.getAttribute('href');
        if (src && src.startsWith('/')) {
            const newPath = basePath + src.substring(1);
            if (element.tagName === 'IMG') {
                element.setAttribute('src', newPath);
            } else {
                element.setAttribute('href', newPath);
            }
        }
    });
});