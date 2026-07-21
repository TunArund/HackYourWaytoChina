# Cloudflare Pages 部署故障排查

## 问题诊断

### 错误日志分析

```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

**根本原因**：Cloudflare Pages 在构建后执行了错误的部署命令 `npx wrangler deploy`。

## ✅ 解决方案

### 1. 检查 Cloudflare Pages 设置

进入 Cloudflare Dashboard → Workers & Pages → hackyourwaytochina → Settings → Builds & deployments

确认以下配置：

| 配置项 | 正确值 | 说明 |
|--------|--------|------|
| **Build command** | `python scripts/build.py` | 构建命令 |
| **Build output directory** | `dist` | 输出目录 |
| **Root directory** | （留空） | 项目根目录 |

### 2. 删除错误配置 ⚠️

如果看到以下配置，**必须删除**：
- ❌ **Deploy command**: 任何值都要删除（留空）
- ❌ **Environment variables** 中的 `WRANGLER_*` 相关变量

### 3. 触发重新部署

有两种方式：

#### 方式 1：通过 Dashboard（推荐）

1. 进入项目 → **Deployments**
2. 找到失败的部署
3. 点击 **Retry deployment**

#### 方式 2：推送新提交（自动触发）

```bash
# 已经推送了修复
# Cloudflare 会自动检测到新提交并重新部署
```

## 预期结果

修复后的构建日志应该是：

```
✓ Build command completed
✓ Uploading... (100%)
✓ Deployment complete!
🌎 https://hackyourwaytochina.pages.dev
```

## 如果还是失败

### 检查点 1：Build command 是否正确

必须是 `python scripts/build.py`，不是：
- ❌ `python build.py`
- ❌ `python3 scripts/build.py`

### 检查点 2：Build output directory 是否正确

必须是 `dist`，不是：
- ❌ `./dist`
- ❌ `/dist`
- ❌ `dist/`

### 检查点 3：Framework preset

必须选择 **None**，不要选其他框架。

## 手动验证构建产物

在构建日志中查找：

```
→ /opt/buildhome/repo/dist/guide.html (81 KB)
```

如果看到这行，说明构建成功，文件已生成。

---

📅 更新于 2026-07-21  
🔗 相关文档：[DEPLOYMENT.md](DEPLOYMENT.md)
