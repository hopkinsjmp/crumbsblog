#!/usr/bin/env python3
import os
import sys
import shutil
import re
import json
from datetime import datetime

def create_html_template(title, date, content):
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
                    <span class="post-timestamp">{date.strftime('%B %d, %Y')}</span>
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

def parse_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split on --- to separate frontmatter from content
    parts = content.split('---')
    if len(parts) >= 3:
        frontmatter = parts[1].strip()
        content = '---'.join(parts[2:]).strip()
        
        # Parse frontmatter
        metadata = {}
        for line in frontmatter.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                metadata[key.strip()] = value.strip().strip('"')
        
        return metadata, content
    return None

def ensure_directory_exists(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

def convert_posts():
    source_repo_path = '../crumbsofsanity'
    if not os.path.exists(source_repo_path):
        source_repo_path = '/Users/josephhopkins/Desktop/crumbsofsanity'
    source_repo_path = os.path.join(source_repo_path, 'content/posts')
    target_base_path = '.'
    published_posts = []
    unpublished_posts = []

    # Get all post directories
    try:
        post_dirs = [d for d in os.listdir(source_repo_path) if d.startswith('2025-')]
    except FileNotFoundError:
        print(f"Error: Could not find source directory: {source_repo_path}")
        return
    
    for post_dir in post_dirs:
        try:
            index_path = os.path.join(source_repo_path, post_dir, 'index.md')
            if not os.path.exists(index_path):
                continue

            metadata, content = parse_markdown_file(index_path)
            if not metadata:
                continue

            # Parse the date
            date_str = metadata.get('date', '').split('T')[0]
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d')
            except ValueError:
                print(f"Error parsing date in {index_path}")
                continue

            # Create target directory structure
            year = date.strftime('%Y')
            month = date.strftime('%m')
            target_dir = os.path.join(target_base_path, year, month)
            ensure_directory_exists(target_dir)

            # Generate HTML file
            slug = metadata.get('slug', '')
            if not slug:
                continue

            html_file_path = os.path.join(target_dir, f"{slug}.html")
            html_content = create_html_template(
                metadata.get('title', ''),
                date,
                content  # We'll keep the content as is for now since it's already in HTML
            )
            
            with open(html_file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            # Add to appropriate list
            relative_path = os.path.relpath(html_file_path, target_base_path)
            if metadata.get('draft') == 'true':
                unpublished_posts.append(relative_path)
            else:
                published_posts.append(relative_path)
            
            print(f"Converted: {relative_path}")

        except Exception as e:
            print(f"Error processing {post_dir}: {str(e)}")

    # Update posts.js
    posts_js_content = f"""// Post configuration and management
const postConfig = {{
    // Posts that are ready to be published
    published: [
        {', '.join(f"'{p}'" for p in published_posts)}
    ],
    
    // Posts that are complete but not yet published
    unpublished: [
        {', '.join(f"'{p}'" for p in unpublished_posts)}
    ]
}};

function isPostPublished(postPath) {{
    // Remove any leading slash and normalize the path
    const normalizedPath = postPath.replace(/^\//, '');
    return postConfig.published.includes(normalizedPath);
}}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{ postConfig, isPostPublished }};
}}"""

    with open(os.path.join(target_base_path, 'scripts', 'posts.js'), 'w', encoding='utf-8') as f:
        f.write(posts_js_content)
    print('Updated posts.js with new post listings')

if __name__ == '__main__':
    convert_posts()