# Cloudflare Pages 部署指南

> 完整的 Cloudflare Pages 部署教程，包含准备工作、部署步骤、故障排查和后续管理。

## 📋 部署前准备

### 当前状态

✅ **GitHub 仓库**：https://github.com/TunArund/HackYourWaytoChina  
✅ **代码已推送**：最新提交 `main` 分支  
✅ **构建测试**：本地构建成功（输出 81 KB）  
✅ **项目结构**：已重构为 `src/` + `docs/` + `scripts/`  

### 前置条件

- [ ] GitHub 账号（已有）
- [ ] Cloudflare 账号（免费注册：https://dash.cloudflare.com/）
- [ ] 本地测试构建通过

### 本地测试构建

```bash
# 激活 Python 环境（Windows Git Bash）
source /c/Users/TunArund/miniconda3/etc/profile.d/conda.sh
conda activate md

# 构建
python scripts/build.py

# 预期输出
Building...
  ✓ CSS inlined
  ✓ JS inlined
  ✓ i18n bundled
  → D:\Work\HackYourWaytoChina\dist\guide.html (81 KB)

# 本地预览
start dist/guide.html
```

---

## 🚀 Cloudflare Pages 部署步骤

### 第一步：登录 Cloudflare

1. 访问 https://dash.cloudflare.com/
2. 如果没有账号，免费注册（无需信用卡）

### 第二步：创建 Pages 项目

1. 左侧菜单点击 **Workers & Pages**
2. 点击右上角 **Create application**
3. 选择 **Pages** 标签
4. 点击 **Connect to Git**

### 第三步：连接 GitHub 仓库

1. 选择 **GitHub** 作为 Git 提供商
2. 点击 **Connect GitHub**
3. 授权 Cloudflare 访问你的 GitHub（首次需要）
4. 在仓库列表中找到并选择 **HackYourWaytoChina**
5. 点击 **Begin setup**

### 第四步：配置构建设置 ⚠️ 关键

在 **Set up builds and deployments** 页面填写：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Project name** | `hackyourwaytochina` | 生成域名：`hackyourwaytochina.pages.dev` |
| **Production branch** | `main` | 生产分支 |
| **Framework preset** | `None` | 选择"无"（自定义构建） |
| **Build command** | `python scripts/build.py` | ⚠️ **必须包含** `scripts/` |
| **Build output directory** | `dist` | 构建输出目录 |
| **Root directory** | （留空） | 项目根目录 |

⚠️ **重要**：在 Cloudflare Pages 设置中，确保：
- **Build command** 只填 `python scripts/build.py`
- **没有** Deploy command（留空或删除）
- Pages 会自动部署 `dist` 目录的内容

#### 环境变量

不需要添加任何环境变量。Cloudflare Pages 默认提供 Python 3.7+。

### 第五步：部署

1. 确认所有设置正确后，点击 **Save and Deploy**
2. Cloudflare 开始构建：
   - 克隆 GitHub 仓库
   - 运行 `python scripts/build.py`
   - 上传 `dist/` 目录
3. 首次部署约 **1-2 分钟**

### 第六步：访问网站

部署成功后：

- **自动域名**：https://hackyourwaytochina.pages.dev
- 点击链接访问并测试功能

---

## 🔄 自动部署

每次推送到 `main` 分支，Cloudflare Pages 会自动：

1. 检测到新提交
2. 触发构建流程
3. 部署到生产环境（约 1-2 分钟）

**预览部署**：每个 Pull Request 会自动创建独立的预览环境（URL 格式：`<pr-id>.hackyourwaytochina.pages.dev`）

---

## 🌐 自定义域名（可选）

### 方法 1：域名在 Cloudflare 托管

1. Pages 项目页面 → **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入域名（如 `guide.example.com`）
4. Cloudflare 自动添加 DNS 记录
5. 等待 DNS 传播（通常几分钟）

### 方法 2：域名在其他服务商

1. 在 Cloudflare Pages 获取 CNAME 目标
2. 在域名服务商添加 CNAME 记录：
   ```
   guide.example.com  CNAME  hackyourwaytochina.pages.dev
   ```
3. 回到 Cloudflare Pages 验证域名

### 中国访问优化 🇨🇳

| 域名类型 | 中国访问速度 | 说明 |
|---------|------------|------|
| `.pages.dev` | 中等 | 可能被间歇性限速 |
| 自定义域名 + Cloudflare DNS | **快** ⭐ | 利用 Cloudflare 中国节点 |
| 自定义域名 + 其他 DNS | 慢 | 绕过 Cloudflare CDN |

**推荐**：使用自定义域名 + Cloudflare DNS 托管获得最佳中国访问体验。

---

## 📊 监控与管理

### 查看部署历史

1. Pages 项目页面 → **Deployments**
2. 查看所有部署记录：
   - 提交 SHA
   - 分支名称
   - 部署时间
   - 构建状态

