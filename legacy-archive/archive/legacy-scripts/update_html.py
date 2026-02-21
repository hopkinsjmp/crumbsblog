import os
import re

def update_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add post-container div after main-container
    content = content.replace(
        '<main class="main-container">\n        <article class="post">',
        '<main class="main-container">\n        <div class="post-container">\n            <article class="post">'
    )
    
    # Add closing div before comments section
    content = content.replace(
        '</article>\n\n        <!-- Comments',
        '</article>\n        </div>\n\n        <!-- Comments'
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {file_path}")

# Update all HTML files except templates and index
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html') and file not in ['index.html', 'template.html']:
            if not any(folder in root for folder in ['templates']):
                file_path = os.path.join(root, file)
                update_html_file(file_path)
