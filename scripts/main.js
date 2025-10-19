// Check if there's enough room for the sidebar
function hasRoomForSidebar() {
    const viewportWidth = window.innerWidth;
    const mainContent = document.querySelector('.main-container');
    if (!mainContent) return false;
    
    const mainRect = mainContent.getBoundingClientRect();
    // We need at least 284px (sidebar width) + 922px (main content max-width) + some padding
    return viewportWidth >= 1324;
}

function toggleSidebar() {
    const sidebarContainer = document.querySelector('#sidebar .sidebar-container');
    const overlay = document.querySelector('.overlay');
    const body = document.body;
    
    if (!sidebarContainer || !overlay) {
        console.error('Sidebar or overlay not found', {
            sidebarContainer: !!sidebarContainer,
            overlay: !!overlay
        });
        return;
    }

    // Toggle sidebar visibility
    if (sidebarContainer.classList.contains('sidebar-invisible')) {
        sidebarContainer.classList.remove('sidebar-invisible');
        overlay.classList.add('active');
        body.classList.add('sidebar-visible');
    } else {
        sidebarContainer.classList.add('sidebar-invisible');
        overlay.classList.remove('active');
        body.classList.remove('sidebar-visible');
    }
}

// Handle post visibility
function handlePostVisibility() {
    // Check if we're on a post page
    const postContent = document.querySelector('.post');
    if (postContent) {
        const currentPath = window.location.pathname.replace(/^\/crumbsblog\//, '');
        if (!isPostPublished(currentPath)) {
            // Redirect to home if post is not published
            window.location.href = getBasePath();
        }
    }
}

// Initial setup
function initializePage() {
    handlePostVisibility();
    initializeSidebar();
}

function initializeSidebar() {
    const sidebarContainer = document.querySelector('#sidebar .sidebar-container');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    if (!sidebarContainer || !overlay) {
        console.error('Sidebar or overlay not found', {
            sidebarContainer: !!sidebarContainer,
            overlay: !!overlay
        });
        return;
    }

    // On mobile: start hidden
    if (window.innerWidth < 1324) {
        sidebarContainer.classList.add('sidebar-invisible');
    } else {
        // On desktop: start visible
        sidebarContainer.classList.remove('sidebar-invisible');
    }
    
    // Always start with overlay hidden
    overlay.classList.remove('active');
    body.classList.remove('sidebar-visible');
}

// Run when window is resized
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initializeSidebar, 250);
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', initializePage);