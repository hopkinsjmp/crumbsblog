// Post configuration and management
const postConfig = {
    // Posts that are ready to be published
    published: [
        '2026/02/tender-moments-broccoli-with-lemon-almonds.html',
        '2026/02/coming-up-for-air-a-gentle-roast-of-fennel-and-cream.html',
        '2026/02/lemon-scones-by-joe.html',
        '2025/05/how-to-contribute.html',
        '2025/07/halloumi-and-the-concentrated-mind.html',
        '2025/06/a-vegetable-soup-for-a-fruitless-mind.html',
        '2025/06/a-soothing-smoothie-bowl-1-cashew-and-berry.html',
        '2025/06/soak-blend-breathe-or-cashew-milk-for-when-everything-s-a-lot.html'

    ],
    
    // Posts that are complete but not yet published
    unpublished: [
        '2025/05/recipe-catalogue.html',
        '2025/05/this-is-post-number-2.html',
        '2025/06/cookies.html',
        '2025/06/copyright.html',
        '2025/06/privacy.html',
        '2025/06/terms.html',
        '2025/07/coming-up-for-air-a-gentle-roast-of-fennel-and-cream.html',
        '2025/07/courgettes-for-the-countdown.html',
        '2025/08/a-welcome-interlude-toast-three-ways.html'
    ]
};

function isPostPublished(postPath) {
    // Remove any leading slash and normalize the path
    const normalizedPath = postPath.replace(/^\//, '');
    return postConfig.published.includes(normalizedPath);
}

// Export functions for use in other scripts
if (typeof module !== "undefined" && module.exports) {
    module.exports = { postConfig, isPostPublished };
}