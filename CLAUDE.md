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
│   │   ├── zh.json
│   │   └── en.json
│   └── img/               # 图片资源
├── scripts/               # 构建脚本
│   ├── build.py           # 多文件→单文件构建
│   └── docx2md.py         # 文档转换
├── docs/                  # 文档
│   ├── DEPLOYMENT.md      # 部署指南
│   ├── research.md        # 市场调研
│   ├── roadmap.md         # 路线图
│   └── feedback.md        # 反馈记录
├── dist/                  # 构建产物
│   └── guide.html         # 单文件输出（自包含）
└── README.md              # 项目说明
```

## 工作约定

- 源代码在 `src/` 目录
- 运行 `python scripts/build.py` 构建为单文件
- 构建产物输出到 `dist/guide.html`
- 修改前先读 [README.md](README.md) 了解设计系统
- 内容决策参考 [docs/research.md](docs/research.md)
- 部署指南见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

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
