# FoLocal

### 本地优先、无需账号的 RSS 桌面阅读器

FoLocal 把订阅、文章、阅读状态、收藏和 AI 配置都留在你的电脑上。它是一款独立维护的
macOS 桌面应用：打开即可使用，不需要注册，不依赖远程业务后端，也不会把阅读数据同步到
某个默认云服务。

[下载最新版](https://github.com/Guyungy/FoLocal/releases) ·
[查看提交](https://github.com/Guyungy/FoLocal/commits/dev) ·
[维护说明](docs/fork-maintenance.md)

> [!NOTE]
> FoLocal 是基于 [RSSNext/Folo](https://github.com/RSSNext/Folo) 开发的社区分支版本，
> 现作为独立项目维护。它不是 RSSNext 或 Folo 官方发行版，也未获得其背书。

## 为什么选择 FoLocal

| 能力 | 说明 |
| --- | --- |
| 完全本地 | Electron 内嵌本地 API，SQLite 保存订阅、文章、已读、收藏、摘要和设置 |
| 无需账号 | 移除注册、登录、退出和会话 Cookie，安装后直接使用 |
| RSSHub 原生支持 | 支持普通 RSS/Atom 与 `rsshub://`，实例异常时自动切换并记录健康状态 |
| 本地 AI 接口 | 支持 OpenAI-compatible 地址、端口、模型发现和连接测试；兼容 Ollama、LM Studio 等免 Key 服务 |
| 数据可迁移 | 支持 Follow/Folo 数据库导入、OPML 导入导出、完整备份与恢复 |
| 长文阅读优化 | 过滤过短内容、净化列表摘要、改善正文抽取和摘要回退 |

## 核心功能

### 阅读与订阅

- 添加 RSS、Atom、非标准 Feed 页面及 `rsshub://` 路由。
- RSSHub 实例池支持探活、延迟统计、故障转移、暂停和恢复默认配置。
- 后台刷新采用限流队列与退避重试；断网恢复后自动继续，不会反复轰击订阅源。
- 记录最近刷新批次、失败分类、最近成功时间和单个订阅重试状态。
- 文章列表不显示原始 HTML 标签，并优先保留适合长文阅读的内容。

### AI 能力

在“设置 → OpenAI 接口”中填写兼容服务地址，例如：

```text
https://api.openai.com/v1
http://127.0.0.1:11434/v1
http://127.0.0.1:1234/v1
```

FoLocal 可以从 `/models` 获取模型，并统一用于：

- AI 摘要与标题生成
- 文章翻译
- AI 对话
- 语音合成
- 音频转写

API Key 仅保存在本机应用数据目录中；本地兼容服务可留空。启用 AI 后，相关内容会发送到
你主动配置的服务，请自行确认其隐私政策和费用。

### 数据与恢复

- macOS 默认数据目录：`~/Library/Application Support/FoLocal/`
- 数据库文件：`local-api.db`
- AI 配置：`openai.json`
- 支持 OPML 导入与导出。
- 支持完整配置备份、完整性校验、升级前快照和恢复失败回滚。
- 与官方 Folo 使用独立的应用标识、URL 协议和数据目录，可同时安装。

## 下载与安装

目前发布 **macOS Apple Silicon（arm64）** 构建，可从
[GitHub Releases](https://github.com/Guyungy/FoLocal/releases) 下载 DMG 或 ZIP。

当前安装包使用 ad-hoc 签名，尚未经过 Apple 公证。如果首次启动被 Gatekeeper 拦截，请在
“系统设置 → 隐私与安全性”中确认打开，或右键应用选择“打开”。建议核对发布页提供的
SHA-256 校验值。

## 使用 pnpm 开发

项目使用 **pnpm workspace** 与 Turbo。请勿使用 npm 安装依赖。

```bash
# 安装依赖
pnpm install --frozen-lockfile

# 浏览器模式
pnpm --dir apps/desktop run dev:web

# 完整 Electron 桌面版
pnpm --dir apps/desktop run dev:electron

# 类型检查、格式与测试
pnpm run typecheck
pnpm run format:check
pnpm run test

# 构建并打包桌面应用
pnpm --dir apps/desktop run build:electron-vite
pnpm --dir apps/desktop exec electron-forge package --platform=darwin --arch=arm64
```

导入已有数据库：

```bash
DATABASE_PATH="/path/to/local-api.db" \
  pnpm --dir apps/server import:follow-db -- "/path/to/follow.db"
```

导入或恢复前请退出 FoLocal，并保留原始数据副本。

## 项目结构

- `apps/server`：本地 API、SQLite、RSS/RSSHub、AI、刷新队列及导入导出。
- `apps/desktop/layer/main`：Electron 主进程、本地服务、代理和备份恢复。
- `apps/desktop/layer/renderer`：阅读界面、本地设置、AI 设置和运行状态。
- `packages/internal`：共享组件、状态、数据库、模型与工具。

## 来源与致谢

FoLocal 是 [RSSNext/Folo](https://github.com/RSSNext/Folo) 的社区分支版本，现作为独立的
本地优先项目维护。感谢上游项目作者及所有贡献者。

“Folo”名称和原项目美术资源归其各自权利人所有。为遵守上游附加条款，FoLocal 桌面构建
不再分发上游 `icons/mgc` 中受限制的资源；界面优先使用 Apache-2.0 许可的 MingCute 图标及
其他依赖各自许可的资源。

## 许可证

FoLocal 依据 [GNU AGPL-3.0](LICENSE) 发布，附加说明见 [NOTICE.md](NOTICE.md)。每个发布包
对应的完整源码可通过同名 Release 标签获取。

本软件按“原样”提供，不附带任何明示或默示担保。数据迁移、第三方 RSS/RSSHub 服务和
用户配置的 AI 服务所产生的风险与费用由使用者自行承担。
