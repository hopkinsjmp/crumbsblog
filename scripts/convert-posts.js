const fs = require('fs');
const path = require('path');
const marked = require('marked');
const yaml = require('js-yaml');

// Configuration
const POSTS_DIR = path.join(__dirname, '../content/posts');
const TEMPLATE_PATH = path.join(__dirname, '../templates/post-template.html');
const INDEX_PATH = path.join(__dirname, '../index.html');

// 1. Load the HTML Template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

function convert() {
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
    const allPostsData = [];

    files.forEach(file => {
        const fullPath = path.join(POSTS_DIR, file);
        const rawContent = fs.readFileSync(fullPath, 'utf8');
        
        // Parse Frontmatter (Title, Date, etc.)
        const parts = rawContent.split('---');
        if (parts.length < 3) return;
        
        const meta = yaml.load(parts[1]);
        const markdownBody = parts.slice(2).join('---');
        const htmlBody = marked.parse(markdownBody);

        // Determine Year and Month for Folder Structure
        const date = new Date(meta.date);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const slug = file.replace('.md', '');
        
        const outputDir = path.join(__dirname, '../', year, month);
        const outputPath = path.join(outputDir, `${slug}.html`);

        // Create directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Fill Template
        let finalHtml = template
            .replace(/{{title}}/g, meta.title)
            .replace(/{{date}}/g, date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
            .replace(/{{content}}/g, htmlBody);

        fs.writeFileSync(outputPath, finalHtml);
        console.log(`Generated: ${year}/${month}/${slug}.html`);

        // Store data for Index update
        allPostsData.push({
            title: meta.title,
            link: `${year}/${month}/${slug}.html`,
            date: date,
            displayDate: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });
    });

    // 2. Update Index.html (Optional but recommended)
    updateIndex(allPostsData);
}

function updateIndex(posts) {
    // Sort posts newest first
    posts.sort((a, b) => b.date - a.date);
    
    // Logic here to read index.html and inject the latest 3-5 posts 
    // into your <div class="blog-posts"> section.
    console.log("Index data prepared for sorting.");
}

convert();
