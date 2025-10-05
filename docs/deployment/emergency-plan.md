# RiverBit 应急预案

## 场景 1: 节点宕机

### 症状识别
- ✗ 节点停止出块
- ✗ 无法连接 RPC 端点
- ✗ Prometheus 监控显示节点离线
- ✗ 验证节点签名缺失

### 严重程度
**中等** - 单节点故障不影响链运行

### 应急步骤

#### 1. 立即诊断 (5 分钟内)
```bash
# 检查节点状态
systemctl status riverchain

# 查看最新日志
journalctl -u riverchain -n 100 --no-pager

# 检查磁盘空间
df -h

# 检查内存使用
free -h

# 检查网络连接
curl -s localhost:26657/status | jq
```

#### 2. 常见问题处理

**磁盘空间不足**
```bash
# 清理旧日志
sudo journalctl --vacuum-time=7d

# 启用数据裁剪
riverchaind tendermint unsafe-reset-all --keep-addr-book
```

**内存不足 (OOM)**
```bash
# 增加交换空间
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**配置文件损坏**
```bash
# 恢复默认配置
cp ~/.riverchain/config/config.toml.bak ~/.riverchain/config/config.toml
```

#### 3. 重启节点
```bash
# 重启服务
sudo systemctl restart riverchain

# 持续监控
journalctl -u riverchain -f
```

#### 4. 验证恢复
```bash
# 检查同步状态
riverchaind status | jq '.SyncInfo'

# 检查连接的节点
curl localhost:26657/net_info | jq '.result.n_peers'

# 验证签名恢复
riverchaind query slashing signing-info $(riverchaind tendermint show-validator)
```

### 升级路径
- 如 10 分钟内无法恢复 → **场景 4: 从快照恢复**
- 如硬件故障 → **场景 5: 节点迁移**

---

## 场景 2: 链停止共识

### 症状识别
- ✗ 全网节点停止出块
- ✗ 区块高度不再增长
- ✗ 投票率 < 66.67%
- ✗ 大量节点报错相同错误

### 严重程度
**严重** - 链完全停止运行

### 应急步骤

#### 1. 确认停止原因 (10 分钟内)
```bash
# 检查最后区块
riverchaind query block

# 查看共识状态
curl localhost:26657/consensus_state | jq

# 收集验证节点日志
# 联系其他验证节点获取日志
```

#### 2. 问题分类

**情况 A: 软件 Bug**
- 特定交易导致节点 panic
- 状态机不一致
- 共识算法问题

**处理方案:**
```bash
# 1. 定位问题交易/块
riverchaind query block <height>

# 2. 准备修复补丁
git checkout -b hotfix/consensus-fix
# ... 修复代码 ...
make install

# 3. 协调所有验证节点升级
# 通过 Discord/Telegram 通知

# 4. 同时重启所有节点
sudo systemctl restart riverchain
```

**情况 B: 治理提案执行失败**
- 升级提案高度到达但二进制未更新
- 参数变更导致状态不一致

**处理方案:**
```bash
# 1. 更新到正确版本
git checkout <correct-version>
make install

# 2. 导出状态并修复
riverchaind export > genesis_export.json
# 手动修复 genesis_export.json

# 3. 使用修复后的创世文件重启
riverchaind unsafe-reset-all
cp genesis_export.json ~/.riverchain/config/genesis.json
sudo systemctl start riverchain
```

#### 3. 协调重启

```bash
# 创建重启计划
cat > restart_plan.md <<EOF
# 链重启计划

**目标高度**: 停止高度 + 1
**重启时间**: 2025-XX-XX XX:00 UTC
**参与验证节点**: 列表...

## 步骤:
1. 所有节点更新到版本 vX.X.X
2. 在指定时间同时执行: sudo systemctl start riverchain
3. 监控共识恢复
EOF

