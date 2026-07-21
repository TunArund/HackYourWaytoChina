# Cloudflare Pages 部署工具任务清单

## ✅ 已完成

### 1. 项目结构重构
- [x] 源代码移至 `src/` 目录
- [x] 文档移至 `docs/` 目录  
- [x] 构建脚本移至 `scripts/` 目录
- [x] 更新所有路径引用

### 2. 构建系统
- [x] 修复 `scripts/build.py` 路径逻辑
- [x] 本地测试构建成功（81 KB 输出）
- [x] 验证所有资源正确内联（CSS/JS/i18n）

### 3. Git 仓库
- [x] 创建 `.gitignore` 忽略 `dist/` 目录
- [x] 提交所有更改
- [x] 推送到 GitHub：https://github.com/TunArund/HackYourWaytoChina
- [x] 最新提交：7c552fa "fix: correct wrangler.toml format"

### 4. Cloudflare 配置
- [x] 修复 `wrangler.toml` 格式
- [x] 创建详细部署文档 `docs/CLOUDFLARE_SETUP.md`
- [x] 创建通用部署指南 `docs/DEPLOYMENT.md`

---

## 🚀 下一步：Cloudflare Pages 部署

### 在线部署步骤（Web 界面）

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com/
   - 注册/登录账号（免费）

2. **创建 Pages 项目**
   ```
   左侧菜单 → Workers & Pages 
   → Create application 
   → Pages 标签
   → Connect to Git
   ```

3. **连接 GitHub**
   ```
   选择 GitHub
   → 授权 Cloudflare 访问
   → 选择仓库：TunArund/HackYourWaytoChina
   → Begin setup
   ```

4. **配置构建设置**
   ```
   Project name: hackyourwaytochina
   Production branch: main
   Framework preset: None
   Build command: python scripts/build.py
   Build output directory: dist
   Root directory: (留空)
   ```

5. **保存并部署**
   ```
   Save and Deploy
   → 等待 1-2 分钟
   → 访问：https://hackyourwaytochina.pages.dev
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
# 构建后在浏览器打开
python scripts/build.py && start dist/guide.html

# Windows
start dist/guide.html

# macOS
open dist/guide.html

# Linux
xdg-open dist/guide.html
```

### 验证构建
```bash
# 检查输出文件
ls -lh dist/guide.html

# 预期输出：~81 KB
```

---

## 📊 构建统计

| 指标 | 值 |
|------|-----|
| 源文件总数 | ~25 个（HTML/CSS/JS/JSON/图片） |
| 输出文件 | 1 个（guide.html） |
| 构建产物大小 | 81 KB |
| 构建时间 | < 2 秒 |
| 支持语言 | 中文/英文 |

---

## 🔧 故障排查

### 本地构建失败

**问题**：`ModuleNotFoundError: No module named 'watchdog'`
```bash
# 解决：仅 --watch 模式需要
pip install watchdog
```

**问题**：`FileNotFoundError: src/index.html`
```bash
# 解决：确保在项目根目录执行
cd d:/Work/HackYourWaytoChina
python scripts/build.py
```

### Cloudflare 构建失败

**问题**：`python: command not found`
- 解决：构建命令改为 `python3 scripts/build.py`

**问题**：`No such file: 'index.html'`
- 解决：确认构建命令是 `python scripts/build.py`（包含 scripts/）

**问题**：`dist directory is empty`
- 解决：检查构建日志，查看 Python 错误信息

---

## 📖 文档索引

| 文档 | 说明 |
|------|------|
| [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md) | Cloudflare Pages 详细步骤（推荐） |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | 通用部署指南 |
| [README.md](../README.md) | 项目设计系统 |
| [docs/roadmap.md](docs/roadmap.md) | 开发路线图 |

---

## ✅ 部署前检查清单

完成以下检查后即可部署：

- [x] 本地构建测试通过
- [x] GitHub 仓库已推送最新代码
- [x] `wrangler.toml` 格式正确
- [x] 部署文档已创建
- [ ] Cloudflare 账号已注册
- [ ] GitHub 授权给 Cloudflare
- [ ] 在 Cloudflare Dashboard 完成构建配置
- [ ] 部署成功并测试访问

---

## 🎯 部署后验证

部署成功后，测试以下功能：

1. **基础功能**
   - [ ] 页面正常加载
   - [ ] 中英文切换正常
   - [ ] 全屏滚动 snap 正常
   - [ ] 右侧导航条可拖动

2. **内容完整性**
   - [ ] 签证自测器正常工作
   - [ ] 所有详情面板可展开
   - [ ] 图片正常显示
   - [ ] 链接正常跳转

3. **性能测试**
   - [ ] 首次加载 < 2 秒
   - [ ] 语言切换 < 200ms
   - [ ] 移动端适配正常

---

📅 创建于 2026-07-21  
🔗 GitHub：https://github.com/TunArund/HackYourWaytoChina  
🌐 部署目标：https://hackyourwaytochina.pages.dev
