const hre = require("hardhat");

async function main() {
  console.log("🚀 部署 BridgeAdapter 合约到 Arbitrum Sepolia...\n");

  // USDC 地址 (Arbitrum Sepolia)
  // 注意: 这是示例地址,实际部署时需要确认正确的 USDC 地址
  const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";

  console.log("USDC 地址:", USDC_ADDRESS);

  // 部署 BridgeAdapter
  const BridgeAdapter = await hre.ethers.getContractFactory("BridgeAdapter");
  const bridge = await BridgeAdapter.deploy(USDC_ADDRESS);

  await bridge.waitForDeployment();

  const bridgeAddress = await bridge.getAddress();

  console.log("\n✅ BridgeAdapter 部署成功!");
  console.log("合约地址:", bridgeAddress);
  console.log("\n部署信息:");
  console.log("- 网络:", hre.network.name);
  console.log("- 部署者:", (await hre.ethers.getSigners())[0].address);
  console.log("- USDC 地址:", USDC_ADDRESS);

  console.log("\n📝 下一步:");
  console.log("1. 验证合约:");
  console.log(`   npx hardhat verify --network arbitrumSepolia ${bridgeAddress} ${USDC_ADDRESS}`);
  console.log("\n2. 配置链端桥接服务:");
  console.log(`   BRIDGE_CONTRACT_ADDRESS=${bridgeAddress}`);
  console.log("\n3. 转移一些 USDC 到合约作为流动性");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
