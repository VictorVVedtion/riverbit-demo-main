# RiverBit dYdX v4 套壳项目 PRD

**版本**: v4
**状态**: Active
**最后更新**: 2025-10-04

## 项目概述

RiverBit 是一个基于 dYdX v4 技术栈的去中心化衍生品交易平台,提供加密永续合约和代币化美股交易。本项目通过 fork dYdX v4-chain 并集成 RiverBit 自研 UI 组件,实现一个完整的交易解决方案。

## 核心目标

### 阶段一:测试版本 1.0 (4 周)
- **前端**: dYdX v4-web → RiverBit UI 组件替换
- **后端**: dYdX v4-chain 私有化部署与参数化配置
- **跨链**: Arbitrum 测试网最小适配器
- **业务**: 推荐系统与分润机制

## Epic 列表

### Epic 1: 基础设施与链端启动 (Week 1)
**目标**: 完成链身份配置、Proto 生成、前端骨架搭建

详见: [epic-1-infrastructure-setup.md](./epic-1-infrastructure-setup.md)

### Epic 2: 单市场交易闭环 (Week 2)
**目标**: USDC 市场初始化、Streaming 数据流、订单簿与交易功能

详见: [epic-2-single-market-trading.md](./epic-2-single-market-trading.md)

### Epic 3: 美股市场与风控 (Week 3)
**目标**: 代币化美股市场、风控参数、推荐页业务流

详见: [epic-3-stock-market-risk.md](./epic-3-stock-market-risk.md)

### Epic 4: 稳定性与文档 (Week 4)
**目标**: 端到端测试、监控告警、技术文档

详见: [epic-4-stability-docs.md](./epic-4-stability-docs.md)

## 技术栈

### 后端链
- dYdX v4-chain (Fork)
- Cosmos SDK 0.50+
- CometBFT 0.38+
- Go 1.21+
- PostgreSQL 15+ (Indexer)

### 前端
- React 19 + Vite 7
- TypeScript 5.8
- Tailwind CSS 4
- ethers.js 6.x
- @riverbit/riverchain-client-js

### 基础设施
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Prometheus + Grafana
- Vercel (前端部署)

## 参考资料

- Demo 仓库: https://github.com/RiverBit-dex/riverbit-demo
- 官网: https://riverbit.io
- PRD 文档: https://docs.google.com/document/d/1x9IEDiYbxHp5qFPW0P6Npw6sbvybK0Laxbu357l_6oc
