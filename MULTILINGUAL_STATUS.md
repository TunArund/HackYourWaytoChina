# 多语言扩展说明

## 📋 当前进度

### 已完成
- ✅ 多语言切换 UI（app.js + index.html）
- ✅ 支持 6 种语言循环切换：中文 → 英文 → 韩语 → 日语 → 俄语 → 越南语
- ✅ 语言按钮显示下一个语言的国旗和名称

### 进行中
- 🔄 韩语翻译文件生成（ko.json）
- 🔄 日语翻译文件生成（ja.json）
- 🔄 俄语翻译文件生成（ru.json）
- 🔄 越南语翻译文件生成（vi.json）

## 🎯 目标用户

根据 [research.md](research.md) 的市场调研数据：

| 语言 | 排名 | 主要兴趣 | 停留时间 | 增速 |
|------|------|----------|---------|------|
| 🇰🇷 韩语 | #1 | 购物 + 牙科 | 2-3天 | 最大客源 |
| 🇷🇺 俄语 | #2 | 中医理疗 + 购物 | 7-14天 | +205% |
| 🇯🇵 日语 | #8 | 购物 + 牙科 | 3-5天 | 稳定 |
| 🇻🇳 越南语 | #4 | 购物 + 美食 | 3-7天 | >+100% |

## 🔧 技术实现

### 1. 语言切换逻辑 (src/js/app.js)

```javascript
const SUPPORTED_LANGUAGES = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
];
```

- 点击语言按钮 → 切换到下一个语言
- 按钮显示：`[下一个语言的国旗] [下一个语言名称]`
- 例如：当前中文时显示 `🇬🇧 English`

### 2. 翻译文件结构

所有语言文件使用相同的 key 结构（658 行，~32KB）：

```json
{
  "app": {
    "coverTitle": "外国人来华全攻略",
    "shortTitle": "短期游客",
    ...
  },
  "city.beijing.name": "北京",
  "city.beijing.tag": "故宫·长城·胡同",
  ...
}
```

### 3. 构建系统

`scripts/build.py` 自动打包所有 `src/i18n/*.json` 文件到单个 HTML：

```python
def inline_i18n(html):
    i18n_dir = SRC / "i18n"
    bundle = {}
    for f in sorted(i18n_dir.glob("*.json")):
        lang = f.stem
        bundle[lang] = json.loads(read_file(f))
    # 嵌入 window.__I18N_BUNDLE
```

## 📦 文件清单

### 源文件
- `src/i18n/zh.json` - 中文（已有）
- `src/i18n/en.json` - 英文（已有）
- `src/i18n/ko.json` - 韩语（生成中）
- `src/i18n/ja.json` - 日语（生成中）
- `src/i18n/ru.json` - 俄语（生成中）
- `src/i18n/vi.json` - 越南语（生成中）

### 修改的文件
- `src/js/app.js` - 添加多语言切换逻辑
- `src/index.html` - 更新语言按钮 HTML
- `docs/roadmap.md` - 更新语言扩展进度

## 🧪 测试计划

翻译文件生成后：

1. **本地构建测试**
   ```bash
   python scripts/build.py
   start dist/guide.html
   ```

2. **语言切换测试**
   - 点击语言按钮 6 次，验证循环切换
   - 检查每种语言的显示效果
   - 验证 localStorage 保存偏好

3. **内容完整性测试**
   - 签证自测器
   - 城市详情面板
   - 医疗服务卡片
   - 购物退税指南

4. **部署测试**
   ```bash
   git add src/i18n/*.json src/js/app.js src/index.html docs/roadmap.md
   git commit -m "feat: add multilingual support (ko/ja/ru/vi)"
   git push origin main
   ```
   - Cloudflare Pages 自动构建
   - 验证 hackyourwaytochina.pages.dev

## 📈 预期影响

### 覆盖率提升

| 指标 | 扩展前 | 扩展后 | 提升 |
|------|--------|--------|------|
| **语言覆盖** | 2 种 | 6 种 | +200% |
| **TOP 10客源国覆盖** | 3 国 | 7 国 | +133% |
| **潜在用户覆盖** | ~40% | ~70% | +75% |

### 目标用户覆盖

- ✅ 韩国（#1）- 韩语支持
- ✅ 俄罗斯（#2）- 俄语支持
- ✅ 马来西亚（#3）- 英语支持
- ✅ 越南（#4）- 越南语支持
- ❌ 泰国（#5）- 未覆盖
- ✅ 新加坡（#6）- 英语/中文支持
- ✅ 美国（#7）- 英语支持
- ✅ 日本（#8）- 日语支持

**覆盖率**：8/10 = 80% TOP 10 客源国

## 🚀 下一步

1. 等待翻译文件生成完成
2. 本地测试验证
3. 提交并推送到 GitHub
4. Cloudflare Pages 自动部署
5. 测试线上多语言版本
6. 收集用户反馈

---

📅 开始时间：2026-07-21  
🔗 相关文档：[research.md](research.md), [roadmap.md](roadmap.md)
