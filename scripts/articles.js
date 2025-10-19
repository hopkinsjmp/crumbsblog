// Article titles and their short versions
const articleTitles = [
    {
        path: '2025/08/a-welcome-interlude-toast-three-ways.html',
        full: 'A Welcome Interlude: Toast, Three Ways',
        short: 'Toast, Three Ways'
    },
    {
        path: '2025/07/courgettes-for-the-countdown.html',
        full: 'Courgettes for the Countdown',
        short: 'Courgettes for the Countdown'
    },
    {
        path: '2025/07/coming-up-for-air-a-gentle-roast-of-fennel-and-cream.html',
        full: 'Coming Up for Air: A Gentle Roast of Fennel and Cream',
        short: 'Roasted Fennel and Cream'
    },
    {
        path: '2025/07/halloumi-and-the-concentrated-mind.html',
        full: 'Halloumi and the Concentrated Mind',
        short: 'Halloumi and the Concentrated Mind'
    },
    {
        path: '2025/06/a-soothing-smoothie-bowl-1-cashew-and-berry.html',
        full: 'A Soothing Smoothie Bowl #1: Cashew and Berry',
        short: 'A Soothing Smoothie Bowl #1'
    },
    {
        path: '2025/06/a-vegetable-soup-for-a-fruitless-mind.html',
        full: 'A Vegetable Soup for a Fruitless Mind',
        short: 'Vegetable Soup for a Fruitless Mind'
    },
    {
        path: '2025/06/soak-blend-breathe-or-cashew-milk-for-when-everything-s-a-lot.html',
        full: 'Soak, Blend, Breathe (or: Cashew Milk for When Everything\'s a Lot)',
        short: 'Cashew Milk for when Everything\'s a Lot'
    }
];

// Get a random article
function getRandomArticle() {
    return articleTitles[Math.floor(Math.random() * articleTitles.length)];
}

// Get all articles
function getAllArticles() {
    return articleTitles;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { articleTitles, getRandomArticle, getAllArticles };
}