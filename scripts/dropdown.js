// Function to get relative path prefix based on current page
function getRelativePathPrefix() {
    const path = window.location.pathname;
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    // For article pages (yyyy/mm/...)
    if (path.match(/\/\d{4}\/\d{2}\//)) {
        return isGitHubPages ? '/crumbsblog/' : '../../';
    } 
    // For about/contribute pages
    else if (path.includes('/p/')) {
        return isGitHubPages ? '/crumbsblog/' : '../';
    }
    // For home page
    return isGitHubPages ? '/crumbsblog/' : '';
}

// Function to initialize the article dropdown
function initializeArticleDropdown() {
    const dropdown = document.querySelector('.article-dropdown');
    if (!dropdown) {
        console.warn('Waiting for dropdown to be available...');
        return;
    }
    
    const button = dropdown.querySelector('.article-dropdown-button');
    const chevron = button.querySelector('.chevron-down');
    const currentArticle = button.querySelector('.current-article');
    const dropdownContent = dropdown.querySelector('.article-dropdown-content');
    
    // Clear any existing content
    dropdownContent.innerHTML = '';
    
    // Filter to only include published articles
    const publishedArticles = articleTitles.filter(article => isPostPublished(article.path));
    
    // Get random article and set it as current
    const randomIndex = Math.floor(Math.random() * publishedArticles.length);
    const randomArticle = publishedArticles[randomIndex];
    
    if (randomArticle) {
        const prefix = getRelativePathPrefix();
        currentArticle.textContent = randomArticle.short;
        currentArticle.closest('.article-dropdown-button').setAttribute('data-path', prefix + randomArticle.path);
        
        // Populate dropdown with all other published articles
        publishedArticles.forEach((article, index) => {
            if (index !== randomIndex) {
                const link = document.createElement('a');
                link.href = prefix + article.path;
                link.textContent = article.short;
                dropdownContent.appendChild(link);
            }
        });
    }
    
    // Toggle dropdown on chevron click
    chevron.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    
    // Navigate to article when current article or button is clicked
    button.addEventListener('click', function(e) {
        if (!e.target.closest('.chevron-down')) {  // Only navigate if not clicking chevron
            e.preventDefault();
            e.stopPropagation();
            const path = this.getAttribute('data-path');
            if (path) {
                window.location.href = path;
            }
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // Add hover effect to current article
    button.addEventListener('mouseenter', function() {
        currentArticle.style.textDecoration = 'underline';
    });
    
    button.addEventListener('mouseleave', function() {
        currentArticle.style.textDecoration = 'none';
    });
}

// Initialization is handled by templates.js