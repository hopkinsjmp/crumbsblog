// Load templates first, then initialize sidebar
window.addEventListener('load', async function() {
    // Function to fetch and insert template content
    async function includeTemplate(elementId, templatePath) {
        try {
            console.log(`Loading template: ${templatePath}`);
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            console.log(`Template loaded: ${templatePath}`);
            
            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error(`Element #${elementId} not found`);
            }
            
            // Special handling for sidebar
            if (elementId === 'sidebar') {
                element.innerHTML = `
                    <aside class="sidebar-container sidebar-invisible">
                        <div class="sidebar-content">
                            ${content}
                        </div>
                    </aside>
                `;
                console.log('Sidebar content inserted');
            } else {
                element.innerHTML = content;
            }

            // Update navigation links based on page depth and hosting
            if (elementId === 'header' || elementId === 'sidebar') {
                const hostname = window.location.hostname;
                const path = window.location.pathname;
                let homePrefix = '';
                let pagesPrefix = '';

                // Detect hosting environment
                const isGitHubPages = hostname.includes('github.io');
                const isCustomDomain = !(isGitHubPages || hostname === 'localhost' || hostname === '127.0.0.1');

                if (isGitHubPages) {
                    // GitHub Pages paths
                    homePrefix = '/crumbsblog/';
                    pagesPrefix = '/crumbsblog/p/';
                } else if (isCustomDomain) {
                    // Custom domain: root-relative paths
                    homePrefix = '/';
                    pagesPrefix = '/p/';
                } else {
                    // Local server paths
                    if (path.includes('/p/')) {
                        homePrefix = '../';
                        pagesPrefix = '';
                    } else if (path.match(/\/\d{4}\/\d{2}\//)) {
                        homePrefix = '../../';
                        pagesPrefix = '../../p/';
                    } else {
                        homePrefix = '';
                        pagesPrefix = 'p/';
                    }
                }

                // Update home links
                element.querySelectorAll('.home-link').forEach(link => {
                    link.href = homePrefix;
                });

                // Update about link
                element.querySelectorAll('.about-link').forEach(link => {
                    link.href = pagesPrefix + 'about.html';
                });

                // Update contribute link
                element.querySelectorAll('.contribute-link').forEach(link => {
                    link.href = pagesPrefix + 'contribute.html';
                });

                // Update legal links
                element.querySelectorAll('.terms-link').forEach(link => {
                    link.href = pagesPrefix + 'terms.html';
                });
                element.querySelectorAll('.privacy-link').forEach(link => {
                    link.href = pagesPrefix + 'privacy.html';
                });
                element.querySelectorAll('.cookies-link').forEach(link => {
                    link.href = pagesPrefix + 'cookies.html';
                });
                element.querySelectorAll('.copyright-link').forEach(link => {
                    link.href = pagesPrefix + 'copyright.html';
                });
            }
        } catch (error) {
            console.error(`Error loading template ${templatePath}:`, error);
        }
    }

    try {
        // Function to determine if we're on GitHub Pages
        const isGitHubPages = () => window.location.hostname.includes('github.io');
        
        // Get the base paths based on current page location
        let basePath = '';
        let scriptsPath = '';
        const path = window.location.pathname;
        
        if (path.includes('/p/')) {
            // About/contribute pages
            basePath = isGitHubPages() ? '/crumbsblog/templates/' : '../templates/';
            scriptsPath = isGitHubPages() ? '/crumbsblog/scripts/' : '../scripts/';
        } else if (path.match(/\/\d{4}\/\d{2}\//)) {
            // Article pages
            basePath = isGitHubPages() ? '/crumbsblog/templates/' : '../../templates/';
            scriptsPath = isGitHubPages() ? '/crumbsblog/scripts/' : '../../scripts/';
        } else {
            // Home page
            basePath = isGitHubPages() ? '/crumbsblog/templates/' : 'templates/';
            scriptsPath = isGitHubPages() ? '/crumbsblog/scripts/' : 'scripts/';
        }

        // Make these paths available globally
        window.basePath = basePath;
        window.scriptsPath = scriptsPath;
        
        // Load all templates with correct path
        await Promise.all([
            includeTemplate('header', basePath + 'header.html'),
            includeTemplate('footer', basePath + 'footer.html'),
            includeTemplate('sidebar', basePath + 'sidebar.html')
        ]);

        // Initialize components after all templates are loaded
        setTimeout(() => {
            initializeSidebar();
            
            // Retry dropdown initialization a few times
            let dropdownAttempts = 0;
            const initDropdown = () => {
                if (document.querySelector('.article-dropdown')) {
                    initializeArticleDropdown();
                } else if (dropdownAttempts < 5) {
                    dropdownAttempts++;
                    setTimeout(initDropdown, 100);
                }
            };
            initDropdown();
        }, 0);
    } catch (error) {
        console.error('Error loading templates:', error);
    }
});