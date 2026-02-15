const fs = require('fs');
const path = require('path');
const marked = require('marked');
const yaml = require('js-yaml');

// Paths
const postsDir = path.join(__dirname, '../content/posts');
const templatesDir = path.join(__dirname, '../templates');
const scriptsDir = __dirname;

function convert() {
    const postTemplate = fs.readFileSync(path.join(templatesDir, 'post-template.html'), 'utf8');
    const files = fs.readdirSync(postsDir);

    files.forEach(file => {
        if (!file.endsWith('.md')) return;

        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Parse Frontmatter
        const parts = content.split('---');
        if (parts.length < 3) return;

        const meta = yaml.load(parts[1]);
        const markdownBody = parts.slice(2).join('---');
        const bodyHtml = marked.parse(markdownBody);

        // Date Logic for folder structure
        const date = meta.date ? new Date(meta.date) : new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        
        const slug = meta.title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();

        // --- RECIPE FORMATTING LOGIC ---
        const ingredientsHtml = (meta.ingredients && meta.ingredients.trim()) 
            ? `<div class="recipe-card"><h3>Ingredients</h3><ul>${meta.ingredients.split('\n').filter(l => l.trim()).map(l => `<li>${l.replace(/^[*-]\s*/, '')}</li>`).join('')}</ul>` 
            : "";

        const methodHtml = (meta.method && meta.method.trim()) 
            ? `<h3>Method</h3><ol>${meta.method.split('\n').filter(l => l.trim()).map(l => `<li>${l.replace(/^\d+\.\s*/, '')}</li>`).join('')}</ol></div>` 
            : "";

        const timeInfoHtml = (meta.handsOn || meta.handsOff) 
            ? `<div class="recipe-meta">
                ${meta.handsOn ? `<span><strong>Prep:</strong> ${meta.handsOn}</span>` : ''}
                ${meta.handsOff ? `<span><strong>Wait:</strong> ${meta.handsOff}</span>` : ''}
               </div>` 
            : "";

        // Combine all content parts
        const fullContent = timeInfoHtml + bodyHtml + ingredientsHtml + methodHtml;

        // Populate Template
        const finalHtml = postTemplate
            .replace(/{POST_TITLE}/g, meta.title)
            .replace(/{POST_DATE}/g, date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
            .replace(/{POST_CONTENT}/g, fullContent)
            .replace(/{LABELS}/g, meta.labels || '');

        // Ensure directory exists
        const outputDir = path.join(__dirname, `../${year}/${month}`);
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const outputPath = path.join(outputDir, `${slug}.html`);
        fs.writeFileSync(outputPath, finalHtml);
        console.log(`Generated: ${year}/${month}/${slug}.html`);

        // --- AUTO-REGISTRATION LOGIC ---
        const relativePath = `${year}/${month}/${slug}.html`;
        updateRegistrationFiles(relativePath, meta.title);
    });
}

function updateRegistrationFiles(relativePath, title) {
    // 1. Update articles.js (The titles list)
    const articlesPath = path.join(scriptsDir, 'articles.js');
    let articlesContent = fs.readFileSync(articlesPath, 'utf8');

    if (!articlesContent.includes(relativePath)) {
        const newEntry = `    {\n        path: '${relativePath}',\n        full: '${title}',\n        short: '${title}'\n    },`;
        // Insert after the opening bracket
        articlesContent = articlesContent.replace('const articleTitles = [', `const articleTitles = [\n${newEntry}`);
        fs.writeFileSync(articlesPath, articlesContent);
        console.log(`Registered in articles.js: ${title}`);
    }

    // 2. Update posts.js (The published status list)
    const postsJsPath = path.join(scriptsDir, 'posts.js');
    let postsJsContent = fs.readFileSync(postsJsPath, 'utf8');

    if (!postsJsContent.includes(relativePath)) {
        // Insert at the top of the published array
        postsJsContent = postsJsContent.replace('published: [', `published: [\n        '${relativePath}',`);
        fs.writeFileSync(postsJsPath, postsJsContent);
        console.log(`Registered in posts.js: ${relativePath}`);
    }
}

try {
    convert();
} catch (err) {
    console.error("Conversion failed:", err);
    process.exit(1);
}
