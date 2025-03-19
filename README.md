# PromptGenius - 提示词管理应用

## 简介
PromptGenius 是一个基于 Next.js 构建的提示词管理应用，它允许用户创建、编辑和管理提示词，同时支持标签分类和版本控制。该项目使用 Supabase 作为后端数据库，提供了用户认证和数据存储功能。

## 技术栈
- **前端框架**：Next.js
- **状态管理**：React Hooks
- **数据库**：Supabase
- **用户认证**：Clerk
- **表单组件**：react-select

## 功能特性
- **提示词管理**：用户可以创建、编辑和删除提示词。
- **标签分类**：支持为提示词添加标签，方便分类和搜索。
- **版本控制**：当提示词内容发生变化时，自动创建新版本。
- **搜索和过滤**：支持按关键词和标签搜索提示词。
- **平台配置和跳转**：支持配置不同大模型平台并快速跳转提问。

## 项目结构
```
PromptGenius/
├── app/
│   ├── api/
│   │   ├── composite.js
│   │   ├── prompts/
│   │   │   └── index.js
│   │   └── versions/
│   │       └── index.js
│   ├── prompts/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.js
│   │   └── page.js
│   └── _components/
│       └── loading.js
├── package-lock.json
└── README.md
```

## 安装与运行
### 克隆仓库
```bash
git clone https://github.com/your-repo/PromptGenius.git
cd PromptGenius
```

### 安装依赖
```bash
npm install
# 或者使用其他包管理器
yarn install
pnpm install
bun install
```

### 配置环境变量
在项目根目录下创建 `.env.local` 文件，并配置以下环境变量：
```plaintext
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 启动开发服务器
```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
# 或者
bun dev
```

### 访问应用
打开浏览器，访问 [http://localhost:3000](http://localhost:3000) 即可看到应用界面。

## 部署
该项目可以很方便地部署到 Vercel 平台。你可以按照以下步骤进行部署：
1. 登录 [Vercel](https://vercel.com) 账号。
2. 点击 “New Project”，选择从 GitHub 导入项目。
3. 配置环境变量，确保 `.env.local` 中的变量在 Vercel 中正确设置。
4. 点击 “Deploy” 开始部署。

详细的部署文档可以参考 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。

## 学习资源
如果你想了解更多关于 Next.js 的知识，可以参考以下资源：
- [Next.js 文档](https://nextjs.org/docs)：学习 Next.js 的特性和 API。
- [学习 Next.js](https://nextjs.org/learn)：一个交互式的 Next.js 教程。
- [Next.js GitHub 仓库](https://github.com/vercel/next.js)：欢迎提供反馈和贡献代码。

## 贡献
如果你想为该项目做出贡献，请遵循以下步骤：
1. Fork 该仓库。
2. 创建一个新的分支：`git checkout -b feature/your-feature`。
3. 提交你的更改：`git commit -m "Add your feature"`。
4. 推送至远程分支：`git push origin feature/your-feature`。
5. 创建一个 Pull Request。

## 许可证
该项目采用 [MIT 许可证](https://opensource.org/licenses/MIT)。
