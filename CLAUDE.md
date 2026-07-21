# HackYourWaytoChina

外国人入境中国图文攻略 — 单 HTML 文件（`guide.html`），PPT 式全屏 snap 滚动，中英双语。

## 项目结构

| 文件 | 用途 |
|------|------|
| `guide.html` | 主页面（当前单文件；下一步拆分多文件） |
| `README.md` | 设计系统、屏幕规划、已知缺口 |
| `resources.md` | 调研数据 + 链接索引 |
| `roadmap.md` | 路线图 + 实施规格 |
| `img/` | 图片素材 |

## 工作约定

- `guide.html` 是当前产出文件
- 下一步拆分为 `index.html` + `css/` + `js/` + `i18n/` 多文件架构
- 运行 `python build.py` 合并为单文件供离线预览
- 修改前先读 `README.md` 了解设计系统
- 内容决策参考 `resources.md`

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

- `docx2md.py` — 将 .docx 转为 .md（python-docx + markdownify）

```bash
python docx2md.py <input.docx> [output.md]
```
