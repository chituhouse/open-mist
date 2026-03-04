---
paths:
  - "package.json"
  - "package-lock.json"
  - "scripts/**"
---
# 依赖管理规则

- 所有 `require()` / `import` 的第三方包必须在 `package.json` 的 `dependencies` 中声明
- 添加新依赖用 `npm install <pkg>`（自动写入 package.json），不要手动编辑
- 运行 `npm install` 会清除未声明的包——这是设计行为，不是 bug
- 修改 scripts/ 下的脚本时，检查它引用的所有模块是否在 dependencies 中
