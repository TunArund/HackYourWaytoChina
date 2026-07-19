# HackYourWaytoChina

## Python 环境

Python 由 Miniconda 提供，激活命令：

```powershell
%WINDIR%\System32\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy ByPass -NoExit -Command "& 'C:\Users\TunArund\miniconda3\shell\condabin\conda-hook.ps1' ; conda activate 'C:\Users\TunArund\miniconda3' "
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
