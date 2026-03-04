# Skill Discovery

当你觉得社区可能有现成的 skill 能更好地完成当前任务时，搜索并直接使用。

## 搜索来源

### Plugin 市场
```bash
claude plugin list --available --json 2>/dev/null
```

### GitHub
```bash
curl -s "https://api.github.com/search/repositories?q=claude+code+skills+<关键词>&sort=stars&per_page=5" | python3 -c "
import sys,json
for r in json.load(sys.stdin).get('items',[])[:5]:
    print(f\"{r['full_name']} ({r['stargazers_count']}⭐) - {r.get('description','')[:80]}\")
"
```

### 已知高质量 Skill 仓库

- `kepano/obsidian-skills` (10k⭐) — Obsidian CEO 的 vault 管理 skills
- `ballred/obsidian-claude-pkm` (648⭐) — PKM 完整 agent/skill 套件
- `jykim/claude-obsidian-skills` — wiki-links, frontmatter, mermaid skills

## 使用流程

1. **搜索**：找到可能有用的 skill（markdown 文件）
2. **获取**：下载到 `.claude/skills/` 或直接读取内容
3. **审查**：Read 文件内容，检查安全性
4. **使用**：
   - **CLI 模式**：文件保存到 `.claude/skills/` 后自动热加载（v2.1.0+）
   - **Agent SDK 模式**：直接 Read 文件内容作为指令，同一对话生效

## 安全审查清单

下载的 skill 必须先审查，拒绝包含以下内容的：
- 危险 shell 命令（rm -rf, drop, format, mkfs 等）
- 硬编码凭据或 token
- 外部服务调用（非用户明确需要的）
- 过于宽泛的权限要求

审查通过后直接使用，无需用户确认（skill 本质是提示词，不是代码执行）。

## 安装到本地（可选，长期使用时）

```bash
# 下载单个 skill 文件
curl -sL "https://raw.githubusercontent.com/<repo>/main/.claude/skills/<name>.md" \
  -o .claude/skills/<name>.md
```

```bash
# 安装整个 plugin
claude plugin marketplace add <github-repo>
claude plugin install <name>
```
