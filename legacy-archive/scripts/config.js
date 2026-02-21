// Site configuration
const siteConfig = {
    // Set this to true when using a custom domain
    useCustomDomain: false,
    
    // The custom domain name (when ready)
    customDomain: 'crumbsofsanity.com',
    
    // The GitHub Pages path (used when useCustomDomain is false)
    githubPagesPath: '/crumbsblog'
};

// Function to get the correct base path for assets and links
function getBasePath() {
    if (siteConfig.useCustomDomain) {
        return '/';
    }

    if (window.location.hostname.includes('github.io')) {
        return siteConfig.githubPagesPath + '/';
    }

    // Local development - use relative paths based on current location
    const path = window.location.pathname;
    if (path.includes('/p/')) {
        return '../';
    } else if (path.match(/\/\d{4}\/\d{2}\//)) {
        return '../../';
    } else {
        return '';
    }
}

// Function to get the absolute base URL for the site
function getBaseUrl() {
    if (siteConfig.useCustomDomain) {
        return `https://${siteConfig.customDomain}`;
    }
    if (window.location.hostname.includes('github.io')) {
        return `https://${window.location.hostname}${siteConfig.githubPagesPath}`;
    }
    return window.location.origin;
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const basePath = getBasePath();
    
    // Update all resource links that need the base path
    document.querySelectorAll('link[rel="stylesheet"], script[src]').forEach(element => {
        const src = element.getAttribute('src') || element.getAttribute('href');
        if (src && (src.startsWith('/crumbsblog/') || src.startsWith('/'))) {
            const relativePath = src.replace(/^\/crumbsblog\/|^\//, '');
            const newPath = basePath + relativePath;
            if (element.tagName === 'LINK') {
                element.setAttribute('href', newPath);
            } else {
                element.setAttribute('src', newPath);
            }
        }
    });

    // Update all internal links and images
    document.querySelectorAll('a[href], img[src]').forEach(element => {
        const attr = element.hasAttribute('href') ? 'href' : 'src';
        const value = element.getAttribute(attr);
        if (value && (value.startsWith('/crumbsblog/') || value.startsWith('/'))) {
            const relativePath = value.replace(/^\/crumbsblog\/|^\//, '');
            const newPath = basePath + relativePath;
            element.setAttribute(attr, newPath);
        }
    });
});