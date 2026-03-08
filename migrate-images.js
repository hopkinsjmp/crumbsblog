const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Updated to your project structure
const POSTS_DIR = './content/posts';
const UPLOADS_DIR = './public/uploads/posts'; 

// Ensure the folder exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

async function downloadImage(url, fileName) {
  const filePath = path.join(UPLOADS_DIR, fileName);
  try {
    const response = await axios({ url, responseType: 'stream' });
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filePath))
        .on('finish', () => resolve(`/uploads/posts/${fileName}`))
        .on('error', reject);
    });
  } catch (e) {
    console.error(`Failed to download ${url}`);
    return null;
  }
}

async function run() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  
  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the heroImg line
    const match = content.match(/heroImg: "(https?:\/\/[^"]+)"/);
    if (match) {
      const remoteUrl = match[1];
      // Create a clean filename from the MDX filename
      const fileName = `${path.parse(file).name}.jpeg`;
      
      console.log(`Downloading: ${fileName}...`);
      const localPath = await downloadImage(remoteUrl, fileName);
      
      if (localPath) {
        content = content.replace(remoteUrl, localPath);
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  }
}

run();