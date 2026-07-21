#!/usr/bin/env python3
"""
将i18n JSON文件中的平级key转换为嵌套结构
例如: "city.beijing.name" -> {"city": {"beijing": {"name": ...}}}
"""
import json
import sys
from pathlib import Path

def flatten_to_nested(flat_dict):
    """将平级key转换为嵌套字典"""
    nested = {}

    for key, value in flat_dict.items():
        if '.' in key:
            # 平级key，需要转换
            parts = key.split('.')
            current = nested
            for part in parts[:-1]:
                if part not in current:
                    current[part] = {}
                current = current[part]
            current[parts[-1]] = value
        else:
            # 已经是嵌套结构或顶层key
            nested[key] = value

    return nested

def process_file(filepath):
    """处理单个JSON文件"""
    print(f"Processing {filepath}...")

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 统计平级key数量
    flat_count = sum(1 for k in data.keys() if '.' in k)
    print(f"  Found {flat_count} flat keys")

    if flat_count == 0:
        print(f"  [OK] Already nested, skipping")
        return

    # 转换
    nested_data = flatten_to_nested(data)

    # 写回文件
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(nested_data, f, ensure_ascii=False, indent=2)

    print(f"  [OK] Converted {flat_count} keys to nested structure")

def main():
    # 处理所有i18n文件
    i18n_dir = Path(__file__).parent.parent / 'src' / 'i18n'
    json_files = list(i18n_dir.glob('*.json'))

    if not json_files:
        print(f"No JSON files found in {i18n_dir}")
        sys.exit(1)

    print(f"Found {len(json_files)} files to process\n")

    for filepath in sorted(json_files):
        process_file(filepath)
        print()

    print("All files processed!")

if __name__ == '__main__':
    main()
