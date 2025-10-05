# 技术栈

**最后更新**: 2025-10-04

## 后端链 (RiverChain)

### 核心框架
| 技术 | 版本 | 用途 |
|------|------|------|
| Go | 1.21+ | 主要编程语言 |
| Cosmos SDK | 0.50+ | 区块链框架 |
| CometBFT | 0.38+ | 共识引擎 |
| Protocol Buffers | 3.x | 数据序列化 |

### 关键模块 (基于 dYdX v4)
| 模块 | 功能 | 自定义程度 |
|------|------|------------|
| x/clob | 中央限价订单簿 | 参数化 |
| x/perpetuals | 永续合约 | 参数化 |
| x/assets | 资产管理 | 扩展 (美股) |
| x/marketmap | 市场映射 | 扩展 |
| x/prices | 价格预言机 | 集成 Slinky VE |
| x/affiliates | 推荐系统 | **新增** |
| x/revshare | 分润机制 | **新增** |
| x/accountplus | 账户认证 | 参数化 |
| x/feetiers | 费率层级 | 参数化 |

### 数据层
| 技术 | 版本 | 用途 |
|------|------|------|
| PostgreSQL | 15+ | Indexer 数据库 |
| Redis | 7+ | 缓存 (可选) |

### 工具链
| 工具 | 版本 | 用途 |
|------|------|------|
| Buf | latest | Proto 管理与生成 |
| golangci-lint | 1.55+ | 代码检查 |
| go test | - | 单元测试 |

## 前端应用

### 核心框架
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.1.1 | UI 框架 |
| TypeScript | 5.8+ | 类型系统 |
| Vite | 7.1+ | 构建工具 |

### UI 与样式
| 技术 | 版本 | 用途 |
|------|------|------|
| Tailwind CSS | 4.1+ | 样式框架 |
| @tailwindcss/vite | 4.1+ | Vite 插件 |

### Web3 集成
| 技术 | 版本 | 用途 |
|------|------|------|
| ethers.js | 6.15+ | EVM 钱包 (Arbitrum) |
| @cosmjs/stargate | latest | Cosmos 链交互 |
| @cosmjs/proto-signing | latest | 交易签名 |
| @keplr-wallet/types | latest | Keplr 钱包类型 |

### 状态管理与路由
| 技术 | 版本 | 用途 |
|------|------|------|
| React Context API | - | 全局状态 |
| react-router-dom | 7.9+ | 路由管理 |

### 开发工具
| 工具 | 版本 | 用途 |
|------|------|------|
| ESLint | 9.33+ | 代码检查 |
| TypeScript ESLint | 8.39+ | TS 规则 |
| Vite Plugin React | 5.0+ | React 支持 |

## 数据服务

### Streaming
| 技术 | 用途 |
|------|------|
| WebSocket | 实时数据推送 |
| gRPC Streaming | 链端订阅 |

### Indexer
| 技术 | 用途 |
|------|------|
| PostgreSQL | 事件存储 |
| SQL (复杂查询) | 历史数据分析 |

## 外部服务

### 价格数据源
| 服务 | 用途 | 备选方案 |
|------|------|----------|
| Slinky VE | Crypto 价格 | 自建守护进程 |
| Polygon.io | 美股价格 | Alpha Vantage |

### 跨链
| 网络 | 用途 |
|------|------|
| Arbitrum Sepolia | 测试网资产桥接 |

## DevOps 与监控

### 容器化
| 技术 | 版本 | 用途 |
|------|------|------|
| Docker | 24+ | 容器化 |
| Docker Compose | 2.x | 本地编排 |

### CI/CD
| 技术 | 用途 |
|------|------|
| GitHub Actions | 自动化构建与测试 |
| Vercel | 前端部署 |

### 监控与日志
| 技术 | 用途 |
|------|------|
| Prometheus | 指标收集 |
| Grafana | 可视化 |
| OpenMetrics | 标准格式 |

## 测试工具

### 后端测试
| 工具 | 用途 |
|------|------|
| go test | 单元测试 |
| testify | 断言库 |

### 前端测试
| 工具 | 用途 |
|------|------|
| Vitest | 单元测试 |
| Playwright | E2E 测试 |
| React Testing Library | 组件测试 |

### 性能测试
| 工具 | 用途 |
|------|------|
| k6 | 负载测试 |
| Locust | 并发测试 |

## 开发环境

### 最低要求
- **操作系统**: macOS 12+, Ubuntu 22.04+, Windows 11 (WSL2)
- **CPU**: 4 核心
- **内存**: 16GB RAM
- **存储**: 50GB 可用空间

### 推荐配置
- **CPU**: 8 核心
- **内存**: 32GB RAM
- **存储**: 100GB SSD

## 包管理器

### 后端
- Go Modules (go.mod)

### 前端
- npm (package.json)
- 备选: pnpm, yarn

## 版本控制

### Git
- 主分支: `main`
- 生产分支: `prod`
- 开发分支: `dev`
- 功能分支: `feature/*`
- 修复分支: `fix/*`

## 依赖管理策略

### 后端
- 使用 Go Modules 锁定版本
- 定期更新 Cosmos SDK 安全补丁
- Fork 关键依赖以保证可控性

### 前端
- package-lock.json 锁定版本
- Renovate Bot 自动化依赖更新
- 主要依赖保持最新稳定版

## 安全依赖

### 代码扫描
- Dependabot (GitHub)
- Snyk (漏洞扫描)

### 密钥管理
- GitHub Secrets (CI/CD)
- 环境变量 (.env.local)
- **禁止**: 硬编码密钥

## 文档工具

- Markdown (技术文档)
- Mermaid (架构图)
- Swagger/OpenAPI (API 文档)
