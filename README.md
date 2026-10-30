# Turtle’s Home · 归家项目组

Turtle’s Home 项目组网站：纯 HTML / CSS / JavaScript，无 npm 依赖、后端、第三方字体、跟踪脚本或付费 API。视觉参考 openai.com 的留白与编辑式布局，使用项目组原有 Logo、用户提供的文章截图和自制文字动效；未复制 OpenAI 的文章或品牌素材。

## 本地开发

需要 Python 3。使用现有仓库即可，不需要新 worktree。

```sh
python3 -m http.server 8000
```

首页为 `index.html`，文章在 `journal/`，用户协议为 `agreement.html`。Python 服务通过带 `.html` 的路径访问页面。`assets/site.css` 和 `assets/site.js` 是共享样式与交互。

## Cloudflare Pages Free 部署

使用 Cloudflare Pages 的 Git 集成连接此 GitHub 仓库，配置：

| 设置            | 值                         |
| --------------- | -------------------------- |
| 生产分支        | `main`                     |
| 框架预设        | None                       |
| 根目录          | 仓库根目录                 |
| 构建命令        | `python3 scripts/build.py` |
| 构建输出目录    | `dist`                     |
| 环境变量 / 密钥 | 无                         |

Pages 接收的是静态文件，不调用 Functions、Workers 或数据库，不依赖付费功能。免费计划仍受 Cloudflare 当前的构建及托管配额约束。`_headers` 和 `_redirects` 会随构建复制，设置 CSP 等响应头；不依赖 Python 服务器在生产中运行。

在 Pages 的「自定义域」中绑定你拥有的 `turtlehome.com`，按控制台提示配置 DNS。原始仓库曾使用 `turtlehome.xyz`；本次没有更改 DNS，也不假定这两个域名属于同一部署。本站使用相对站内 URL，支持 Pages 分配域名及自定义域。域名确认前不硬编码 canonical URL，避免错误的搜索引擎归属。绑定完成后可统一添加 canonical、sitemap 和 robots 的站点域名。

Pages 会将 `.html` 地址规范化为无扩展名路径，并自动提供 `404.html`；根目录含自定义 404，因此不会以 SPA 首页吞掉不存在的 URL。

手动上传时，先运行构建命令，再上传 **dist 文件夹中的内容**；不要上传整个 Git 仓库。

## 验证

```sh
python3 scripts/check_site.py
python3 scripts/build.py
```

静态检查覆盖本地链接、图片、锚点、文章元数据和 JavaScript 语法（如安装了 Node.js）。浏览器需额外验证移动菜单、文字交互、图片查看器、成员展开、阅读进度与系统减少动态效果偏好。

## 内容与维护

- 项目组文章为王波《握紧宣传之“粮”，步调一致向前进》，据用户提供截图整理；分节小标题为网页阅读所加，原文无日期，未补写缺失脚注。
- 原先三篇 AI 撰写的随笔已删除，旧 URL 通过 `_redirects` 指向项目组文章或阅读区。
- 推荐阅读仅提供书目信息、本站导引和原作者/出版方链接，注明“仅为引用，仅供科学研究”，不转载全文。
- 《Attention Is All You Need》中文版待用户提供后再处理，本版未加入。
- 本轮提及的文章附件尚未收到，不将未见内容伪装为已发布原文。
- 项目近况保留 Minecraft 云服务暂停事实，未添加恢复承诺。
- `agreement.html` 沿用原协议正文与制定日期，仅更新页面外观。
- 文字与光标动画可暂停；系统开启减少动态效果时自动停用。
- 联系方式未公开，入口指向真实 GitHub 仓库。
- 站点不处理账号、表单、支付或用户数据。

GitHub 推送只代表代码发布；线上自动更新取决于 Pages 是否已连接仓库及构建是否成功。

## 当前 Workers 静态资产部署

已使用 Workers 部署的项目可以继续使用现有入口，无需迁移到 Pages。

- 构建命令：`python3 scripts/build.py`
- 生产部署命令：`npx wrangler deploy --assets ./dist --name turtlehome-website --compatibility-date 2026-10-23`
- 预览命令：`npx wrangler versions upload --assets ./dist --name turtlehome-website --compatibility-date 2026-10-23`
- 根目录：仓库根目录。仍不需要任何密钥或运行时后端。

新建项目时 Worker 名称应与命令中的 `--name` 一致。现有项目直接在“设置 → 构建”编辑，不要重新创建同名项目。

`wrangler.jsonc` 固定现有 Worker 名称、兼容日期、静态目录和自定义 404 行为，避免每次依赖控制台参数。仓库仍无应用运行时依赖，Wrangler 只用于部署。
