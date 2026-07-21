# HackYourWaytoChina

外国人入境中国图文攻略 — 多文件架构，构建为单 HTML 文件。

## 项目结构

```
HackYourWaytoChina/
├── src/                    # 源代码
│   ├── index.html         # 主页面
│   ├── css/style.css      # 样式
│   ├── js/                # 脚本
│   │   ├── app.js
│   │   ├── data.js
│   │   ├── detail.js
│   │   └── i18n.js
│   ├── i18n/              # 国际化
│   │   ├── zh.json        # 中文（完全支持）
│   │   ├── en.json        # 英文（完全支持）
│   │   ├── ja.json        # 日语（动态内容）
│   │   ├── ko.json        # 韩语（动态内容）
│   │   ├── ru.json        # 俄语（动态内容）
│   │   └── vi.json        # 越南语（动态内容）
│   └── img/               # 图片资源
├── scripts/               # 构建脚本
│   ├── build.py           # 多文件→单文件构建
│   ├── flatten_to_nested.py  # i18n结构转换
│   └── docx2md.py         # 文档转换
├── docs/                  # 文档
│   ├── research.md        # 市场调研
│   ├── roadmap.md         # 路线图
│   └── feedback.md        # 反馈记录
├── dist/                  # 构建产物
│   └── guide.html         # 单文件输出（自包含，离线可用）
└── README.md              # 项目说明
```

### 多语言支持说明

**完全支持**：中文（zh）、英文（en）
- HTML中硬编码双语内容
- 所有UI元素、表单、按钮均支持

**部分支持**：日语（ja）、韩语（ko）、俄语（ru）、越南语（vi）
- 仅支持动态渲染内容（城市列表、详情页、下拉选项等）
- 部分UI元素仍显示中英文
- 适用于核心内容浏览

## 工作约定

- 源代码在 `src/` 目录
- 运行 `python scripts/build.py` 构建为单文件
- 构建产物输出到 `dist/guide.html`
- 修改前先读 [README.md](README.md) 了解设计系统
- 内容决策参考 [docs/research.md](docs/research.md)

### 提交和部署

⚠️ **Cloudflare Pages 每月仅500次构建额度，谨慎提交！**

- **不要自动提交**：每次修改完使用本地服务器测试
- **等用户指示**：用户明确说"提交"时再 `git commit && git push`
- **本地测试流程**：
  1. 修改源文件 (`src/`)
  2. 提供测试服务器启动指令：`python -m http.server 8888 --directory src`
  3. 提供浏览器测试步骤供用户验证
  4. 等待用户确认后再提交

### 开发模式说明

- **多文件开发**：直接在 `src/` 目录修改，`i18n.js` 会自动 fetch JSON 文件
- **单文件构建**：运行 `python scripts/build.py` 生成 `dist/guide.html`（离线可用）
- **测试服务器**：`python -m http.server 8888 --directory src` 启动多文件模式
- **构建必要性**：仅用于生成离线版本，开发时无需构建

## Python 环境

Python 由 Miniconda 提供，激活命令：
```bash
source /c/Users/TunArund/miniconda3/etc/profile.d/conda.sh && conda activate md && cd "d:/Work/HackYourWaytoChina" && python -c "exit()"
```

```powershell
& "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -ExecutionPolicy ByPass -NoExit -Command "& 'C:\Users\TunArund\miniconda3\shell\condabin\conda-hook.ps1' ; conda activate 'C:\Users\TunArund\miniconda3'"
```

### `md` 环境

用于文档转换（docx → markdown 等），已安装关键包：

| 包名 | 版本 | 用途 |
| --- | --- | --- |
| python-docx | 1.2.0 | 读取 .docx 文件 |
| markdownify | 1.2.2 | HTML → Markdown 转换 |

**在 Bash 终端中使用：**

```bash
source /c/Users/TunArund/miniconda3/etc/profile.d/conda.sh
conda activate md
```

### 工具脚本

- `scripts/build.py` — 多文件构建为单 HTML（离线可用）

```bash
python scripts/build.py
```

- `scripts/docx2md.py` — 将 .docx 转为 .md（python-docx + markdownify）

```bash
python scripts/docx2md.py <input.docx> [output.md]
```
