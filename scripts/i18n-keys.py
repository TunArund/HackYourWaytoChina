"""Print i18n JSON key tree — inspect structure, count keys, detect flat-key pollution.

Usage:
    python scripts/i18n-keys.py            # default: en.json
    python scripts/i18n-keys.py zh         # zh.json
    python scripts/i18n-keys.py en --flat  # only list flat dot-separated keys
"""
import json, sys, io, os

sys.stdout.reconfigure(encoding='utf-8')

def walk(obj, prefix=''):
    """Yield (key_path, value) for every leaf (non-dict value)."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk(v, f'{prefix}.{k}' if prefix else k)
    else:
        yield (prefix, obj)

def count_keys(obj):
    """Recursively count total keys in a nested structure."""
    if isinstance(obj, dict):
        return len(obj) + sum(count_keys(v) for v in obj.values())
    return 0

def leaf_count(obj):
    """Number of leaf values (non-dict)."""
    return sum(1 for _ in walk(obj))

def show_tree(obj, indent=0, max_indent=5):
    """Pretty-print nested key tree up to max_indent levels deep, showing key counts."""
    if not isinstance(obj, dict):
        return
    if indent > max_indent:
        print(' ' * (indent * 2) + f'  ... ({count_keys(obj)} keys total)')
        return
    for k in sorted(obj):
        v = obj[k]
        if isinstance(v, dict):
            n = count_keys(v)
            print(f'{" " * (indent * 2)}  {k}/ ({n} keys)')
            show_tree(v, indent + 1, max_indent)
        else:
            print(f'{" " * (indent * 2)}  {k}')

# --- main ---
LANG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'i18n')
lang = 'en'
show_flat_only = False

for a in sys.argv[1:]:
    if a == '--flat':
        show_flat_only = True
    else:
        lang = a

path = os.path.join(LANG_DIR, f'{lang}.json')
if not os.path.exists(path):
    print(f'[ERROR] {path} not found')
    sys.exit(1)

with io.open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

top_level = sorted(data.keys())
nested_keys = [k for k in top_level if isinstance(data[k], dict)]
flat_keys = [k for k in top_level if '.' in k]
other_keys = [k for k in top_level if k not in nested_keys and k not in flat_keys]

print(f'i18n: {lang}.json')
print(f'{"=" * 60}')
print(f'Top-level keys: {len(top_level)}')
print(f'  Nested (dict):  {len(nested_keys)}')
print(f'  Flat (dotted):  {len(flat_keys)}')

if other_keys:
    print(f'  Other (scalar): {len(other_keys)}')
    for k in other_keys:
        print(f'    {k}')

if show_flat_only:
    print(f'\n[Flat dot-separated keys at root level]')
    for k in sorted(flat_keys):
        # group by prefix
        print(f'  {k}')
    sys.exit(0)

# Nested tree
print(f'\n[Nested key tree ({len(nested_keys)} namespaces)]')
for ns in sorted(nested_keys):
    obj = data[ns]
    total = count_keys(obj)
    leaves = leaf_count(obj)
    # Mark empty sections
    tag = ' (empty)' if total == 0 else ''
    print(f'  {ns}/  keys={total}  leaves={leaves}{tag}')
    show_tree(obj, indent=2)

# Flat keys summary
if flat_keys:
    print(f'\n[Flat dot-separated keys: {len(flat_keys)}]')
    # Group by first segment
    groups = {}
    for k in sorted(flat_keys):
        prefix = k.split('.')[0]
        groups.setdefault(prefix, []).append(k)
    for prefix in sorted(groups):
        keys = groups[prefix]
        print(f'  {prefix}.* ({len(keys)} keys):')
        for k in keys:
            print(f'    {k}')

# Overall stats
total_leaves = leaf_count(data)
print(f'\n[Summary]')
print(f'  Total leaf keys: {total_leaves}')
print(f'  Namespaces at root: {len(nested_keys)}')
if flat_keys:
    print(f'  WARNING: {len(flat_keys)} flat dotted keys pollute root namespace.')
    print(f'  Consider moving them into matching nested structures.')
