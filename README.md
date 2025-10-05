# RiverBit - 永续合约 DEX

<div align="center">

![RiverBit Logo](https://via.placeholder.com/150x150?text=RiverBit)

**基于 dYdX v4 的永续合约去中心化交易所**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)]()

[官网](https://riverbit.io) • [文档](https://docs.riverbit.io) • [Discord](https://discord.gg/riverbit) • [Twitter](https://twitter.com/RiverBit_DEX)

</div>

---

## 📖 项目简介

RiverBit 是一个基于 Cosmos SDK 构建的高性能永续合约 DEX，通过分叉 dYdX v4 并添加创新的推荐系统和链上治理，为用户提供：

- 🚀 **高性能交易**: 基于 Tendermint 共识，~6s 确认时间
- 💰 **推荐返佣**: 三级推荐体系 (20%/10%/5%)
- 🗳️ **链上治理**: 社区驱动的协议升级
- 🌉 **跨链桥**: 以太坊资产无缝桥接
- 📊 **实时订单簿**: WebSocket 实时数据推送

---

## ✨ 核心功能

### 交易系统
- ✅ 永续合约交易 (BTC-USDC, ETH-USDC)
- ✅ 1-20x 杠杆交易
- ✅ 市价单 + 限价单
- ✅ 实时订单簿 (20 档深度)
- ✅ 强平保护机制

### 推荐系统
- ✅ 一键生成推荐码
- ✅ URL 参数自动绑定
- ✅ 三级推荐: 20% / 10% / 5%
- ✅ 每日自动结算
- ✅ 实时收益查询

### 治理系统
- ✅ 文本提案 + 参数变更提案
- ✅ 4 种投票选项 (Yes/No/Abstain/Veto)
- ✅ 投票权重按质押量
- ✅ 7 天投票期

---

## 🛠️ 技术栈

### 前端
```
React 19 + TypeScript 5.8 + Vite 7
├── Tailwind CSS 4
├── @cosmjs/stargate (区块链交互)
├── decimal.js (精确计算)
└── React Router 7
```

### 链端
```
RiverChain (dYdX v4 Fork)
├── Cosmos SDK v0.47
├── Tendermint v0.37
└── 自定义模块:
    ├── x/affiliates (推荐)
    ├── x/revshare (分润)
    └── x/bridge (跨链桥)
```

### 基础设施
- **跨链桥**: Solidity 0.8+ (以太坊)
- **Indexer**: PostgreSQL + Node.js
- **监控**: Prometheus + Grafana

---

## 🚀 快速开始

### 前端运行

```bash
# 1. 克隆仓库
git clone https://github.com/RiverBit-dex/riverbit-app.git
cd riverbit-app

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
# http://localhost:5173
```

### 验证节点部署

```bash
# 1. 安装 Go 1.21+
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin

# 2. 编译节点
git clone https://github.com/RiverBit-dex/riverchain.git
cd riverchain
make install

# 3. 初始化节点
riverchaind init <moniker> --chain-id riverchain-1

# 4. 下载创世文件
curl -s https://raw.githubusercontent.com/RiverBit-dex/riverchain/main/genesis.json \
  > ~/.riverchain/config/genesis.json

# 5. 启动节点
riverchaind start
```

详细部署文档: [docs/deployment/mainnet-deployment.md](docs/deployment/mainnet-deployment.md)

---

## 📁 项目结构

```
riverbit-demo-main/
├── src/
│   ├── components/          # React 组件
│   │   ├── trading/         # 订单簿、订单表单、持仓
│   │   ├── referral/        # 推荐系统组件
│   │   └── governance/      # 治理组件
│   ├── hooks/               # 自定义 Hook (16 个)
│   ├── contexts/            # React Context (钱包连接)
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   └── pages/               # 页面组件
├── docs/
│   ├── stories/             # 16 个 Story PRD
│   ├── implementation/      # 实现文档
│   └── deployment/          # 部署文档
├── dist/                    # 生产构建
└── package.json
```

---

## 📊 项目统计

| 指标 | 数值 |
|------|------|
| **Stories 完成** | 16/16 (100%) |
| **前端代码** | ~2,525 行 |
| **文档** | ~4,100 行 |
| **组件数** | 32 个 |
| **自定义 Hook** | 16 个 |
| **构建产物** | 3.58 MB (未压缩) / 858 KB (gzip) |

---

## 🏗️ 开发进度

### Epic 1: 基础设施 ✅ (6/6)
- [x] RiverChain 核心模块
- [x] 跨链桥智能合约
- [x] 链端业务参数
- [x] Indexer 服务
- [x] RPC & Streaming
- [x] 前端钱包连接

### Epic 2: 核心交易 ✅ (3/3)
- [x] 订单簿 UI
- [x] 下单与撤单
- [x] 持仓管理

### Epic 3: 推荐系统 ✅ (4/4)
- [x] 推荐码生成与绑定
- [x] 分润计算与结算
- [x] 推荐页 UI
- [x] 收益提取

### Epic 4: 治理与主网 ✅ (3/3)
- [x] 治理提案系统
- [x] 投票机制
- [x] 主网部署准备

---

## 🔐 安全审计

- ✅ 智能合约安全 (ReentrancyGuard, Access Control)
- ✅ 链端代码审计 (循环推荐检测, 精度计算)
- ✅ 密钥管理 (多签钱包 2/3)
- ✅ 网络安全 (DDoS 防护, SSL/TLS)
- ✅ 数据安全 (每日备份, 异地存储)

详细清单: [docs/deployment/security-checklist.md](docs/deployment/security-checklist.md)

---

## 📚 文档

- [项目总结报告](PROJECT_SUMMARY.md)
- [主网部署指南](docs/deployment/mainnet-deployment.md)
- [安全审计清单](docs/deployment/security-checklist.md)
- [应急预案](docs/deployment/emergency-plan.md)
- [Story PRD](docs/stories/)
- [实现文档](docs/implementation/)

---

## 🚀 部署

### 生产环境

- **URL**: https://riverbit.io
- **触发方式**: 合并到 `prod` 分支自动部署 (Vercel)
- **前置条件**: Vercel 访问权限

### 本地预览

```bash
npm run build
npm run preview
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 遵循 SOLID, KISS, DRY, YAGNI 原则
- TypeScript 严格模式
- Prettier 格式化
- ESLint 检查

---

## 🐛 Bug 报告

发现 Bug? 请[创建 Issue](https://github.com/RiverBit-dex/riverbit-app/issues)

**Bug 报告模板:**
```markdown
**描述**: 简要描述 Bug
**复现步骤**:
1. 步骤 1
2. 步骤 2
**期望行为**: 应该发生什么
**实际行为**: 实际发生了什么
**环境**: 浏览器/操作系统版本
**截图**: (可选)
```

---

## 📅 路线图

### v1.0 (已完成 ✅)
- [x] 核心交易功能
- [x] 推荐系统
- [x] 治理系统
- [x] 跨链桥
- [x] 部署文档

### v1.1 (计划中 🚧)
- [ ] Indexer API 集成
- [ ] 交易图表 (TradingView)
- [ ] 移动端优化
- [ ] 多语言支持

### v2.0 (规划中 📋)
- [ ] 止盈止损订单
- [ ] API 交易
- [ ] 机器人支持
- [ ] 高级分析工具

---

## 📞 联系我们

- **官网**: https://riverbit.io
- **Discord**: https://discord.gg/riverbit
- **Telegram**: https://t.me/riverbit
- **Twitter**: https://twitter.com/RiverBit_DEX
- **Email**: hello@riverbit.io

### 紧急联系
- **技术支持**: tech@riverbit.io
- **安全团队**: security@riverbit.io

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议

---

## 🙏 致谢

- [dYdX](https://dydx.exchange/) - 开源代码库
- [Cosmos SDK](https://cosmos.network/) - 区块链框架
- [React](https://react.dev/) - 前端框架
- [Vite](https://vite.dev/) - 构建工具

---

<div align="center">

**⭐ 如果觉得有帮助，请给个 Star!**

Made with ❤️ by RiverBit Team

</div>
