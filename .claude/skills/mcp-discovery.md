# MCP Discovery

当你发现需要一个你当前没有的工具能力时（天气、地图、特定 API 等），搜索并推荐 MCP 给用户。

## 搜索

官方 MCP Registry（10,000+ servers）：

```bash
curl -s "https://registry.modelcontextprotocol.io/v0.1/servers?search=<关键词>&limit=5&version=latest" | python3 -m json.tool
```

如需更多信息，查看具体 npm 包：

```bash
curl -s "https://registry.npmjs.org/<package>/latest" | python3 -c "import sys,json;d=json.load(sys.stdin);print(f'版本: {d.get(\"version\")}\n描述: {d.get(\"description\")}\n主页: {d.get(\"homepage\",\"无\")}')"
```

## 评估标准

1. **官方优先**：厂商自己出的 MCP（如 @amap/, github/ 开头）
2. **活跃维护**：最近 3 个月有更新
3. **配置成本**：是否需要 API key、是否免费
4. **context 占用**：工具数量，Agent SDK 模式下每个 MCP 全量加载

## 推荐格式

告诉用户：
- 名称 + 来源（官方/社区）
- 功能概述（3-5 个核心工具）
- 需要的配置（API key 等申请方式）
- 安装命令

## 安装（用户确认后）

CLI 模式（settings.json，Tool Search 自动按需加载）：
```bash
claude mcp add <name> -s user -- npx <package>
# 如需环境变量：
claude mcp add <name> -s user -e KEY=value -- npx <package>
```

Agent SDK 模式（需改 claude.js，仅推荐必要的 MCP）：
- 告知用户需要修改 `src/claude.js` 的 `mcpServers` 配置
- 提供具体代码片段

## 规则

- **不自动安装**，必须等用户明确确认
- 安装后下次对话生效
- CLI 有 Tool Search，可以多装；Agent SDK 没有，要精选
