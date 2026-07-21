# 部署指南 — Cloudflare Pages

## 前置条件

1. GitHub 账号
2. Cloudflare 账号（免费）
3. Git 仓库已推送到 GitHub

## 部署步骤

### 1. 推送代码到 GitHub

```bash
# 如果还没有创建远程仓库，先在 GitHub 创建一个新仓库
# 仓库名建议：HackYourWaytoChina

git remote add origin https://github.com/YOUR_USERNAME/HackYourWaytoChina.git
git branch -M main
git add .
git commit -m "feat: ready for Cloudflare Pages deployment"
git push -u origin main
```

### 2. 在 Cloudflare Pages 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单选择 **Workers & Pages**
3. 点击 **Create application** → **Pages** → **Connect to Git**
4. 授权 GitHub 并选择 `HackYourWaytoChina` 仓库
5. 配置构建设置：

   | 设置项 | 值 |
   |--------|-----|
   | **Production branch** | `main` |
   | **Build command** | `python scripts/build.py` |
   | **Build output directory** | `dist` |
   | **Root directory** | `/` (留空) |

6. **Environment variables**（环境变量）：
   - 不需要添加任何环境变量

7. 点击 **Save and Deploy**

### 3. 部署完成

- 首次部署约 1-2 分钟
- 部署成功后会自动分配一个域名：`https://hackyourwaytochina.pages.dev`
- 后续每次推送到 `main` 分支会自动重新部署

### 4. 自定义域名（可选）

如果你有自己的域名：

1. 在 Cloudflare Pages 项目页面点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入域名（如 `guide.yourdomain.com`）
4. 按照提示添加 CNAME 记录到你的 DNS

## 本地测试

部署前可以本地验证构建：

```bash
# 激活 Python 环境
source /c/Users/TunArund/miniconda3/etc/profile.d/conda.sh
conda activate md

# 构建
python scripts/build.py

# 预览（在浏览器打开 dist/guide.html）
start dist/guide.html
```

## 构建说明

- **输入**：`src/index.html` + `src/css/` + `src/js/` + `src/i18n/`
- **输出**：`dist/guide.html`（单文件，自包含）
- **构建时间**：< 5 秒
- **文件大小**：~90 KB

## 注意事项

1. **Python 版本**：Cloudflare Pages 默认使用 Python 3.7+，`build.py` 兼容
2. **依赖**：`build.py` 仅使用标准库，无需 `requirements.txt`
3. **构建缓存**：Cloudflare 会缓存 Python 环境，二次构建更快
4. **预览部署**：每个 PR 会自动创建预览环境

## 故障排查

### 构建失败："python: command not found"

Cloudflare Pages 默认提供 Python，如果报错检查：
- Build command 是否为 `python scripts/build.py`（不是 `python3`）

### 部署后页面 404

检查：
- Build output directory 是否设为 `dist`
- `dist/guide.html` 是否成功生成

### 中国访问慢

Cloudflare 在中国有节点，但需要：
1. 使用自定义域名（非 `.pages.dev`）
2. 域名在 Cloudflare DNS 托管
3. 启用 Cloudflare CDN（橙色云朵）

## 监控与分析

Cloudflare Pages 提供：
- **Analytics**：访问量、流量、地理分布
- **Deployment logs**：构建日志
- **Edge logs**：实时访问日志（Workers Paid Plan）

## 回滚

如需回滚到之前的版本：
1. Pages 项目页面 → **Deployments**
2. 找到历史部署记录
3. 点击 **...** → **Rollback to this deployment**

---

📅 创建于 2026-07-21
