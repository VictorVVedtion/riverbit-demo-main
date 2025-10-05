# RiverBit 主网部署文档

## 系统要求

### 验证节点
- **CPU**: 4 核
- **内存**: 16GB RAM
- **存储**: 500GB SSD
- **网络**: 100Mbps
- **操作系统**: Ubuntu 22.04 LTS

### 前端服务器
- **CPU**: 2 核
- **内存**: 4GB RAM
- **存储**: 50GB SSD
- **网络**: 100Mbps

---

## 验证节点部署

### 1. 安装依赖

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install build-essential git jq curl wget -y

# 安装 Go 1.21
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.bashrc
source ~/.bashrc

# 验证安装
go version  # 应显示 go1.21.6
```

### 2. 编译节点

```bash
# 克隆仓库
git clone https://github.com/RiverBit-dex/riverchain.git
cd riverchain

# 编译二进制
make install

# 验证安装
riverchaind version
```

### 3. 初始化节点

```bash
# 初始化节点
riverchaind init <moniker> --chain-id riverchain-1

# 下载创世文件
curl -s https://raw.githubusercontent.com/RiverBit-dex/riverchain/main/genesis.json \
  > ~/.riverchain/config/genesis.json

# 验证创世文件
riverchaind validate-genesis
```

### 4. 配置种子节点和持久节点

```bash
# 编辑 config.toml
nano ~/.riverchain/config/config.toml

# 设置种子节点
seeds = "seed1@ip1:26656,seed2@ip2:26656"

# 设置持久节点
persistent_peers = "peer1@ip1:26656,peer2@ip2:26656"

# 启用 Prometheus 监控
prometheus = true
prometheus_listen_addr = ":26660"
```

### 5. 配置应用参数

```bash
# 编辑 app.toml
nano ~/.riverchain/config/app.toml

# 最小 gas 价格
minimum-gas-prices = "0.001usdc"

# 启用 API 和 gRPC
[api]
enable = true
swagger = true
address = "tcp://0.0.0.0:1317"

[grpc]
enable = true
address = "0.0.0.0:9090"
```

### 6. 创建系统服务

```bash
sudo tee /etc/systemd/system/riverchain.service > /dev/null <<EOF
[Unit]
Description=RiverChain Node
After=network-online.target

[Service]
User=$USER
ExecStart=$(which riverchaind) start --home $HOME/.riverchain
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable riverchain
sudo systemctl start riverchain

# 查看日志
journalctl -u riverchain -f
```

### 7. 创建验证节点

```bash
# 创建验证节点密钥
riverchaind keys add validator

# 获取节点公钥
riverchaind tendermint show-validator

# 创建验证节点交易
riverchaind tx staking create-validator \
  --amount=100000000stake \
  --pubkey=$(riverchaind tendermint show-validator) \
  --moniker="MyValidator" \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1" \
  --from=validator \
  --chain-id=riverchain-1 \
  --gas=auto \
  --gas-adjustment=1.4 \
  --fees=5000usdc

# 查看验证节点状态
riverchaind query staking validator $(riverchaind keys show validator --bech val -a)
```

---

## 前端部署

### 1. 构建前端

```bash
# 克隆前端仓库
git clone https://github.com/RiverBit-dex/riverbit-app.git
cd riverbit-app

# 安装依赖
npm install

# 配置环境变量
cat > .env.production <<EOF
VITE_CHAIN_ID=riverchain-1
VITE_RPC_URL=https://rpc.riverbit.io
VITE_REST_URL=https://api.riverbit.io
VITE_INDEXER_URL=https://indexer.riverbit.io
EOF

# 构建生产版本
npm run build
```

### 2. 部署到 Nginx

```bash
# 安装 Nginx
sudo apt install nginx -y