# 通过所有渠道发布
```

### 升级路径
- 如涉及创世文件修复 → **场景 6: 链重启**
- 如需紧急治理 → **场景 7: 紧急提案**

---

## 场景 3: 安全漏洞利用

### 症状识别
- ✗ 异常大额交易
- ✗ 资金流向未知地址
- ✗ 智能合约余额异常减少
- ✗ 监控告警触发

### 严重程度
**危急** - 可能导致资金损失

### 应急步骤

#### 1. 立即响应 (5 分钟内)

```bash
# 1. 暂停受影响模块 (通过治理)
riverchaind tx gov submit-proposal \
  --title="Emergency: Pause Bridge Module" \
  --description="Security incident detected" \
  --type="ParameterChange" \
  --deposit=1000000000stake

# 2. 通知所有验证节点
# Discord: @everyone SECURITY INCIDENT - DO NOT UPGRADE
# Telegram: 紧急通知...

# 3. 启动事件响应团队
# - 技术负责人: xxx
# - 安全专家: xxx
# - 社区经理: xxx
```

#### 2. 遏制措施 (30 分钟内)

```bash
# 分析受影响交易
riverchaind query tx <hash> --type=hash

# 识别攻击地址
# 创建黑名单

# 如果是跨链桥攻击
# 1. 暂停以太坊端合约
cast send $BRIDGE_ADAPTER "pause()" --private-key $ADMIN_KEY

# 2. 冻结异常账户 (需治理提案)
```

#### 3. 修复漏洞 (2 小时内)

```bash
# 1. 代码修复
git checkout -b security/fix-<issue>
# ... 修复代码 ...

# 2. 安全审计
# 第三方审计确认

# 3. 准备热修复版本
make build
./build/riverchaind version  # v1.0.1-hotfix

# 4. 通过治理升级
riverchaind tx gov submit-proposal software-upgrade v1.0.1-hotfix \
  --upgrade-height=<height> \
  --deposit=1000000000stake
```

#### 4. 用户补偿

```bash
# 1. 统计受影响用户
riverchaind query bank balances <affected_address>

# 2. 准备补偿方案
# 根据损失金额和责任分配

# 3. 执行补偿 (通过治理)
riverchaind tx gov submit-proposal community-pool-spend \
  --amount=<compensation> \
  --recipient=<user_address>
```

### 升级路径
- 如无法热修复 → **场景 2: 链停止**
- 如需回滚状态 → **场景 6: 链重启**

---

## 场景 4: 从快照恢复

### 使用场景
- 节点数据损坏
- 同步速度过慢
- 快速部署新节点

### 恢复步骤

```bash
# 1. 停止节点
sudo systemctl stop riverchain

# 2. 下载最新快照
wget https://snapshots.riverbit.io/riverchain-$(date +%Y%m%d).tar.gz

# 3. 验证快照完整性
sha256sum riverchain-*.tar.gz
# 对比官方哈希

# 4. 清理旧数据
rm -rf ~/.riverchain/data

# 5. 解压快照
tar -xzvf riverchain-*.tar.gz -C ~/.riverchain/

# 6. 重启节点
sudo systemctl start riverchain

# 7. 验证同步
journalctl -u riverchain -f
riverchaind status | jq '.SyncInfo.catching_up'
```

---

## 场景 5: 节点迁移

### 使用场景
- 硬件故障
- 扩容升级
- 区域迁移

### 迁移步骤

```bash
# ===== 旧节点操作 =====
# 1. 备份验证节点密钥
riverchaind keys export validator > validator.key

# 2. 备份配置
tar -czf config_backup.tar.gz ~/.riverchain/config/

# 3. 记录节点信息
riverchaind tendermint show-node-id
riverchaind tendermint show-validator

# ===== 新节点操作 =====
# 1. 部署基础环境 (参考部署文档)

# 2. 恢复配置
tar -xzf config_backup.tar.gz -C ~/

# 3. 导入密钥
riverchaind keys import validator validator.key

# 4. 从快照同步
# (参考场景 4)

# 5. 等待同步完成
riverchaind status | jq '.SyncInfo'

# 6. 停止旧节点
# SSH 到旧节点
sudo systemctl stop riverchain
sudo systemctl disable riverchain

