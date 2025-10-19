const fs = require('fs');
const path = require('path');
const marked = require('marked');
const yaml = require('js-yaml');

// Template for our HTML posts
const postTemplate = (title, date, content) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Crumbs of Sanity</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Lora:wght@400;700&family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
    
    <script src="../../scripts/config.js"></script>
    <script src="../../scripts/posts.js"></script>
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/post.css">
</head>
<body class="item-view">
    <div id="header"></div>

    <!-- Main Content -->
    <main class="main-container">
        <article class="post">
            <div class="post-header">
                <h1 class="post-title">${title}</h1>
                <div class="post-meta">
                    <span class="byline">
                        By <a href="../../p/about.html">Carmel</a>
                    </span>
                    <span class="post-timestamp">${new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            <div class="post-body">
                ${content}
            </div>
        </article>
    </main>

    <div id="sidebar"></div>
    <div class="overlay"></div>
    <div id="footer"></div>

    <!-- Scripts -->
    <script src="../../scripts/main.js"></script>
    <script src="../../scripts/templates.js"></script>
</body>
</html>`;

// Function to parse frontmatter and content from markdown files
function parseMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const parts = content.split('---');
    if (parts.length >= 3) {
        const frontmatter = yaml.load(parts[1]);
        const markdownContent = parts.slice(2).join('---').trim();
        return { frontmatter, content: markdownContent };
    }
    return null;
}

// Function to ensure directory exists
function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

// Main conversion function
async function convertPosts() {
    // Install required packages
    console.log('Installing required packages...');
    try {
        await require('child_process').execSync('npm install marked js-yaml', { stdio: 'inherit' });
    } catch (error) {
        console.error('Failed to install required packages:', error);
        return;
    }

    const sourceRepoPath = '../crumbsofsanity/content/posts';
    const targetBasePath = './';
    const publishedPosts = [];
    const unpublishedPosts = [];

    // Read all post directories
    const postDirs = fs.readdirSync(sourceRepoPath)
        .filter(name => name.startsWith('2025-'))
        .map(name => path.join(sourceRepoPath, name));

    for (const postDir of postDirs) {
        try {
            const indexPath = path.join(postDir, 'index.md');
            if (!fs.existsSync(indexPath)) continue;

            const parsed = parseMarkdownFile(indexPath);
            if (!parsed) continue;

            const { frontmatter, content } = parsed;
            const date = new Date(frontmatter.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            
            // Create target directory structure
            const targetDir = path.join(targetBasePath, String(year), month);
            ensureDirectoryExists(targetDir);

            // Convert markdown to HTML
            const parsedContent = marked.parse(content);

            // Generate HTML file
            const htmlFilePath = path.join(targetDir, `${frontmatter.slug}.html`);
            const htmlContent = postTemplate(frontmatter.title, frontmatter.date, parsedContent);
            
            fs.writeFileSync(htmlFilePath, htmlContent);
            
            // Add to appropriate list
            const relativePath = path.relative(targetBasePath, htmlFilePath);
            if (frontmatter.draft === true) {
                unpublishedPosts.push(relativePath);
            } else {
                publishedPosts.push(relativePath);
            }
            
            console.log(`Converted: ${relativePath}`);
        } catch (error) {
            console.error(`Error processing ${postDir}:`, error);
        }
    }

    // Update posts.js with new post lists
    const postsConfigContent = `// Post configuration and management
const postConfig = {
    // Posts that are ready to be published
    published: [
        ${publishedPosts.map(p => `'${p}'`).join(',\n        ')}
    ],
    
    // Posts that are complete but not yet published
    unpublished: [
        ${unpublishedPosts.map(p => `'${p}'`).join(',\n        ')}
    ]
};

function isPostPublished(postPath) {
    // Remove any leading slash and normalize the path
    const normalizedPath = postPath.replace(/^\//, '');
    return postConfig.published.includes(normalizedPath);
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { postConfig, isPostPublished };
}`;

    fs.writeFileSync(path.join(targetBasePath, 'scripts', 'posts.js'), postsConfigContent);
    console.log('Updated posts.js with new post listings');
}

// Run the conversion
convertPosts().catch(console.error);