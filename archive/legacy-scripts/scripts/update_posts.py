import os
import glob

def get_head_content():
    return '''    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{} - Crumbs of Sanity</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Lora:wght@400;700&family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
    
    <script src="../../scripts/config.js"></script>
    <script src="../../scripts/posts.js"></script>
    <script src="../../scripts/articles.js"></script>
    <script src="../../scripts/dropdown.js"></script>
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/post.css">'''

def update_post_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the title
    title_start = content.find('<title>') + 7
    title_end = content.find(' - Crumbs of Sanity</title>')
    title = content[title_start:title_end] if title_end > title_start else "Post"
    
    # Replace the head content
    start = content.find('<meta charset="UTF-8">')
    end = content.find('<body')
    
    if start != -1 and end != -1:
        new_content = content[:start] + get_head_content().format(title) + content[end-1:]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')

def main():
    # Get all post HTML files
    posts = glob.glob('../2025/**/*.html', recursive=True)
    
    # Update each post
    for post in posts:
        update_post_file(post)

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
