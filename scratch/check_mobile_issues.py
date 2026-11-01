import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

findings = []
for f in glob.glob('outputs/**/*.html', recursive=True):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
        w_attrs = re.findall(r'width=[\"\']([4-9]\d{2,}|\d{4,})[\"\']', content)
        style_w = re.findall(r'style=[\"\'][^\"\']*(?<!max-)width:\s*([4-9]\d{2,}|\d{4,})px', content)
        has_canvas = '<canvas' in content
        has_table = '<table' in content
        if w_attrs or style_w or has_canvas or has_table:
            findings.append((f, w_attrs, style_w, has_canvas, has_table))

print(f"Total HTML files analyzed: {len(glob.glob('outputs/**/*.html', recursive=True))}")
print(f"Files with fixed width attrs, styles, canvas or tables: {len(findings)}")
for f, w, s, c, t in findings:
    details = []
    if w: details.append(f"w_attr: {w}")
    if s: details.append(f"style_w: {s}")
    if c: details.append("canvas")
    if t: details.append("table")
    print(f"  {f}: {', '.join(details)}")
