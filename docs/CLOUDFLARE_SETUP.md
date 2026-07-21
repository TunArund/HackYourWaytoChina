# Cloudflare Pages 部署指南

## 📋 准备工作

✅ GitHub 仓库已创建：https://github.com/TunArund/HackYourWaytoChina
✅ 代码已推送到 `main` 分支
✅ 构建脚本已测试通过（输出 81 KB）

## 🚀 Cloudflare Pages 部署步骤

### 第一步：登录 Cloudflare

1. 访问 https://dash.cloudflare.com/
2. 如果没有账号，免费注册一个（无需信用卡）

### 第二步：创建 Pages 项目

1. 在左侧菜单中，点击 **Workers & Pages**
2. 点击右上角 **Create application**
3. 选择 **Pages** 标签
4. 点击 **Connect to Git**

### 第三步：连接 GitHub 仓库

1. 选择 **GitHub** 作为 Git 提供商
2. 点击 **Connect GitHub**
3. 授权 Cloudflare 访问你的 GitHub（首次需要）
4. 在仓库列表中找到并选择 **HackYourWaytoChina**
5. 点击 **Begin setup**

### 第四步：配置构建设置

在 **Set up builds and deployments** 页面填写：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Project name** | `hackyourwaytochina` | 会生成 URL：`hackyourwaytochina.pages.dev` |
| **Production branch** | `main` | 生产分支 |
| **Framework preset** | `None` | 选择"无"（我们有自定义构建） |
| **Build command** | `python scripts/build.py` | ⚠️ 重要：必须包含 `scripts/` 路径 |
| **Build output directory** | `dist` | 输出目录 |
| **Root directory (optional)** | （留空） | 项目根目录 |

#### 环境变量（可选）

不需要添加任何环境变量。Cloudflare Pages 默认提供 Python 3.7+。

### 第五步：部署

1. 确认所有设置正确后，点击 **Save and Deploy**
2. Cloudflare 会开始构建：
   - 克隆 GitHub 仓库
   - 运行 `python scripts/build.py`
   - 上传 `dist/` 目录
3. 首次部署约 **1-2 分钟**

### 第六步：访问网站

部署成功后：

- 自动分配的域名：`https://hackyourwaytochina.pages.dev`
- 点击链接即可访问

## 🔄 后续部署

每次推送到 `main` 分支，Cloudflare Pages 会自动：
1. 检测到新提交
2. 触发构建
3. 部署到生产环境

**预览部署**：每个 Pull Request 会自动创建独立的预览环境。

## 🌐 自定义域名（可选）

如果你有自己的域名（如 `guide.example.com`）：

### 方法 1：域名在 Cloudflare 托管

1. 在 Pages 项目页面，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入域名（如 `guide.example.com`）
4. Cloudflare 会自动添加 DNS 记录
5. 等待 DNS 传播（通常几分钟）

### 方法 2：域名在其他服务商

1. 在 Cloudflare Pages 获取 CNAME 目标
2. 去你的域名服务商添加 CNAME 记录：
   ```
   guide.example.com  CNAME  hackyourwaytochina.pages.dev
   ```
3. 回到 Cloudflare Pages 验证域名

## 📊 监控与管理

### 查看部署历史

1. Pages 项目页面 → **Deployments**
2. 可以看到所有部署记录：
   - 提交 SHA
   - 分支
   - 部署时间
   - 构建日志

### 查看构建日志

如果构建失败：
1. 点击失败的部署
2. 查看 **Build log**
3. 找到错误信息

### 常见构建错误

#### 错误：`python: command not found`

**原因**：Cloudflare Pages 环境问题（罕见）

**解决**：将 Build command 改为 `python3 scripts/build.py`

#### 错误：`No such file or directory: 'src/index.html'`

**原因**：构建脚本路径错误

**解决**：确保 Build command 是 `python scripts/build.py`（包含 `scripts/`）

#### 错误：`dist` directory is empty

**原因**：构建脚本运行失败但未报错

**解决**：
1. 本地测试 `python scripts/build.py`
2. 检查 `dist/guide.html` 是否生成
3. 查看构建日志中的 Python 错误

### 回滚到之前版本

1. Pages 项目页面 → **Deployments**
2. 找到要回滚的历史版本
3. 点击右侧 **···** → **Rollback to this deployment**
4. 确认回滚

## 📈 性能与分析

### 访问统计

1. Pages 项目页面 → **Analytics**
2. 可以查看：
   - 页面浏览量
   - 唯一访客
   - 地理分布
   - 带宽使用

### 中国访问优化

**Cloudflare 在中国的表现**：

| 域名类型 | 中国访问速度 | 说明 |
|---------|------------|------|
| `.pages.dev` | 中等 | 可能被间歇性限速 |
| 自定义域名 + Cloudflare DNS | **快** | 利用 Cloudflare 中国节点 |
| 自定义域名 + 其他 DNS | 慢 | 绕过 Cloudflare CDN |

**推荐**：使用自定义域名 + Cloudflare DNS 托管以获得最佳中国访问体验。

## 🔧 高级配置

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

### 404 页面

将自定义 404 页面命名为 `404.html` 放在 `dist/` 目录。

## 💰 费用说明

Cloudflare Pages **免费计划**包括：

- ✅ 无限请求
- ✅ 无限带宽
- ✅ 500 次构建/月
- ✅ 1 次并发构建
- ✅ 自动 HTTPS
- ✅ 全球 CDN

**你的项目完全在免费额度内**，无需付费。

## 📞 支持

- **Cloudflare 文档**：https://developers.cloudflare.com/pages/
- **社区论坛**：https://community.cloudflare.com/c/developers/pages/
- **状态页面**：https://www.cloudflarestatus.com/

---

## ✅ 部署检查清单

完成以下检查后即可部署：

- [ ] GitHub 仓库已推送最新代码
- [ ] 本地测试 `python scripts/build.py` 成功
- [ ] `dist/guide.html` 文件正常生成
- [ ] Cloudflare 账号已创建
- [ ] 构建配置填写正确（特别是 `scripts/build.py`）
- [ ] 部署成功后访问 `.pages.dev` 域名测试

---

📅 创建于 2026-07-21
🔗 仓库：https://github.com/TunArund/HackYourWaytoChina
