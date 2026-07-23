# TODO

## ⚡ 快赢（立竿见影）

根据`<span class="top-bar-title" data-i18n="app.nav.title">🧳 China Entry Guide</span>`修改meta title和favicon
Common Meds (CN/EN/RU)逻辑有误，应该写成CN|targetLang

| # | Task | Effort |
|---|------|--------|
| 4 | **短/长版配色区分** — `.version-short`（绿 `--short-accent`）vs `.version-long`（紫 `--long-accent`），切换 `--accent` | 小 |
| 10 | **S5 绑卡截图** — 支付宝/微信绑卡操作截图，图文并茂 | 小 |

## 🔧 结构优化（重要但见效慢）
CSS框架化 参考bootstrap
| 3 |  DOM 简化** — 去嵌套，减少 overflow 问题 | 中 |
| # | Task | Effort |
|---|------|--------|
| 1 | **事件委托 + 模块化** — HTML `onclick` → JS 事件委托 + IIFE 包裹各文件 | 大 |
| 2 | **i18n 按概念重排** — `sX.xxx` → `visa.xxx` / `payment.xxx` / `city.xxx` 去重 | 大 |
| 5 | **CSS 多行格式化** — 当前 ~440 行单行压缩，展开 | 小 |
| 8 | **JSDoc** — 导出函数加注释 | 小 |
emoji从i18n中抽离
## 📝 内容充实

| # | Task |
|---|------|
| 11 | **长期版 L1-L8 内容** — 租房合同细节、驾照换领流程、国际学校学费等 |
| 12 | **牙科深化** — S7 预约流程、术后注意事项 |
| 13 | **S1 官方链接 → 具体政策页** — 替换首页链接 |
| 14 | **App 动图教程** — 支付宝/微信/滴滴/美团/12306 下载使用 |
