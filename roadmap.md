# 路线图

## ✅ 已完成

### v4.0 — 基础框架
- [x] 首屏身份选择页（短期/长期分流）
- [x] PPT 式全屏滚动（`scroll-snap`）
- [x] 短期版 8 屏 + 长期版 8 屏
- [x] 右侧可拖动导航条（hover 预览 + 拖拽 snap）
- [x] 中英双语切换（CSS `[lang]` + localStorage）
- [x] v1 浅色配色（暖米白 + 白色卡片 + 中国红）
- [x] 签证自测器（50 免签 + 55 过境 + 29 互免，5 种着色）
- [x] 目标客户调研 → [resources.md](resources.md)
- [x] 实用链接索引 → [resources.md](resources.md)

### v4.1 — 内容扩展
- [x] S1 签证详情 — 5 种签证类型展开面板（条件+材料+官方链接）
- [x] S7 医疗服务重写 — 3 子面板：国际医院+药品三语对照、牙科/眼科/中医新三件、体检
- [x] S8 购物退税新增 — 4 子面板：科技电子、文创伴手礼、退税攻略、5 城购物地图
- [x] S9 目的地指南新增 — 3 面板：TOP10 城市、5 黑马城市、四季推荐
- [x] S6 补充尺码穿衣提示
- [x] 交互框架 — `openDetail`/`closeDetail` + `popstate` + `Esc` + 二/三级展开

### v4.2 — 架构重构 ✅
- [x] CSS 提取 → `css/style.css`（349 行）
- [x] 数据提取 → `js/data.js`（VISA_FREE, TRANSIT, MUTUAL, COUNTRIES, VISA_DETAIL, DEST_CITIES, SHOP_CITIES）
- [x] i18n 系统 → `i18n/` + `js/i18n.js`（zh.json + en.json，637 键各；支持 fetch 和 bundled 两种模式）
- [x] 应用逻辑 → `js/app.js`（版本管理、导航、签证、语言切换）
- [x] 详情面板 → `js/detail.js`（openDetail/closeDetail/renderDetail + 所有子渲染器）
- [x] 壳页面 → `index.html`（引用外部 CSS/JS）
- [x] 构建脚本 → `build.py`（多文件→单文件合并，支持 `--watch`）
- [x] 文档整合 → 合并为 4 个 .md + 1 个 .html
- [x] 原 `guide.html` 保留（旧版单文件参考）

### v4.3 — 医美清理 + 牙科调研 ✅（2026-07-21）

**背景**：医美风险大，三年内不予考虑。公司一阶段重点：牙科医疗旅游。

#### 清理医美内容
- [x] resources.md：删除医美专题
- [x] index.html：S7 标题改为"医疗服务"，删除医美卡片
- [x] js/data.js：删除 COSMETIC_CLINICS 等医美数据
- [x] js/detail.js：删除 cosmetic 渲染逻辑
- [x] i18n/zh.json + en.json：删除所有医美翻译键（90+ 行）
- [x] 文档同步：README.md、roadmap.md 更新

#### 牙科市场调研
- [x] 创建 research.md（整合 dental_research.md + resources.md）
- [x] 价格对比：中国 vs 韩日泰美
- [x] Reddit 外籍人士反馈整理
- [x] 亚洲竞争格局分析
- [x] **明确标注信息缺口**：缺乏真实案例、供给侧详情、多语言服务验证
- [x] 调研方法论反思：过度依赖 AI 搜索，需补充一手资料
- [x] 下一步调研计划：小红书、Reddit 具体帖子、日韩平台、实地询价

**关键发现**：
- 中国牙科价格为韩国 60%、日本 40%、美国 25%
- 地理优势：韩日游客 2-3 小时航程
- 主要劣势：语言服务不如泰国，国际知名度低
- **信息缺口**：缺乏韩日游客真实案例、涉外诊所价格表、多语言服务覆盖

**产出文件**：
- research.md（牙科市场调研 + 统计数据）
- feedback.md（Boss 反馈记录）

### 架构总览

```
源文件（开发）              产出（交付）
├── index.html              →  python build.py
├── css/style.css           →  dist/guide.html (单文件，离线可用)
├── js/
│   ├── data.js (389 行)
│   ├── i18n.js (51 行)
│   ├── detail.js (256 行)
│   └── app.js (247 行)
├── i18n/
│   ├── zh.json (637 键)
│   └── en.json (637 键)
└── img/
```

总计：~3,000 行源代码，分散在 9 个文件中，模块化可维护。

---

## 🔜 下一步
### 部署
| # | 任务 | 说明 |
|---|------|------|
| 1 | GitHub Pages 部署 | 推送后自动部署静态站点 |
| 2 | Vercel / Cloudflare Pages | 备选托管方案 |

### 语言扩展

| # | 语言 | 覆盖 | 优先级 |
|---|------|------|--------|
| 1 | 🇰🇷 韩语 | TOP 1 | 🔴 最高 |
| 2 | 🇷🇺 俄语 | TOP 2 | 🟡 高 |
| 3 | 🇯🇵 日语 | TOP 8 | 🟡 高 |
| 4 | 🇻🇳 越南语 | TOP 4 | 🟢 中 |

### 视觉增强

| # | 任务 |
|---|------|
| 1 | 真实 App 图标（支付宝/微信/滴滴/12306 等） |
| 2 | App 操作 GIF（绑卡流程、扫码支付） |
| 3 | 城市/景点图片搜集填充 |

---

## ⏸️ 暂缓

| # | 任务 | 原因 |
|---|------|------|
| 1 | PWA Service Worker | 需 HTTPS，GitHub Pages 可后续开启 |
| 2 | 免签国家 SVG 地图 | 需 D3.js/TopoJSON，ROI 低 |
| 3 | 实时政策 API | 无可用公开数据源 |
| 4 | 短/长版差异化配色 | CSS 变量已定义，两版实际共用 |
| 5 | 长期版内容扩展 | 先完善短期版，再拆分 |

---

## 📷 图片素材清单

> 当前用 emoji + 纯色占位。以下是搜集清单。

| 用途 | 数量 | 建议来源 |
|------|------|---------|
| 10 热门城市地标 | 10 | Unsplash/Pexels |
| 5 黑马城市 | 5 | Unsplash/Pexels |
| 华强北商圈 | 1 | Unsplash |
| 义乌商贸城 | 1 | Unsplash |
| App 图标 | 8 | 各 App 官网 |

---

> 📅 更新于 2026年7月
