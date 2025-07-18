# 艺术家个人作品集网站（Her Gallery）

## 项目简介

本项目是一个为艺术家量身定制的个人作品集网站，支持作品展示、艺术理念、创作手记、足迹地图、展览经历及联系方式等多模块内容。前端采用现代响应式设计，后端提供数据管理与图片上传接口，适合自我展示与对外合作。

## 功能特性

- 作品集动态展示（含大图灯箱、详情介绍）
- 艺术理念、创作手记、展览经历等内容模块
- 支持后台数据管理与图片上传（需管理员密码）
- 响应式设计，适配桌面与移动端
- 视频背景、滚动动画、模态弹窗等丰富交互
- 数据存储于本地 JSON 文件，便于迁移与备份

## 技术栈

- **前端**：HTML5、Tailwind CSS、原生 JavaScript
- **后端**：Node.js、Express、Multer（图片上传）、CORS、Body-Parser
- **数据存储**：本地 JSON 文件（`db.json`）

## 目录结构

```
her_gallery/
├── frontend/
│   ├── index.html         # 主站页面
│   ├── admin.html         # 管理后台页面（如有）
│   └── videos/            # 视频资源
├── backend/
│   ├── server.js          # Express 后端服务
│   ├── db.json            # 站点数据与作品信息
│   ├── package.json       # 后端依赖与脚本
│   └── node_modules/      # 依赖库
└── README.md
```

## 快速开始

### 1. 安装依赖

进入 `backend` 目录，安装 Node.js 依赖：

```bash
cd backend
npm install
```

### 2. 启动后端服务

```bash
npm start
```

默认服务运行在 [http://localhost:3020](http://localhost:3020)

### 3. 启动前端

直接用浏览器打开 `frontend/index.html` 即可访问前台页面。建议使用本地服务器（如 VSCode Live Server 插件）以避免跨域问题。

### 4. 管理后台

如有 `admin.html`，可用于后台数据管理与图片上传，需在请求头中携带管理员密码（默认 `artist/123456`，请及时修改）。

## API 说明

- `GET /api/data`  
  获取站点所有公开数据（作品、理念、手记等）

- `GET /api/admin/data`  
  管理员获取全部数据（需认证）

- `POST /api/admin/update`  
  管理员更新全部数据（需认证，body 为完整 JSON）

- `POST /api/admin/upload`  
  管理员上传图片（需认证，form-data: `image` 字段）

> 认证方式：请求头需携带 `x-admin-password`，值为管理员密码

## 数据结构说明（`db.json`）

- `site_data`：站点基础信息（艺术家名、理念、地图、联系方式、展览等）
- `projects`：作品数组，每个作品包含 id、地点、标题、简介、详细描述、图片、排列顺序
- `journal`：创作手记图片数组

## 部署建议

- 可将前端静态文件部署至任意静态服务器（如 GitHub Pages、Vercel、Netlify）
- 后端可部署至支持 Node.js 的服务器（如 Heroku、Vercel、云服务器等）
- 注意保护管理员密码，生产环境请务必修改默认密码

## 致谢

感谢所有开源库的支持。Tailwind CSS、Express、Multer 等。
