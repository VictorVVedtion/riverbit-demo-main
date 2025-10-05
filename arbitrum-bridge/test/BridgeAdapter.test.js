const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BridgeAdapter", function () {
  let bridge;
  let mockUsdc;
  let owner;
  let user1;
  let user2;

  const MIN_DEPOSIT = ethers.parseUnits("10", 6); // 10 USDC
  const MIN_WITHDRAWAL = ethers.parseUnits("10", 6);

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // 部署 Mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUsdc = await MockERC20.deploy("USD Coin", "USDC", 6);
    await mockUsdc.waitForDeployment();

    // 部署 BridgeAdapter
    const BridgeAdapter = await ethers.getContractFactory("BridgeAdapter");
    bridge = await BridgeAdapter.deploy(await mockUsdc.getAddress());
    await bridge.waitForDeployment();

    // 给用户铸造 USDC
    await mockUsdc.mint(user1.address, ethers.parseUnits("1000", 6));
    await mockUsdc.mint(user2.address, ethers.parseUnits("1000", 6));
  });

  describe("部署", function () {
    it("应该正确设置 USDC 地址", async function () {
      expect(await bridge.usdc()).to.equal(await mockUsdc.getAddress());
    });

    it("应该设置正确的 owner", async function () {
      expect(await bridge.owner()).to.equal(owner.address);
    });

    it("应该设置正确的最小金额", async function () {
      expect(await bridge.MIN_DEPOSIT()).to.equal(MIN_DEPOSIT);
      expect(await bridge.MIN_WITHDRAWAL()).to.equal(MIN_WITHDRAWAL);
    });
  });

  describe("存款到 RiverChain", function () {
    it("应该成功存款", async function () {
      const depositAmount = ethers.parseUnits("100", 6);
      const riverAddress = "river1234567890abcdefghijklmn";

      // 授权
      await mockUsdc.connect(user1).approve(await bridge.getAddress(), depositAmount);

      // 存款
      await expect(
        bridge.connect(user1).depositToRiverChain(riverAddress, depositAmount)
      )
        .to.emit(bridge, "Deposit")
        .withArgs(user1.address, riverAddress, depositAmount, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      // 检查余额
      expect(await mockUsdc.balanceOf(await bridge.getAddress())).to.equal(depositAmount);
    });

    it("应该拒绝低于最小金额的存款", async function () {
      const depositAmount = ethers.parseUnits("5", 6); // 小于 10
      const riverAddress = "river1234567890abcdefghijklmn";

      await mockUsdc.connect(user1).approve(await bridge.getAddress(), depositAmount);

      await expect(
        bridge.connect(user1).depositToRiverChain(riverAddress, depositAmount)
      ).to.be.revertedWith("Amount below minimum");
    });

    it("应该拒绝无效的 RiverChain 地址", async function () {
      const depositAmount = ethers.parseUnits("100", 6);

      await mockUsdc.connect(user1).approve(await bridge.getAddress(), depositAmount);

      // 空地址
      await expect(
        bridge.connect(user1).depositToRiverChain("", depositAmount)
      ).to.be.revertedWith("Invalid RiverChain address");

      // 错误前缀
      await expect(
        bridge.connect(user1).depositToRiverChain("cosmos1234567890", depositAmount)
      ).to.be.revertedWith("Invalid RiverChain address format");
    });
  });

  describe("取款请求", function () {
    it("owner 应该能创建取款请求", async function () {
      const withdrawAmount = ethers.parseUnits("50", 6);
      const riverAddress = "river1234567890abcdefghijklmn";

      await expect(
        bridge.connect(owner).initiateWithdrawal(riverAddress, user1.address, withdrawAmount)
      )
        .to.emit(bridge, "WithdrawalApproved")
        .withArgs(riverAddress, user1.address, withdrawAmount, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const request = await bridge.getWithdrawalRequest(riverAddress);
      expect(request.recipient).to.equal(user1.address);
      expect(request.amount).to.equal(withdrawAmount);
      expect(request.executed).to.be.false;
    });

    it("非 owner 不能创建取款请求", async function () {
      const withdrawAmount = ethers.parseUnits("50", 6);
      const riverAddress = "river1234567890abcdefghijklmn";

      await expect(
        bridge.connect(user1).initiateWithdrawal(riverAddress, user1.address, withdrawAmount)
      ).to.be.revertedWithCustomError(bridge, "OwnableUnauthorizedAccount");
    });

    it("应该拒绝低于最小金额的取款", async function () {
      const withdrawAmount = ethers.parseUnits("5", 6);
      const riverAddress = "river1234567890abcdefghijklmn";

      await expect(
        bridge.connect(owner).initiateWithdrawal(riverAddress, user1.address, withdrawAmount)
      ).to.be.revertedWith("Amount below minimum");
    });
  });

  describe("执行取款", function () {
    beforeEach(async function () {
      // 先存入一些 USDC 到桥接合约
      const depositAmount = ethers.parseUnits("1000", 6);
      await mockUsdc.connect(user1).approve(await bridge.getAddress(), depositAmount);
      await bridge.connect(user1).depositToRiverChain("river1111111111111111111111", depositAmount);
    });

    it("应该成功执行取款", async function () {
      const withdrawAmount = ethers.parseUnits("50", 6);
      const riverAddress = "river1234567890abcdefghijklmn";

      // 创建取款请求
      await bridge.connect(owner).initiateWithdrawal(riverAddress, user2.address, withdrawAmount);

      // 执行取款
      await expect(
        bridge.connect(user2).executeWithdrawal(riverAddress)
      )
        .to.emit(bridge, "Withdrawal")
        .withArgs(user2.address, riverAddress, withdrawAmount, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      // 检查余额
      expect(await mockUsdc.balanceOf(user2.address)).to.equal(
        ethers.parseUnits("1050", 6) // 原有 1000 + 提取 50
      );

      // 检查请求已执行
      const request = await bridge.getWithdrawalRequest(riverAddress);
      expect(request.executed).to.be.true;
    });

    it("只有接收者才能执行取款", async function () {
      const withdrawAmount = ethers.parseUnits("50", 6);
      const riverAddress = "river1234567890abcdefghijklmn";

      await bridge.connect(owner).initiateWithdrawal(riverAddress, user2.address, withdrawAmount);

      await expect(
        bridge.connect(user1).executeWithdrawal(riverAddress)
      ).to.be.revertedWith("Not the recipient");
    });

    it("不能重复执行取款", async function () {
      const withdrawAmount = ethers.parseUnits("50", 6);
      const riverAddress = "river1234567890abcdefghijklmn";

      await bridge.connect(owner).initiateWithdrawal(riverAddress, user2.address, withdrawAmount);
      await bridge.connect(user2).executeWithdrawal(riverAddress);

      await expect(
        bridge.connect(user2).executeWithdrawal(riverAddress)
      ).to.be.revertedWith("Already executed");
    });
  });

  describe("取消取款", function () {
    it("owner 应该能取消取款请求", async function () {
      const withdrawAmount = ethers.parseUnits("50", 6);
      const riverAddress = "river1234567890abcdefghijklmn";

      await bridge.connect(owner).initiateWithdrawal(riverAddress, user1.address, withdrawAmount);
      await bridge.connect(owner).cancelWithdrawal(riverAddress);

      const request = await bridge.getWithdrawalRequest(riverAddress);
      expect(request.amount).to.equal(0);
    });
  });

  describe("暂停功能", function () {
    it("owner 应该能暂停合约", async function () {
      await bridge.connect(owner).pause();
      expect(await bridge.paused()).to.be.true;
    });

    it("暂停时不能存款", async function () {
      await bridge.connect(owner).pause();

      const depositAmount = ethers.parseUnits("100", 6);
      const riverAddress = "river1234567890abcdefghijklmn";

      await mockUsdc.connect(user1).approve(await bridge.getAddress(), depositAmount);

      await expect(
        bridge.connect(user1).depositToRiverChain(riverAddress, depositAmount)
      ).to.be.revertedWithCustomError(bridge, "EnforcedPause");
    });

    it("owner 应该能恢复合约", async function () {
      await bridge.connect(owner).pause();
      await bridge.connect(owner).unpause();
      expect(await bridge.paused()).to.be.false;
    });
  });
});

// Mock ERC20 合约
const MockERC20Source = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _decimals = decimals_;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
`;
