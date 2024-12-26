# AI Spark - AI生成内容管理工具

## 项目概述

AI Spark 是一款基于 Web 技术开发的桌面应用，用于管理和组织 AI 生成的图片和视频内容。本项目使用 Next.js 作为主要框架，结合 TailwindCSS 实现现代化的用户界面，使用 SQLite 和 Prisma 进行本地数据管理。

### 主要功能
- 媒体文件（图片/视频）的存储和管理
- Prompt 文本关联和管理
- 标签系统
- 搜索和过滤功能
- 本地数据存储

## 技术栈

- **前端框架**: Next.js
- **样式框架**: TailwindCSS
- **数据库**: SQLite
- **ORM**: Prisma
- **类型检查**: TypeScript
- **包管理器**: npm/yarn

## 系统要求

- Node.js 18.0 或更高版本
- npm 8.0 或更高版本
- MacOS 12.0 或更高版本

## 项目结构
app/
├── components/ # 组件目录
│ ├── layout/ # 布局相关组件
│ │ ├── BaseLayout.tsx # 基础布局组件
│ │ ├── Header.tsx # 顶部导航组件
│ │ └── Sidebar.tsx # 侧边栏组件
│ ├── common/ # 通用组件
│ │ ├── Button.tsx # 按钮组件
│ │ └── Input.tsx # 输入框组件
│ └── features/ # 功能相关组件
│ ├── media/ # 媒体相关组件
│ │ ├── MediaGrid.tsx # 媒体网格组件
│ │ └── MediaCard.tsx # 媒体卡片组件
│ └── search/ # 搜索相关组件
│ └── SearchBar.tsx # 搜索栏组件
├── lib/ # 工具函数目录
│ ├── prisma.ts # Prisma 客户端配置
│ └── db.ts # 数据库操作函数
├── types/ # 类型定义目录
│ └── index.ts # 全局类型定义
└── prisma/ # Prisma 配置目录
├── schema.prisma # 数据库模型定义
└── seed.ts # 测试数据脚本


## 数据模型

### Media 模型
prisma
model Media {
id Int @id @default(autoincrement())
fileName String
filePath String
type String // 'image' or 'video'
prompt String
aiTool String
createdAt DateTime @default(now())
tags Tag[]
}


### Tag 模型
prisma
model Tag {
id Int @id @default(autoincrement())
name String @unique
medias Media[]
}


## 核心功能实现

### 1. 文件管理
- 使用 Next.js API routes 处理文件上传
- 文件存储在本地文件系统
- 文件元数据存储在 SQLite 数据库

### 2. 媒体展示
- 响应式网格布局
- 图片/视频预览
- 标签展示
- Prompt 显示

### 3. 搜索和过滤
- 基于标签搜索
- Prompt 文本搜索
- AI 工具筛选
- 文件类型过滤

## 开发计划

### Phase 1: 环境初始化 (1-2天)
#### 1.1 项目基础搭建
- 使用 create-next-app 创建项目
- 配置 TailwindCSS
- 安装必要依赖 (@prisma/client, sqlite3 等)

#### 1.2 开发环境配置
- Prisma 初始化
- TypeScript 配置
- ESLint 和 Prettier 设置
- 开发工具配置

### Phase 2: 数据库设计与初始化 (1-2天)
#### 2.1 数据库模型设计
- 完善 Media 和 Tag 模型
- 建立模型关联关系
- 设计数据库索引

#### 2.2 数据库初始化
- 创建迁移文件
- 初始化数据库
- 添加测试数据

### Phase 3: 界面框架搭建 (2-3天)
#### 3.1 基础布局
- 创建主布局组件
- 实现响应式导航
- 设计基础样式系统

#### 3.2 路由系统
- 配置页面路由
- 实现导航逻辑
- 设置页面转场

### Phase 4: 核心功能开发 (7-10天)
#### 4.1 媒体管理模块 (2-3天)
- 文件上传功能
- 媒体文件预览
- 文件详情页面
- 文件删除功能

#### 4.2 Prompt管理 (1-2天)
- Prompt输入界面
- Prompt与媒体关联
- Prompt编辑功能

#### 4.3 标签系统 (2-3天)
- 标签 CRUD 操作
- 标签关联管理
- 标签展示组件

#### 4.4 搜索和过滤 (2天)
- 搜索功能实现
- 过滤器开发
- 结果展示优化

### Phase 5: 优化与测试 (3-4天)
#### 5.1 性能优化
- 图片加载优化
- 数据库查询优化
- 页面渲染优化

#### 5.2 用户体验
- 加载状态处理
- 错误处理
- 交互反馈

#### 5.3 测试与部署
- 功能测试
- 兼容性测试
- 部署流程优化

## 开发规范

### 代码规范
- 使用 TypeScript 强类型
- 遵循 ESLint 规则
- 保持组件粒度适中
- 添加必要的代码注释

### 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试相关
- chore: 构建/工具

### 开发建议
1. 遵循模块化开发,确保代码可复用
2. 定期与用户沟通,及时调整方向
3. 保持文档更新
4. 注重代码质量和性能优化
5. 做好版本控制和分支管理

预计总工期：14-21天

