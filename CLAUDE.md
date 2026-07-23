# HackYourWaytoChina

外国人入境中国图文攻略。详细架构和设计规范见 [README.md](README.md)。

## Python使用
### 环境
Python 由 Miniconda 提供，激活指令：

```bash
source /c/Users/TunArund/miniconda3/etc/profile.d/conda.sh && conda activate
```

```powershell
& "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -ExecutionPolicy ByPass -NoExit -Command "& 'C:\Users\TunArund\miniconda3\shell\condabin\conda-hook.ps1' ; conda activate 'C:\Users\TunArund\miniconda3'"
```
### 编码注意事项

Windows 终端默认 GBK 编码，Python 脚本输出中文/emoji 极易报错。

- **脚本开头添加** `sys.stdout.reconfigure(encoding='utf-8')` — 解决 print 中文和 Unicode 字符问题
- **避免在 print 中使用 emoji**（如 `✓`、`❌`），即使用 utf-8 也可能在某些管道场景下触发 GBK 错误；用纯 ASCII 替代（`OK`、`[DONE]`、`[FAIL]`）
- **不要用 `conda run`** — 其 stdout 管道 wrapper 自带 GBK 编码问题（`conda run` 内层脚本即使配置了 utf-8 也会被外层 GBK 拦截）。改用 `source /c/Users/TunArund/miniconda3/etc/profile.d/conda.sh && conda activate <env> && python ...`
- 临时脚本使用完毕后**立即删除**

### 可用脚本

- `scripts/docx2md.py` — 将 .docx 转为 .md
- `scripts/i18n-keys.py` — 查看 i18n JSON 文件键结构（支持嵌套层级、扁平键检测）
```bash
python scripts/docx2md.py <input.docx> [output.md]
```
## 测试
给用户启动指令
```powershell
~\miniconda3\shell\condabin\conda-hook.ps1
conda activate md
python -m http.server -d src -b 0.0.0.0 8081
```
之后可通过`curl -s http://localhost:8081/`测试
提示：有nodejs环境

## git限制
不允许主动commit/push，只允许生成commit comment，让用户自行commit/push
不允许主动通过checkout HEAD从仓库历史还原文件，但可在备份后提示用户执行