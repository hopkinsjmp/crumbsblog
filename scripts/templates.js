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

            // Update navigation links based on page depth
            if (elementId === 'header') {
                const isGitHubPages = window.location.hostname.includes('github.io');
                const path = window.location.pathname;
                let homePrefix = '';
                let pagesPrefix = '';
                
                if (isGitHubPages) {
                    // GitHub Pages paths
                    homePrefix = '/crumbsblog/';
                    pagesPrefix = '/crumbsblog/p/';
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
        
        if (isGitHubPages()) {
            // GitHub Pages paths - always use absolute paths
            if (path.includes('/crumbsblog/')) {
                basePath = '/crumbsblog/templates/';
                scriptsPath = '/crumbsblog/scripts/';
            } else {
                // Fallback if /crumbsblog/ is not in path
                basePath = '../templates/';
                scriptsPath = '../scripts/';
            }
        } else {
            // Local server paths
            if (path.includes('/p/')) {
                basePath = '../templates/';
                scriptsPath = '../scripts/';
            } else if (path.match(/\/\d{4}\/\d{2}\//)) {
                basePath = '../../templates/';
                scriptsPath = '../../scripts/';
            } else {
                basePath = 'templates/';
                scriptsPath = 'scripts/';
            }
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