# 7. 验证新节点开始签名
riverchaind query slashing signing-info $(riverchaind tendermint show-validator)
```

---

## 场景 6: 链重启 (硬分叉)

### 使用场景
- 创世文件需要修复
- 状态不一致需要重置
- 重大安全事件恢复

### 重启步骤

```bash
# ===== 准备阶段 =====
# 1. 确定重启高度
RESTART_HEIGHT=1000000

# 2. 导出状态
riverchaind export --height=$RESTART_HEIGHT > genesis_export.json

# 3. 修复导出的状态
# 使用 jq 或手动编辑 genesis_export.json
jq '.app_state.bank.balances += [{"address": "river1...", "coins": [...]}]' genesis_export.json > genesis_fixed.json

# 4. 生成新创世文件
cat genesis_fixed.json | \
  jq '.chain_id = "riverchain-2"' | \
  jq '.genesis_time = "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"' \
  > genesis_new.json

# 5. 验证创世文件
riverchaind validate-genesis genesis_new.json

# ===== 协调阶段 =====
# 6. 发布重启公告
cat > restart_announcement.md <<EOF
# RiverChain 重启公告

由于 [原因], RiverChain 将进行硬分叉重启。

**旧链停止高度**: $RESTART_HEIGHT
**新链 ID**: riverchain-2
**重启时间**: 2025-XX-XX XX:00 UTC

## 验证节点操作:
1. 在高度 $RESTART_HEIGHT 导出状态
2. 下载新创世文件
3. 重置节点数据
4. 在指定时间同时启动

## 用户操作:
- 钱包将自动切换到新链
- 余额将完整保留
- 所有未完成订单将取消
EOF

# ===== 执行阶段 =====
# 7. 所有验证节点执行
sudo systemctl stop riverchain
riverchaind unsafe-reset-all --keep-addr-book
curl -s https://riverbit.io/genesis_new.json > ~/.riverchain/config/genesis.json

# 8. 在约定时间启动
sudo systemctl start riverchain

# 9. 监控新链启动
journalctl -u riverchain -f
curl localhost:26657/status | jq '.result.sync_info'
```

---

## 场景 7: 紧急治理提案

### 使用场景
- 参数需要紧急调整
- 模块需要紧急暂停
- 紧急资金调拨

### 快速通道流程

```bash
# 1. 创建紧急提案 (减少质押要求)
riverchaind tx gov submit-proposal param-change proposal.json \
  --from validator \
  --deposit 100000000stake  # 降低到 100 STAKE

# proposal.json 示例:
{
  "title": "Emergency: Pause Trading Module",
  "description": "Critical bug detected in trading module",
  "changes": [{
    "subspace": "trading",
    "key": "Enabled",
    "value": "false"
  }],
  "deposit": "100000000stake"
}

# 2. 快速投票 (1小时投票期)
# 联系所有验证节点立即投票
riverchaind tx gov vote 1 yes --from validator

# 3. 监控提案状态
riverchaind query gov proposal 1

# 4. 提案通过后自动执行
# 验证参数变更
riverchaind query params subspace trading Enabled
```

---

## 联系方式

### 紧急联系人

| 角色 | 姓名 | 电话 | Email | Telegram |
|------|------|------|-------|----------|
| 技术负责人 | Alice | +1-xxx | alice@riverbit.io | @alice_river |
| 安全专家 | Bob | +1-xxx | bob@riverbit.io | @bob_security |
| DevOps | Charlie | +1-xxx | charlie@riverbit.io | @charlie_ops |
| 社区经理 | David | +1-xxx | david@riverbit.io | @david_cm |

### 通信渠道

- **紧急群组**: Telegram - https://t.me/riverbit_emergency (仅验证节点)
- **Discord**: https://discord.gg/riverbit (#emergency 频道)
- **状态页面**: https://status.riverbit.io
- **邮件列表**: validators@riverbit.io

### 升级流程

```
事件发现
  ↓
初步评估 (5分钟)
  ↓
├─ 低 → 正常处理
├─ 中 → 启动应急响应
└─ 高 → 启动紧急协议
       ↓
   拉取紧急群组
       ↓
   执行应急预案
       ↓
   持续监控
       ↓
   事后总结
```

---

**文档版本**: v1.0
**最后更新**: 2025-10-04
**下次演练**: 2025-11-04
