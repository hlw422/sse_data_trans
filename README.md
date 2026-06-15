# SSE 实时通信演示

一个完整的 Server-Sent Events (SSE) 演示应用，展示实时消息推送、连接管理、多事件类型和双向通信功能。

## 功能特性

- **实时消息推送** - 服务器每5秒自动推送模拟消息
- **多事件类型** - 支持通知(notification)、更新(update)、告警(alert)三种类型
- **连接状态管理** - 实时显示连接状态（连接中、已连接、已断开）
- **自动重连** - 连接断开后自动重连（指数退避算法）
- **双向通信** - 客户端可发送消息并广播给所有连接的客户端
- **消息历史** - 本地存储最近100条消息，支持清空

## 技术栈

### 后端
- Node.js
- TypeScript
- 原生 HTTP 模块

### 前端
- React 18
- TypeScript
- Vite

## 项目结构

```
sse/
├── server/
│   ├── src/
│   │   ├── index.ts          # 服务器入口
│   │   ├── sse.ts            # SSE 处理逻辑
│   │   └── types.ts          # 类型定义
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── App.tsx           # 主应用组件
│   │   ├── main.tsx          # 入口文件
│   │   ├── types.ts          # 类型定义
│   │   ├── components/
│   │   │   ├── ConnectionStatus.tsx  # 连接状态组件
│   │   │   ├── MessageList.tsx       # 消息列表组件
│   │   │   └── SendForm.tsx          # 发送表单组件
│   │   └── hooks/
│   │       └── useSSE.ts            # SSE 连接 Hook
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
└── package.json
```

## 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/hlw422/sse_data_trans.git
cd sse_data_trans

# 安装根目录依赖
npm install

# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 启动服务

```bash
# 回到项目根目录
cd ..

# 同时启动前后端
npm run dev

# 或者分别启动
npm run dev:server  # 启动后端 (端口 13001)
npm run dev:client  # 启动前端 (端口 3000)
```

### 访问应用

打开浏览器访问 http://localhost:3000

## API 文档

### GET /events

SSE 端点，建立服务器推送连接。

**响应格式：**
```
event: notification
data: {"id":"1","type":"notification","message":"新用户注册","timestamp":"2026-06-15T10:00:00.000Z"}

event: update
data: {"id":"2","type":"update","message":"数据已更新: 股票价格 +2.5%","timestamp":"2026-06-15T10:00:05.000Z"}

event: alert
data: {"id":"3","type":"alert","message":"系统负载过高: CPU 85%","timestamp":"2026-06-15T10:00:10.000Z"}
```

### POST /send

客户端发送消息端点。

**请求体：**
```json
{
  "type": "notification|update|alert",
  "message": "消息内容"
}
```

**响应：**
```json
{
  "success": true,
  "message": "Message sent"
}
```

## 自动推送消息

服务器每5秒自动推送以下模拟消息：

| 顺序 | 类型 | 消息内容 |
|------|------|----------|
| 1 | notification | 新用户注册 |
| 2 | update | 数据已更新: 股票价格 +2.5% |
| 3 | alert | 系统负载过高: CPU 85% |
| 4 | notification | 收到新订单 #1234 |
| 5 | update | 库存变更: 商品A -10 |
| 6 | alert | 磁盘空间不足: 剩余5% |

## 开发脚本

```bash
# 开发模式（同时启动前后端）
npm run dev

# 仅启动后端
npm run dev:server

# 仅启动前端
npm run dev:client

# 构建前端
cd client && npm run build

# 类型检查
cd server && npx tsc --noEmit
cd client && npx tsc --noEmit
```

## 浏览器兼容性

SSE (EventSource) 支持所有现代浏览器：

- Chrome 9+
- Firefox 6+
- Safari 5+
- Edge 79+

## 许可证

MIT

## 作者

hlw42
