import os
import json
import re
from datetime import datetime

def extract_articles_array(js_content):
    start = js_content.find('const articleTitles = [')
    if start == -1: return None
    
    content = js_content[start:]
    bracket_count = 0
    end = 0
    in_string = False
    string_char = None
    
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
            if char == '[': bracket_count += 1
            elif char == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    end = i + 1
                    break
        i += 1
    
    if end > 0:
        array_content = content[content.find('['):end]
        array_content = array_content.replace('\\"', '___QUOTE___')
        array_content = array_content.replace("'", '"')
        array_content = array_content.replace('___QUOTE___', '\\"')
        array_content = re.sub(r'(\w+):\s*"', r'"\1": "', array_content)
        array_content = re.sub(r',(\s*[\]}])', r'\1', array_content)
        return json.loads(array_content)
    return None

def extract_posts_config(js_content):
    start = js_content.find('postConfig = {')
    if start == -1: return None
    
    content = js_content[start:]
    brace_count = 0
    end = 0
    in_string = False
    
    i = content.find('{') + 1
    brace_count = 1
    
    while i < len(content):
        char = content[i]
        if char in ['"', "'"] and (i == 0 or content[i-1] != '\\'):
            in_string = not in_string
        elif not in_string:
            if char == '{': brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    end = i + 1
                    break
        i += 1
    
    if end > 0:
        obj_content = content[:end][content.find('{'):]
        obj_content = '\n'.join(line for line in obj_content.split('\n') if not line.strip().startswith('//'))
        obj_content = obj_content.replace('\\"', '___QUOTE___').replace("'", '"').replace('___QUOTE___', '\\"')
        obj_content = re.sub(r'(\w+):\s*', r'"\1": ', obj_content)
        obj_content = re.sub(r',(\s*[\]}])', r'\1', obj_content)
        return json.loads(obj_content)
    return None

def get_article_metadata():
    # Paths relative to the scripts folder
    try:
        with open('../scripts/articles.js', 'r', encoding='utf-8') as f:
            articles_content = f.read()
        with open('../scripts/posts.js', 'r', encoding='utf-8') as f:
            posts_content = f.read()
    except FileNotFoundError:
        print("Error: Could not find articles.js or posts.js in ../scripts/")
        return []

    articles = extract_articles_array(articles_content)
    posts_config = extract_posts_config(posts_content)
    
    if not articles or not posts_config:
        print("Failed to parse JavaScript files!")
        return []
    
    published_posts = set(posts_config.get('published', []))
    published_articles = []

    for article in articles:
        if article['path'] in published_posts:
            # DYNAMIC DATE EXTRACTION: Extracts year and month from "YYYY/MM/..."
            path_parts = article['path'].split('/')
            if len(path_parts) >= 2:
                try:
                    year_val = path_parts[0]
                    month_int = int(path_parts[1])
                    date_obj = datetime(int(year_val), month_int, 1)
                    
                    published_articles.append({
                        **article,
                        'year': year_val,
                        'month_name': date_obj.strftime('%B')
                    })
                except ValueError:
                    continue
    
    # Sort by path descending to keep newest at the top
    return sorted(published_articles, key=lambda x: x['path'], reverse=True)

def generate_index_html(articles):
    if not articles:
        print("No published articles found!")
        return

    featured = articles[0]
    other_articles = articles[1:6] # Show up to 5 more articles

    # The template now uses {year} and {month} dynamically
    template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crumbs of Sanity</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Lora:wght@400;700&family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/post.css">
</head>
<body>
    <div id="header"></div>

    <div class="hero-image" style="background-image: url('https://blogger.googleusercontent.com/img/a/AVvXsEg8QAx2my2VCVbPy5G1Re0h4xjGDtRggMc5ZDyie0k9f-4MQz5L1IVXsc7YwwBNqTgCJmuhFMQdOTvFXty6-LPmPnz0clMQ6UNh924F376y4kCdMjFHZ15W_Ia2GXJBLUpjdpqxe6EJnBaQftyJW6xgvxhLC4Ufa2VaTEjTibo9ui1IVIA52Kvd__UoRFE=s1600')">
        <div class="hero-overlay"></div>
    </div>

    <main class="main-container">
        <section class="featured-post">
            <h3 class="section-title">Featured</h3>
            <article>
                <div class="featured-post-content">
                    <div class="post-meta">Carmel · {featured_month} {featured_year}</div>
                    <h2 class="post-title"><a href="{featured_path}">{featured_title}</a></h2>
                    <div class="post-footer">
                        <button>Share</button>
                        <a href="{featured_path}#comments">No comments</a>
                    </div>
                </div>
            </article>
        </section>

        <h3 class="section-title">Latest Posts</h3>
        <div class="blog-posts">
            {latest_posts_html}
        </div>
    </main>

    <div id="sidebar"></div>
    <div id="overlay" class="overlay"></div>
    <div id="footer"></div>

    <script src="scripts/config.js"></script>
    <script src="scripts/posts.js"></script>
    <script src="scripts/articles.js"></script>
    <script src="scripts/dropdown.js"></script>
    <script src="scripts/main.js"></script>
    <script src="scripts/templates.js"></script>
</body>
</html>'''

    latest_posts_list = []
    for art in other_articles:
        post_card = f'''
            <article class="post-card">
                <div class="post-meta">Carmel · {art['month_name']} {art['year']}</div>
                <h2 class="post-title"><a href="{art['path']}">{art['full']}</a></h2>
                <div class="post-footer">
                    <button>Share</button>
                    <a href="{art['path']}#comments">No comments</a>
                </div>
            </article>'''
        latest_posts_list.append(post_card)

    final_html = template.format(
        featured_month=featured['month_name'],
        featured_year=featured['year'],
        featured_path=featured['path'],
        featured_title=featured['full'],
        latest_posts_html='\n'.join(latest_posts_list)
    )

    with open('../index.html', 'w', encoding='utf-8') as f:
        f.write(final_html)
    print(f"Successfully generated index.html with {len(articles)} posts.")

def main():
    # Ensure we are in the correct directory relative to the script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    articles = get_article_metadata()
    generate_index_html(articles)

if __name__ == '__main__':
    main()