### 查看构建日志

如果构建失败：

1. 点击失败的部署记录
2. 查看 **Build log**
3. 定位错误信息

### 访问统计

1. Pages 项目页面 → **Analytics**
2. 可查看：
   - 页面浏览量
   - 唯一访客
   - 地理分布
   - 带宽使用

### 回滚到之前版本

1. Pages 项目页面 → **Deployments**
2. 找到要回滚的历史版本
3. 点击右侧 **···** → **Rollback to this deployment**
4. 确认回滚

---

## 🔧 故障排查

### 构建错误：`python: command not found`

**原因**：Cloudflare Pages 环境问题（罕见）

**解决**：将 Build command 改为 `python3 scripts/build.py`

### 构建错误：`No such file or directory: 'src/index.html'`

**原因**：构建脚本路径错误

**解决**：确保 Build command 是 `python scripts/build.py`（包含 `scripts/`）

### 构建错误：`dist directory is empty`

**原因**：构建脚本运行失败但未报错

**解决**：
1. 本地测试 `python scripts/build.py`
2. 检查 `dist/guide.html` 是否生成
3. 查看 Cloudflare 构建日志中的 Python 错误

### 部署后页面 404

**检查**：
- Build output directory 是否设为 `dist`
- 构建日志中是否有 `dist/guide.html` 生成

### 本地构建失败：`ModuleNotFoundError: No module named 'watchdog'`

**原因**：仅 `--watch` 模式需要 watchdog

**解决**：
```bash
pip install watchdog
# 或者不使用 --watch 模式
python scripts/build.py
```

---

## 🛠️ 本地开发工具

### 构建命令

```bash
# 单次构建
python scripts/build.py

# 监听文件变化自动构建（需要 watchdog）
python scripts/build.py --watch

# 安装 watchdog（可选）
pip install watchdog
```

### 本地预览

```bash
# 方式 1：直接打开（推荐）
python scripts/build.py && start dist/guide.html

# 方式 2：本地服务器
cd dist && python -m http.server 8000
# 访问 http://localhost:8000/guide.html
```

### 使用 wrangler CLI 部署（可选）

如果你想使用命令行部署而不是 Web 界面，参考 [WRANGLER.md](WRANGLER.md)。

**注意**：对于 Pages 项目，推荐使用 Web 界面连接 GitHub 实现自动部署。

### 验证构建

```bash
# 检查输出文件
ls -lh dist/guide.html

# 预期输出：~81 KB
```

### 构建统计

| 指标 | 值 |
|------|-----|
| 源文件总数 | ~25 个（HTML/CSS/JS/JSON/图片） |
| 输出文件 | 1 个（guide.html，自包含） |
| 构建产物大小 | 81 KB |
| 构建时间 | < 2 秒 |
| 支持语言 | 中文/英文 |

---

## 🔒 高级配置

### 自定义 HTTP 头

在项目根目录创建 `_headers` 文件：

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: public, max-age=3600
```

### 重定向规则

在项目根目录创建 `_redirects` 文件：

```
/old-url  /new-url  301
/guide    /         302
```

### 自定义 404 页面

将自定义 404 页面命名为 `404.html` 放在 `dist/` 目录。

---

## 💰 费用说明

Cloudflare Pages **免费计划**包括：

- ✅ 无限请求
- ✅ 无限带宽
- ✅ 500 次构建/月
- ✅ 1 次并发构建
- ✅ 自动 HTTPS
- ✅ 全球 CDN

**你的项目完全在免费额度内**，无需付费。

---

## ✅ 部署检查清单

### 部署前

- [x] GitHub 仓库已推送最新代码
- [x] 本地测试 `python scripts/build.py` 成功
- [x] `dist/guide.html` 文件正常生成（81 KB）
- [ ] Cloudflare 账号已创建
- [ ] GitHub 授权给 Cloudflare
- [ ] 构建配置填写正确（特别是 `python scripts/build.py`）

### 部署后

- [ ] 访问 `https://hackyourwaytochina.pages.dev` 成功
- [ ] 页面正常加载
- [ ] 中英文切换正常
- [ ] 全屏滚动 snap 正常
- [ ] 右侧导航条可拖动
- [ ] 签证自测器正常工作
- [ ] 所有详情面板可展开
- [ ] 图片正常显示

---

## 📞 支持资源

- **Cloudflare 文档**：https://developers.cloudflare.com/pages/
- **社区论坛**：https://community.cloudflare.com/c/developers/pages/
- **状态页面**：https://www.cloudflarestatus.com/

---

## 📖 相关文档

- [README.md](../README.md) - 项目设计系统
- [docs/roadmap.md](roadmap.md) - 开发路线图
- [docs/research.md](research.md) - 市场调研

---

📅 创建于 2026-07-21  
🔗 GitHub：https://github.com/TunArund/HackYourWaytoChina  
🌐 部署域名：https://hackyourwaytochina.pages.dev
