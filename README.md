# Turtle's Home 网站改进版

对 `turtlehome.xyz` 的安全与美观改进，改进后的文件可直接替换部署到站点根目录。

---

## 一、文件说明

| 文件 | 说明 |
|---|---|
| `index.html` | 改进版首页（重写） |
| `agreement.html` | 改进版用户协议页（重写，已清理全部草稿注释） |
| `turtle_logo_transparent.png` | **新 Logo**：对原米色背景照片自动抠图后的透明版（首页默认使用） |
| `turtle_logo.png` | 原始 Logo（备份，未改动） |
| `logo.svg` | 矢量版 Logo（可选，自动适配深/浅色主题） |
| `classic1.png` / `classic2.png` | 经典图片（从线上原样下载，未改动） |
| `favicon.ico` / `favicon.svg` / `apple-touch-icon.png` | 站点图标（原站缺失，新增） |

> 直接上传 `index.html`、`agreement.html`、`favicon.ico`、`favicon.svg`、`apple-touch-icon.png`、
> `turtle_logo_transparent.png`、`classic1.png`、`classic2.png` 即可（`turtle_logo.png`、`logo.svg` 可选）。

---

## 二、首页改进点（对照原版）

### 视觉
- **Logo 修复**：原 PNG 是手机拍摄的照片（米色背景），在浅色模式下有显眼方块。
  新 `turtle_logo_transparent.png` 已抠出透明背景；另提供矢量版 `logo.svg`（跟随系统深浅色自动换绿）。
- **新增固定导航栏**：毛玻璃效果，锚点直达 关于 / 成员 / 业务 / 图片 / 联系 / 协议。
- **Hero 升级**：品牌绿光晕背景 + Logo 悬浮动画 + 滚动提示。
- **品牌色贯穿**：章节标题左侧渐变绿色装饰条、卡片 hover 上浮 + 绿色描边。
- **成员卡片**：展开/收起动画（原版 `display:none` 硬切），增加角色徽章。
- **经典图片**：改为 2 列网格（移动端 1 列堆叠），16:9 裁切，点击可全屏 Lightbox 查看。
- **联系我们**：QQ 一键复制按钮；留白缩减（110px → 88px），页面更紧凑。
- **新增**：返回顶部按钮。

### 安全（页面内可做的部分）
- 新增 `Content-Security-Policy` meta（`default-src 'self'`，限制资源只允许同源）。
- 新增 `referrer` meta（外链不再泄露完整 URL）。
- 新增 `canonical`、`theme-color`、favicon 等。

> ⚠️ 真正的安全响应头（HSTS / X-Frame-Options / CSP 服务端版等）**无法在 HTML 里设置**，
> 必须在 Cloudflare 后台配置，见下文第四节。

### SEO / 分享
- 新增 `meta description`、`keywords`、`author`。
- 新增 Open Graph / Twitter Card 标签（微信、微博等分享时显示卡片）。
- 新增 JSON-LD 结构化数据（`Organization` 类型）。
- 新增 `canonical`。

---

## 三、协议页改进点

- **清理全部开发草稿注释**（原页面源码中"基础样式：只负责能看清""↓↓↓ 把你 Word 里…粘在这里 ↓↓↓"等对外可见）。
- 继承首页设计系统：深/浅色自动适配、毛玻璃顶栏、品牌绿章节标题。
- 新增**目录导航**（十章节锚点跳转）+ **返回顶部**按钮。
- 条款层级重新排版（二级/三级条款缩进），可读性提升；**正文文字一字未改**。
- 修正原文中明显的笔误（如"本项目组项目组"、条款编号错乱），法律条款本身未做增删。

---

## 四、重要：Cloudflare 安全头配置（请务必执行）

改进版页面已内置 CSP meta，但以下头部只能在 Cloudflare 控制台配置。
进入 **Cloudflare 仪表盘 → 你的域名 → SSL/TLS → Edge Certificates**：

1. **Always Use HTTPS** → 开启（解决 HTTP 不跳转 HTTPS 的问题）
2. 在 **Security → Headers（或 Transform Rules / Page Rules 任一方式）** 添加：

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

3. 可选：**Minimum TLS Version** 设为 1.2。

---

## 五、部署后建议验证

```bash
# 安全头检查（应看到 HSTS 等）
curl -I https://你的域名

# 页面可访问性
curl -sI https://你的域名/index.html
curl -sI https://你的域名/agreement.html

# favicon
curl -sI https://你的域名/favicon.ico
```
