# HackYourWaytoChina

外国人入境中国图文攻略。详细架构和设计规范见 [README.md](README.md)。

## 开发环境

### Python 环境

Python 由 Miniconda 提供，激活 `md` 环境：

```bash
source /c/Users/TunArund/miniconda3/etc/profile.d/conda.sh && conda activate md
```

```powershell
& "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -ExecutionPolicy ByPass -NoExit -Command "& 'C:\Users\TunArund\miniconda3\shell\condabin\conda-hook.ps1' ; conda activate 'C:\Users\TunArund\miniconda3'"
```

```powershell
~\miniconda3\shell\condabin\conda-hook.ps1
conda activate md
python -m http.server -d src
```

**已安装包**：
- `python-docx` 1.2.0 — 读取 .docx 文件
- `markdownify` 1.2.2 — HTML → Markdown 转换

**重要提示**：
- 所有 Python 脚本必须在激活 `md` 环境后运行
- Windows 环境下使用 `sys.stdout.reconfigure(encoding='utf-8')` 解决中文输出问题
- 避免在输出中使用 emoji（会导致 GBK 编码错误）

### 工具脚本

**保留脚本**：
- `scripts/docx2md.py` — 将 .docx 转为 .md

```bash
python scripts/docx2md.py <input.docx> [output.md]
```

**临时脚本清理**：
迁移、重构、数据修复等一次性脚本使用完毕后应立即删除，避免 `scripts/` 目录堆积无用文件。保留的脚本应该是可复用的工具。

## 工作规范

### 文档输出
- **避免重复输出**：不要在终端验证完成后，再次在聊天框中重复相同的内容
- **临时文档管理**：验证报告、测试结果等临时文档应创建在项目根目录，完成后及时清理
- **简洁反馈**：修复完成后提供简洁的摘要，详细内容保存在文档中供查阅