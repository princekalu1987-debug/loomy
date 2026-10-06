import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

def replace_text_size(match):
    size = int(match.group(1))
    if size < 20:
        new_size = size + 2
    elif size == 20:
        new_size = 24
    elif size == 26:
        new_size = 30
    elif size == 32:
        new_size = 36
    elif size == 34:
        new_size = 38
    elif size == 38:
        new_size = 42
    elif size == 40:
        new_size = 44
    elif size == 42:
        new_size = 48
    elif size == 46:
        new_size = 52
    elif size == 48:
        new_size = 54
    else:
        new_size = size # fallback
    return f"text-[{new_size}px]"

content = re.sub(r'text-\[(\d+)px\]', replace_text_size, content)

def replace_lucide_size(match):
    size = int(match.group(1))
    if size == 8: new_size = 10
    elif size == 10: new_size = 14
    elif size == 11: new_size = 13
    elif size == 12: new_size = 14
    elif size == 13: new_size = 15
    elif size == 14: new_size = 16
    elif size == 15: new_size = 17
    elif size == 16: new_size = 18
    elif size == 18: new_size = 20
    else: new_size = size
    return f"size={{{new_size}}}"

content = re.sub(r'size={(\d+)}', replace_lucide_size, content)

def replace_svg_bracket_size(match):
    size = int(match.group(1))
    if size == 15: new_size = 18
    elif size == 16: new_size = 20
    elif size == 18: new_size = 22
    else: new_size = size
    return f"[&>svg]:h-[{new_size}px] [&>svg]:w-[{new_size}px]"

content = re.sub(r'\[&>svg\]:h-\[(\d+)px\] \[&>svg\]:w-\[\1px\]', replace_svg_bracket_size, content)

content = content.replace('h-9 w-9 shrink-0', 'h-11 w-11 shrink-0')
content = content.replace('h-11 w-11 items-center justify-center', 'h-12 w-12 items-center justify-center')
content = content.replace('h-10 w-10 items-center justify-center', 'h-12 w-12 items-center justify-center')
content = content.replace('h-6 w-6 items-center justify-center', 'h-8 w-8 items-center justify-center')
content = content.replace('h-9 w-9 rounded-full', 'h-11 w-11 rounded-full')

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/index.css', 'r') as f:
    css = f.read()

css = css.replace('font-size: 10px;', 'font-size: 12px;')

with open('src/index.css', 'w') as f:
    f.write(css)

print("Updated sizes successfully.")
