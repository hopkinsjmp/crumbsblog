const fs = require('fs');
const path = require('path');
const { marked } = require('marked'); // Updated for newer marked versions
const yaml = require('js-yaml');

// Configuration
const POSTS_DIR = path.join(__dirname, '../content/posts');
const TEMPLATE_PATH = path.join(__dirname, '../templates/post-template.html');

// Helper to create URL-friendly filenames
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function convert() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error("Posts directory not found!");
    return;
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  files.forEach(file => {
    const rawContent = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    
    // Split Frontmatter from Content
    const parts = rawContent.split('---');
    if (parts.length < 3) return;
    
    const meta = yaml.load(parts[1]);
    const markdownBody = parts.slice(2).join('---');
    const htmlBody = marked.parse(markdownBody);

    // Date Logic
    const date = new Date(meta.date || new Date());
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const postDateString = date.toLocaleDateString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric' 
    });

    // Determine Output Path
    const slug = slugify(meta.title);
    const outputDir = path.join(__dirname, '../', year, month);
    const outputPath = path.join(outputDir, `${slug}.html`);

    // Create Year/Month folders
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Fill Template Placeholders
    let finalHtml = template
      .replace(/{POST_TITLE}/g, meta.title)
      .replace(/{POST_DATE}/g, postDateString)
      .replace(/{POST_CONTENT}/g, htmlBody)
      // Defaults for metadata we haven't automated yet
      .replace(/{POST_DESCRIPTION}/g, meta.title)
      .replace(/{FEATURED_IMAGE_URL}/g, meta.image || "/images/default-hero.jpg")
      .replace(/{FEATURED_IMAGE_ALT}/g, meta.title)
      .replace(/{POST_LABELS}/g, "")
      .replace(/{RELATED_POSTS}/g, "Coming soon...");

    fs.writeFileSync(outputPath, finalHtml);
    console.log(`✅ Success: ${year}/${month}/${slug}.html`);
  });
}

convert();
