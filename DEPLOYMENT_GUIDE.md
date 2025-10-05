# RiverBit v1.0 部署指南

## 📋 部署前检查

✅ **已完成:**
- [x] Git 仓库已初始化
- [x] 代码已完成初始提交 (324 文件, 67,065 行)
- [x] 生产构建已验证 (3.58 MB / 858 KB gzip)
- [x] 开发服务器测试通过

⏳ **待完成:**
- [ ] 推送代码到 GitHub
- [ ] 配置 Vercel 部署
- [ ] 设置环境变量
- [ ] 配置自定义域名

---

## 🚀 步骤 1: 推送到 GitHub

### 1.1 创建 GitHub 仓库

访问 https://github.com/new 创建新仓库:

```
仓库名: riverbit-app
描述: RiverBit - 基于 dYdX v4 的永续合约 DEX
可见性: Public
不要初始化: ❌ README ❌ .gitignore ❌ License
```

### 1.2 添加远程仓库并推送

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/riverbit-app.git

# 推送到主分支
git push -u origin main

# 创建生产分支 (Vercel 自动部署触发器)
git checkout -b prod
git push -u origin prod
```

### 1.3 验证推送

访问 `https://github.com/YOUR_USERNAME/riverbit-app` 确认:
- ✅ 324 个文件全部上传
- ✅ README.md 正确显示
- ✅ `main` 和 `prod` 两个分支存在

---

## 🌐 步骤 2: Vercel 部署

### 2.1 导入项目

1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 授权访问 GitHub 账户
4. 选择 `riverbit-app` 仓库

### 2.2 配置构建设置

```yaml
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

### 2.3 环境变量配置

在 Vercel 项目设置 → Environment Variables 添加:

| 变量名 | 值 | 说明 |
|--------|----|----|
| `VITE_CHAIN_RPC` | `https://rpc.riverchain.io` | RPC 节点地址 |
| `VITE_CHAIN_REST` | `https://api.riverchain.io` | REST API 地址 |
| `VITE_CHAIN_ID` | `riverchain-1` | 链 ID |
| `VITE_ORDERBOOK_WS` | `wss://stream.riverchain.io/v1/orderbooks` | 订单簿 WebSocket |
| `VITE_INDEXER_API` | `https://indexer.riverchain.io` | Indexer API |

**注意**: 以上地址为示例,实际部署时需要替换为真实的节点地址。

### 2.4 部署分支配置

设置 → Git → Production Branch:
```
Production Branch: prod
```

**部署触发逻辑:**
- 推送到 `prod` 分支 → 自动部署到生产环境
- 推送到其他分支 → 生成预览部署 (Preview URL)

### 2.5 执行部署

```bash
# 方式 1: 从本地推送到 prod 分支
git checkout prod
git merge main
git push origin prod

# 方式 2: 在 GitHub 上创建 Pull Request
# main → prod → 合并后自动触发部署
```

### 2.6 验证部署

1. 检查 Vercel 部署日志:
   ```
   ✓ Build completed successfully
   ✓ Deployment ready
   ```

2. 访问自动生成的 URL:
   ```
   https://riverbit-app-xxx.vercel.app
   ```

3. 验证功能:
   - [ ] 首页加载正常
   - [ ] 钱包连接功能正常
   - [ ] 交易页面渲染正常
   - [ ] WebSocket 连接成功

---

## 🌍 步骤 3: 自定义域名 (可选)

### 3.1 添加域名

Vercel 项目设置 → Domains → Add:

```
riverbit.io
www.riverbit.io
```

### 3.2 DNS 配置

在域名提供商添加以下记录:

```dns
# A 记录
riverbit.io         A       76.76.21.21

# CNAME 记录
www.riverbit.io     CNAME   cname.vercel-dns.com
```

### 3.3 SSL 证书

