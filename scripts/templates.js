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
                let homePrefix = '';
                
                // Add /crumbsblog/ prefix if on GitHub Pages
                if (isGitHubPages) {
                    homePrefix = '/crumbsblog/';
                }

                // Add relative path based on current location
                if (window.location.pathname.includes('/p/')) {
                    homePrefix += '../';
                } else if (window.location.pathname.match(/\/\d{4}\/\d{2}\//)) {
                    homePrefix += '../../';
                }
                
                // Update home links
                element.querySelectorAll('.home-link').forEach(link => {
                    link.href = homePrefix;
                });

                // Update about link
                element.querySelectorAll('.about-link').forEach(link => {
                    link.href = homePrefix + 'p/about.html';
                });

                // Update contribute link
                element.querySelectorAll('.contribute-link').forEach(link => {
                    link.href = homePrefix + 'p/contribute.html';
                });
            }
        } catch (error) {
            console.error(`Error loading template ${templatePath}:`, error);
        }
    }

    try {
        // Function to determine if we're on GitHub Pages
        const isGitHubPages = () => window.location.hostname.includes('github.io');
        
        // Get the base path for templates based on current page location
        let basePath = '';
        
        // Add /crumbsblog/ prefix if on GitHub Pages
        if (isGitHubPages()) {
            basePath = '/crumbsblog/';
        }

        // Add relative path based on current location
        if (window.location.pathname.includes('/p/')) {
            basePath += '../templates/';
        } else if (window.location.pathname.match(/\/\d{4}\/\d{2}\//)) {
            basePath += '../../templates/';
        } else {
            basePath += 'templates/';
        }
        
        // Load all templates with correct path
        await Promise.all([
            includeTemplate('header', basePath + 'header.html'),
            includeTemplate('footer', basePath + 'footer.html'),
            includeTemplate('sidebar', basePath + 'sidebar.html')
        ]);

        // Initialize sidebar only after all templates are loaded successfully
        setTimeout(initializeSidebar, 0);
    } catch (error) {
        console.error('Error loading templates:', error);
    }
});