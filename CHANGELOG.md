# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0] - 2026-03-10

### Added

- **OpenMist CLI** (`openmist`) — 交互式命令行管理工具
  - 系统状态面板（服务状态、内存、磁盘、对话指标）
  - 三级配置树导航（48 个配置项，5 大分类）
  - API 连通性测试（Claude、飞书、企微、DashScope）
  - 系统诊断（环境检查、资源检查、SSL 证书）
  - 日志查看（静态日志 + 实时 tail）
  - 服务控制（restart/stop/status）
- 子命令模式：`openmist status`、`openmist test`、`openmist config`
- 单元测试覆盖所有纯逻辑函数（22 个测试用例）
- `APP_USER` 和 `SERVICE_NAME` 环境变量支持

### Changed

- `.env.example` 补充管理工具相关环境变量

## [1.0.1] - 2026-03-09

### Fixed

- 清理剩余私有硬编码

## [1.0.0] - 2026-03-07

### Added

- 初始开源发布
- Claude Agent SDK 网关核心
- 飞书 + 企业微信多通道支持
- 安全守卫（hooks.js）
- 三层记忆系统
- 自愈守护进程
- MCP 工具集成