Vercel 会自动为自定义域名生成 SSL 证书 (Let's Encrypt):
- 生成时间: ~1-5 分钟
- 自动续期: ✅
- 强制 HTTPS: ✅ (默认开启)

---

## 🔧 步骤 4: 构建优化 (可选)

### 4.1 生产环境代码分割

编辑 `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-cosmos': ['@cosmjs/stargate', '@cosmjs/proto-signing'],
          'vendor-ui': ['decimal.js'],
        },
      },
    },
  },
});
```

### 4.2 启用压缩

在 Vercel 设置中自动启用:
- ✅ Brotli 压缩
- ✅ Gzip 压缩
- ✅ 缓存策略 (Cache-Control)

### 4.3 性能监控

Vercel Analytics 自动集成:
- 首屏加载时间 (FCP)
- 最大内容绘制 (LCP)
- 累计布局偏移 (CLS)

---

## 🔐 步骤 5: 安全配置

### 5.1 环境变量保护

确保敏感信息仅存储在 Vercel 环境变量中,不要提交到 Git:

```bash
# .gitignore 已包含
.env
.env.local
.env.production
```

### 5.2 CORS 配置

如果需要配置 CORS,创建 `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://riverbit.io" }
      ]
    }
  ]
}
```

### 5.3 安全头部

Vercel 自动添加:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 📊 步骤 6: 监控与维护

### 6.1 Vercel Analytics

在项目设置中启用:
- ✅ Web Analytics (访问量统计)
- ✅ Speed Insights (性能监控)

### 6.2 日志监控

Vercel 提供实时日志:
```bash
# 查看部署日志
vercel logs https://riverbit.io

# 查看运行时日志
vercel logs https://riverbit.io --follow
```

### 6.3 错误追踪 (推荐)

集成 Sentry:

```bash
npm install @sentry/react
```

配置 `src/main.tsx`:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.MODE,
});
```

---

## 🚨 应急回滚

### 回滚到上一个版本

```bash
# 方式 1: Vercel UI
# Deployments → 选择稳定版本 → Promote to Production

# 方式 2: Git 回滚
git checkout prod
git revert HEAD
git push origin prod
```

### 紧急修复流程

```bash
# 1. 在 main 分支修复
git checkout main
# ... 修复代码 ...
git commit -m "fix: 紧急修复 XXX 问题"

# 2. 推送到 prod 触发部署
git checkout prod
git merge main
git push origin prod

# 3. 监控 Vercel 部署状态
```

---

## ✅ 部署完成检查清单

- [ ] GitHub 仓库代码完整推送
- [ ] Vercel 项目创建成功
- [ ] 环境变量配置正确
- [ ] 生产分支设置为 `prod`
- [ ] 自定义域名解析成功 (可选)
- [ ] SSL 证书生成成功
- [ ] 网站访问正常
- [ ] 钱包连接测试通过
- [ ] WebSocket 连接正常
- [ ] 性能监控已启用

---

## 📞 问题排查

### 问题 1: 构建失败

**错误**: `Error: Cannot find module 'vite'`

**解决**:
```bash
# 确保 package.json 中 devDependencies 完整
npm install
```

### 问题 2: 环境变量未生效

**症状**: 网站加载后显示 `undefined` 或连接失败

**解决**:
1. 检查 Vercel 环境变量是否正确配置
2. 确保变量名以 `VITE_` 开头
3. 重新部署项目

### 问题 3: 自定义域名无法访问

**症状**: DNS_PROBE_FINISHED_NXDOMAIN

**解决**:
1. 检查 DNS 记录是否正确
2. 等待 DNS 传播 (最多 48 小时)
3. 使用 `dig riverbit.io` 验证解析

---

## 📚 参考资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vite.dev/guide/static-deploy.html)
- [dYdX v4 节点部署](https://docs.dydx.exchange/)
- [Cosmos SDK 文档](https://docs.cosmos.network/)

---

**部署完成后,请访问 https://riverbit.io 验证所有功能正常运行!** 🎉
