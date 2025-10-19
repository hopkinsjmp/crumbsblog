import os
import requests
import json
from datetime import datetime
from pathlib import Path

def download_file(url):
    headers = {'Accept': 'application/vnd.github.v3.raw'}
    response = requests.get(url, headers=headers)
    return response.text

def download_directory_contents(path):
    api_url = f"https://api.github.com/repos/hopkinsjmp/crumbsofsanity/contents/{path}"
    response = requests.get(api_url)
    return json.loads(response.text)

def process_markdown_content(content):
    # Split front matter and content
    parts = content.split('---', 2)
    if len(parts) >= 3:
        front_matter = parts[1]
        main_content = parts[2]
        
        # Parse front matter
        metadata = {}
        for line in front_matter.strip().split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                metadata[key.strip()] = value.strip().strip('"')
        
        return metadata, main_content
    return None, content

def create_html(title, date, content):
    date_obj = datetime.fromisoformat(date.replace('Z', '+00:00'))
    formatted_date = date_obj.strftime('%B %-d, %Y')
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Crumbs of Sanity</title>
    
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
                <h1 class="post-title">{title}</h1>
                <div class="post-meta">
                    <span class="byline">
                        By <a href="../../p/about.html">Carmel</a>
                    </span>
                    <span class="post-timestamp">{formatted_date}</span>
                </div>
            </div>

            <div class="post-body">
                {content}
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
</html>"""

def main():
    # Create source directory
    source_dir = Path('/Users/josephhopkins/Desktop/crumbsblog/source')
    source_dir.mkdir(exist_ok=True)
    
    # Download and process posts
    contents = download_directory_contents('content/posts')
    published_posts = []
    unpublished_posts = []
    
    for item in contents:
        if item['type'] == 'dir' and item['name'].startswith('2025-'):
            # Get the index.md file from this directory
            index_contents = download_directory_contents(f"content/posts/{item['name']}")
            index_file = next((f for f in index_contents if f['name'] == 'index.md'), None)
            
            if index_file:
                content = download_file(index_file['download_url'])
                metadata, main_content = process_markdown_content(content)
                
                if metadata:
                    # Parse date and create directory structure
                    date = datetime.fromisoformat(metadata['date'].replace('Z', '+00:00'))
                    year = str(date.year)
                    month = f"{date.month:02d}"
                    
                    # Create directory if it doesn't exist
                    post_dir = Path(f'/Users/josephhopkins/Desktop/crumbsblog/{year}/{month}')
                    post_dir.mkdir(parents=True, exist_ok=True)
                    
                    # Create HTML file
                    html_content = create_html(metadata['title'], metadata['date'], main_content)
                    output_path = post_dir / f"{metadata['slug']}.html"
                    
                    with open(output_path, 'w', encoding='utf-8') as f:
                        f.write(html_content)
                    
                    # Add to appropriate list
                    relative_path = f"{year}/{month}/{metadata['slug']}.html"
                    if metadata.get('draft') == 'true':
                        unpublished_posts.append(relative_path)
                    else:
                        published_posts.append(relative_path)
                    
                    print(f"Converted: {relative_path}")

    # Update posts.js
    posts_js_content = f"""// Post configuration and management
const postConfig = {{
    // Posts that are ready to be published
    published: [
        {',\\n        '.join(f"'{post}'" for post in published_posts)}
    ],
    
    // Posts that are complete but not yet published
    unpublished: [
        {',\\n        '.join(f"'{post}'" for post in unpublished_posts)}
    ]
}};

function isPostPublished(postPath) {{
    // Remove any leading slash and normalize the path
    const normalizedPath = postPath.replace(/^\\//, '');
    return postConfig.published.includes(normalizedPath);
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { postConfig, isPostPublished };
}"""

    with open('/Users/josephhopkins/Desktop/crumbsblog/scripts/posts.js', 'w', encoding='utf-8') as f:
        f.write(posts_js_content)
    
    print("Updated posts.js with new post listings")

if __name__ == '__main__':
    main()