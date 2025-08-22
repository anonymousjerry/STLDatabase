# 抓取任务管理系统

这是一个简化的抓取任务管理系统，允许管理员设置平台、数量、开始时间、结束时间和开关状态。

## 功能特性

- **简化的任务配置**: 只需要设置平台、数量、开始时间、结束时间和开关状态
- **自动调度**: 系统会根据设定的时间自动执行抓取任务
- **多平台支持**: 支持 Printables、Thangs 等平台
- **实时状态监控**: 可以查看任务的运行状态和历史记录
- **开关控制**: 可以随时开启或关闭抓取任务

## 系统架构

### 前端 (Admin Panel)
- **Sanity CMS**: 管理抓取任务配置
- **React 组件**: 提供用户界面
- **实时更新**: 任务状态实时同步

### 后端 (Node.js)
- **Express API**: 提供 RESTful API
- **调度器**: 自动检查和执行任务
- **Python 脚本**: 执行实际的抓取操作

## 使用方法

### 1. 创建抓取任务

在 Sanity Admin Panel 中：

1. 进入 "Scraping Job Management" 页面
2. 点击 "Create New Scrape Job"
3. 填写以下信息：
   - **Platform**: 选择平台 (Printables, Thangs, 等)
   - **Count**: 设置要抓取的模型数量
   - **Start Time**: 设置开始时间 (24小时格式)
   - **End Time**: 设置结束时间 (24小时格式)
   - **Active**: 开启/关闭任务

### 2. 管理任务

- **编辑任务**: 点击 "Edit" 按钮修改任务配置
- **删除任务**: 点击 "Delete" 按钮删除任务
- **开关控制**: 点击 "ON/OFF" 按钮控制任务状态
- **查看状态**: 在表格中查看任务运行状态和历史记录

### 3. 监控任务

系统会自动：
- 检查哪些任务需要在当前时间运行
- 执行符合条件的任务
- 更新任务状态和统计信息
- 记录运行历史和错误信息

## API 端点

### 获取所有任务
```
GET /api/scraping/jobs
```

### 获取活跃任务
```
GET /api/scraping/jobs/active
```

### 获取需要运行的任务
```
GET /api/scraping/jobs/to-run
```

### 启动任务
```
POST /api/scraping/jobs/:jobId/start
```

### 停止任务
```
POST /api/scraping/jobs/:jobId/stop
```

### 更新任务
```
PUT /api/scraping/jobs/:jobId
```

### 删除任务
```
DELETE /api/scraping/jobs/:jobId
```

### 执行计划任务
```
POST /api/scraping/execute-scheduled
```

## 任务状态

- **idle**: 空闲状态
- **running**: 正在运行
- **completed**: 已完成
- **failed**: 执行失败

## 配置说明

### 时间格式
- 使用 24 小时格式 (HH:MM)
- 例如: 09:00, 17:00

### 平台支持
- **Printables**: printables.com
- **Thangs**: thangs.com
- **Thingiverse**: thingiverse.com
- **CGTrader**: cgtrader.com
- **Makerworld**: makerworld.com
- **Pinshape**: pinshape.com

### 数量限制
- 最小: 1 个模型
- 最大: 1000 个模型
- 默认: 10 个模型

## 调度器

系统包含一个自动调度器，会：
- 每分钟检查一次需要运行的任务
- 自动执行在指定时间范围内的任务
- 更新任务状态和统计信息
- 处理错误和异常情况

## 文件结构

```
backend/
├── src/
│   ├── routes/
│   │   └── scrapingRoutes.js      # 抓取任务 API 路由
│   ├── services/
│   │   └── scrapingService.js     # 抓取服务
│   └── utils/
│       └── scheduler.js           # 调度器
├── crawler/
│   ├── printables/
│   │   └── printables.py          # Printables 抓取脚本
│   └── thangs/
│       └── thangs.py              # Thangs 抓取脚本
└── index.js                       # 主服务器文件

admin/
├── sanity/
│   └── schemaTypes/
│       └── scrapeJob.ts           # 抓取任务 Schema
├── components/
│   └── scrapeJobTable.tsx         # 抓取任务管理界面
└── lib/
    └── scrapeJobApi.ts            # 前端 API 函数
```

## 部署说明

1. **安装依赖**
   ```bash
   # 后端
   cd backend
   npm install
   
   # 前端
   cd admin
   npm install
   ```

2. **配置环境变量**
   ```env
   SANITY_PROJECT_ID=your-project-id
   SANITY_DATASET=production
   SANITY_API_TOKEN=your-api-token
   PORT=5000
   ```

3. **启动服务**
   ```bash
   # 启动后端
   cd backend
   npm start
   
   # 启动前端
   cd admin
   npm run dev
   ```

## 注意事项

- 确保 Python 环境和必要的依赖已安装
- 抓取脚本需要 Playwright 支持
- 建议在生产环境中使用 headless 模式
- 注意遵守目标网站的 robots.txt 和使用条款
- 合理设置抓取间隔，避免对目标服务器造成过大压力

## 故障排除

### 常见问题

1. **任务不执行**
   - 检查任务是否设置为 "Active"
   - 确认当前时间在设定的时间范围内
   - 查看调度器日志

2. **抓取失败**
   - 检查网络连接
   - 确认目标网站可访问
   - 查看错误日志

3. **Python 脚本错误**
   - 确认 Python 环境正确
   - 检查 Playwright 是否安装
   - 验证脚本路径正确

### 日志查看

- 后端日志: 查看控制台输出
- 调度器日志: 查看调度器状态
- 抓取日志: 查看 Python 脚本输出
