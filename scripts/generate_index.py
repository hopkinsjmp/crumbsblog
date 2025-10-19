import os
import json
import re
from datetime import datetime

def extract_articles_array(js_content):
    # Find the start of the articles array
    start = js_content.find('const articleTitles = [')
    if start == -1:
        return None
    
    # Find the matching closing bracket
    content = js_content[start:]
    bracket_count = 0
    end = 0
    in_string = False
    string_char = None
    
    # Skip past 'const articleTitles = ['
    i = content.find('[') + 1
    bracket_count = 1
    
    while i < len(content):
        char = content[i]
        if char in ['"', "'"] and (i == 0 or content[i-1] != '\\'):
            if not in_string:
                in_string = True
                string_char = char
            elif string_char == char:
                in_string = False
        elif not in_string:
            if char == '[':
                bracket_count += 1
            elif char == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    end = i + 1
                    break
        i += 1
    
    if end > 0:
        array_content = content[content.find('['):end]
        # Handle embedded quotes first by temporarily replacing them
        array_content = array_content.replace('\\"', '___QUOTE___')
        array_content = array_content.replace("'", '"')
        # Restore embedded quotes
        array_content = array_content.replace('___QUOTE___', '\\"')
        # Handle property names
        array_content = re.sub(r'(\w+):\s*"', r'"\1": "', array_content)
        # Handle any trailing commas
        array_content = re.sub(r',(\s*[\]}])', r'\1', array_content)
        print("Array content:", array_content)
        return json.loads(array_content)
    return None

def extract_posts_config(js_content):
    # Find everything between postConfig = { and the matching }
    start = js_content.find('postConfig = {')
    if start == -1:
        return None
    
    # Find the matching closing brace
    content = js_content[start:]
    brace_count = 0
    end = 0
    in_string = False
    string_char = None
    
    i = content.find('{') + 1
    brace_count = 1
    
    while i < len(content):
        char = content[i]
        if char in ['"', "'"] and (i == 0 or content[i-1] != '\\'):
            if not in_string:
                in_string = True
                string_char = char
            elif string_char == char:
                in_string = False
        elif not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    end = i + 1
                    break
        i += 1
    
    if end > 0:
        config = content[:end]
        # Extract just the object part
        obj_start = config.find('{')
        obj_content = config[obj_start:end]
        # Remove comments and empty lines
        obj_content = '\n'.join(line for line in obj_content.split('\n')
                              if not line.strip().startswith('//'))
        # Handle embedded quotes first
        obj_content = obj_content.replace('\\"', '___QUOTE___')
        obj_content = obj_content.replace("'", '"')
        # Restore embedded quotes
        obj_content = obj_content.replace('___QUOTE___', '\\"')
        # Handle property names
        obj_content = re.sub(r'(\w+):\s*', r'"\1": ', obj_content)
        # Handle any trailing commas
        obj_content = re.sub(r',(\s*[\]}])', r'\1', obj_content)
        print("Posts config:", obj_content)
        return json.loads(obj_content)
    return None

def get_article_metadata():
    # Read articles.js
    with open('../scripts/articles.js', 'r', encoding='utf-8') as f:
        articles_content = f.read()
    
    # Read posts.js
    with open('../scripts/posts.js', 'r', encoding='utf-8') as f:
        posts_content = f.read()
    
    # Extract the arrays
    articles = extract_articles_array(articles_content)
    posts_config = extract_posts_config(posts_content)
    
    if not articles or not posts_config:
        print("Failed to parse JavaScript files!")
        return []
    
    # Create a lookup of published posts
    published_posts = set(posts_config['published'])
    
    # Filter articles to only include published ones and add dates
    published_articles = []
    for article in articles:
        if article['path'] in published_posts:
            # Extract date from path (2025/MM/...)
            date_str = article['path'].split('/')[1]
            # Convert month number to date object
            date = datetime(2025, int(date_str), 1)  # Using 1st of the month as we don't have day info
            published_articles.append({
                **article,
                'month': date.strftime('%B')  # Full month name
            })
    
    # Sort by path (which contains the date) in reverse order
    return sorted(published_articles, key=lambda x: x['path'], reverse=True)

def generate_index_html(articles):
    if not articles:
        print("No published articles found!")
        return

    # Use the first article as featured
    featured = articles[0]
    other_articles = articles[1:5]  # Show next 4 articles

    template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crumbs of Sanity</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Lora:wght@400;700&family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/post.css">
</head>
<body>
    <div id="header"></div>

    <!-- Hero Image -->
    <div class="hero-image" style="background-image: url('https://blogger.googleusercontent.com/img/a/AVvXsEg8QAx2my2VCVbPy5G1Re0h4xjGDtRggMc5ZDyie0k9f-4MQz5L1IVXsc7YwwBNqTgCJmuhFMQdOTvFXty6-LPmPnz0clMQ6UNh924F376y4kCdMjFHZ15W_Ia2GXJBLUpjdpqxe6EJnBaQftyJW6xgvxhLC4Ufa2VaTEjTibo9ui1IVIA52Kvd__UoRFE=s1600')">
        <div class="hero-overlay"></div>
    </div>

    <!-- Main Content -->
    <main class="main-container">
        <!-- Featured Post Section -->
        <section class="featured-post">
            <h3 class="section-title">Featured</h3>
            <article>
                <div class="featured-post-content">
                    <div class="post-meta">Carmel · {featured_month} 2025</div>
                    <h2 class="post-title"><a href="{featured_path}">{featured_title}</a></h2>
                    <div class="post-footer">
                        <button>Share</button>
                        <a href="{featured_path}#comments">No comments</a>
                    </div>
                </div>
            </article>
        </section>

        <!-- Latest Posts Section -->
        <h3 class="section-title">Latest Posts</h3>
        <div class="blog-posts">
            {latest_posts}
        </div>
    </main>

    <div id="sidebar"></div>
    <div class="overlay" id="overlay"></div>
    <div id="footer"></div>

    <script src="scripts/config.js"></script>
    <script src="scripts/posts.js"></script>
    <script src="scripts/articles.js"></script>
    <script src="scripts/dropdown.js"></script>
    <script src="scripts/main.js"></script>
    <script src="scripts/templates.js"></script>
</body>
</html>'''

    latest_posts = []
    for article in other_articles:
        post = f'''
            <article class="post-card">
                <div class="post-meta">Carmel · {article['month']} 2025</div>
                <h2 class="post-title"><a href="{article['path']}">{article['full']}</a></h2>
                <div class="post-footer">
                    <button>Share</button>
                    <a href="{article['path']}#comments">No comments</a>
                </div>
            </article>'''
        latest_posts.append(post)

    # Generate the complete HTML
    html = template.format(
        featured_month=featured['month'],
        featured_path=featured['path'],
        featured_title=featured['full'],
        latest_posts='\n'.join(latest_posts)
    )

    # Write the new index.html
    with open('../index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Generated new index.html")

def main():
    articles = get_article_metadata()
    generate_index_html(articles)

if __name__ == '__main__':
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()