# 配置 Nginx
sudo tee /etc/nginx/sites-available/riverbit <<EOF
server {
    listen 80;
    server_name riverbit.io www.riverbit.io;

    root /var/www/riverbit;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:1317/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Indexer 代理
    location /indexer/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 创建部署目录
sudo mkdir -p /var/www/riverbit
sudo cp -r dist/* /var/www/riverbit/

# 启用站点
sudo ln -s /etc/nginx/sites-available/riverbit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 配置 SSL (Let's Encrypt)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d riverbit.io -d www.riverbit.io

# 自动续期
sudo systemctl enable certbot.timer
```

---

## 监控系统

### 1. 部署 Prometheus + Grafana

```bash
# 创建监控配置
mkdir -p ~/monitoring && cd ~/monitoring

cat > docker-compose.yml <<EOF
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
EOF

cat > prometheus.yml <<EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'riverchain'
    static_configs:
      - targets: ['host.docker.internal:26660']

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
EOF

# 启动监控
docker-compose up -d

# 访问 Grafana: http://localhost:3000
# 用户名: admin, 密码: admin
```

### 2. 导入 Grafana 仪表板

```bash
# 使用 Cosmos SDK 标准仪表板
# Dashboard ID: 11036 (Cosmos Node Exporter)
# Dashboard ID: 12673 (Tendermint)
```

---

## 安全配置

### 1. 防火墙规则

```bash
# 安装 UFW
sudo apt install ufw -y

# 默认策略
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 允许 SSH
sudo ufw allow 22/tcp

# 允许 P2P (Tendermint)
sudo ufw allow 26656/tcp

# 允许 RPC (内网)
sudo ufw allow from 10.0.0.0/8 to any port 26657

# 允许 API (内网)
sudo ufw allow from 10.0.0.0/8 to any port 1317

# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable
sudo ufw status
```

### 2. SSH 加固

```bash
# 编辑 SSH 配置
sudo nano /etc/ssh/sshd_config

# 禁用密码登录
PasswordAuthentication no

# 禁用 root 登录
PermitRootLogin no

# 仅允许密钥认证
PubkeyAuthentication yes

# 重启 SSH
sudo systemctl restart sshd
```

### 3. 密钥管理

```bash
# 导出验证节点密钥
riverchaind keys export validator --unsafe --unarmored-hex

# 备份到安全位置 (离线存储)

# 删除节点上的密钥 (使用远程签名器)
riverchaind keys delete validator
```

---

## 备份与恢复

### 1. 数据备份

```bash
# 停止节点
sudo systemctl stop riverchain

# 备份数据目录
tar -czvf riverchain-backup-$(date +%Y%m%d).tar.gz ~/.riverchain/data

# 上传到远程存储
aws s3 cp riverchain-backup-$(date +%Y%m%d).tar.gz s3://riverbit-backups/

# 重启节点
sudo systemctl start riverchain
```

### 2. 快照恢复

```bash
# 下载快照
wget https://snapshots.riverbit.io/latest.tar.gz

# 停止节点
sudo systemctl stop riverchain

# 清理旧数据
rm -rf ~/.riverchain/data

# 解压快照
tar -xzvf latest.tar.gz -C ~/.riverchain/

# 重启节点
sudo systemctl start riverchain
```

---

## 升级流程

### 1. 软件升级

```bash
# 拉取最新代码
cd riverchain
git pull
git checkout v1.1.0

# 重新编译
make install

# 重启节点
sudo systemctl restart riverchain
```

### 2. 链上升级 (治理提案)

```bash
# 1. 创建升级提案
riverchaind tx gov submit-proposal software-upgrade v1.1.0 \
  --title="Upgrade to v1.1.0" \
  --description="..." \
  --upgrade-height=1000000 \
  --deposit=1000000000stake \
  --from=validator

# 2. 投票
riverchaind tx gov vote 1 yes --from=validator

# 3. 等待升级高度
# 4. 节点自动停止
# 5. 切换二进制并重启
sudo systemctl restart riverchain
```

---

## 故障排查

### 常见问题

**1. 节点同步缓慢**
```bash
# 检查连接的节点
curl -s localhost:26657/net_info | jq '.result.n_peers'

# 增加最大连接数
sed -i 's/max_num_inbound_peers = 40/max_num_inbound_peers = 100/' ~/.riverchain/config/config.toml
sed -i 's/max_num_outbound_peers = 10/max_num_outbound_peers = 50/' ~/.riverchain/config/config.toml
```

**2. 内存不足**
```bash
# 增加交换空间
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**3. 磁盘空间不足**
```bash
# 启用状态同步快照裁剪
sed -i 's/pruning = "default"/pruning = "custom"/' ~/.riverchain/config/app.toml
sed -i 's/pruning-keep-recent = "0"/pruning-keep-recent = "100"/' ~/.riverchain/config/app.toml
sed -i 's/pruning-interval = "0"/pruning-interval = "10"/' ~/.riverchain/config/app.toml
```

---

## 检查清单

### 部署前
- [ ] 系统要求满足
- [ ] 依赖安装完成
- [ ] 创世文件验证通过
- [ ] 种子节点配置正确
- [ ] 防火墙规则配置
- [ ] 监控系统就绪

### 部署后
- [ ] 节点同步完成
- [ ] 验证节点创建成功
- [ ] 前端部署成功
- [ ] SSL 证书配置
- [ ] 备份策略实施
- [ ] 监控告警配置

---

## 联系方式

- **技术支持**: tech@riverbit.io
- **安全团队**: security@riverbit.io
- **Discord**: https://discord.gg/riverbit
- **Telegram**: https://t.me/riverbit
