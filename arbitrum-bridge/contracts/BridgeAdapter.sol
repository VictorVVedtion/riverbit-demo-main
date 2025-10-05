// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title BridgeAdapter
 * @dev Arbitrum Sepolia <-> RiverChain USDC 跨链桥适配器
 * @notice 用于 RiverBit 存款和取款
 */
contract BridgeAdapter is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // USDC 代币地址 (Arbitrum Sepolia)
    IERC20 public immutable usdc;

    // 最小存款金额 (10 USDC, 6 decimals)
    uint256 public constant MIN_DEPOSIT = 10 * 10**6;

    // 最小取款金额 (10 USDC)
    uint256 public constant MIN_WITHDRAWAL = 10 * 10**6;

    // 事件
    event Deposit(
        address indexed sender,
        string indexed riverAddress,
        uint256 amount,
        uint256 timestamp
    );

    event Withdrawal(
        address indexed recipient,
        string indexed riverAddress,
        uint256 amount,
        uint256 timestamp
    );

    event WithdrawalApproved(
        string indexed riverAddress,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    // 取款请求结构
    struct WithdrawalRequest {
        address recipient;
        uint256 amount;
        bool executed;
        uint256 timestamp;
    }

    // RiverChain 地址 => 取款请求
    mapping(string => WithdrawalRequest) public withdrawalRequests;

    /**
     * @dev 构造函数
     * @param _usdc USDC 代币合约地址
     */
    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }

    /**
     * @notice 存款到 RiverChain
     * @param riverAddress 目标 RiverChain 地址 (river1...)
     * @param amount 存款金额 (USDC, 6 decimals)
     */
    function depositToRiverChain(
        string calldata riverAddress,
        uint256 amount
    ) external nonReentrant whenNotPaused {
        require(amount >= MIN_DEPOSIT, "Amount below minimum");
        require(bytes(riverAddress).length > 0, "Invalid RiverChain address");
        require(
            bytes(riverAddress)[0] == 'r' &&
            bytes(riverAddress)[1] == 'i' &&
            bytes(riverAddress)[2] == 'v' &&
            bytes(riverAddress)[3] == 'e' &&
            bytes(riverAddress)[4] == 'r',
            "Invalid RiverChain address format"
        );

        // 转移 USDC 到合约
        usdc.safeTransferFrom(msg.sender, address(this), amount);

        // 发出存款事件 (链端监听此事件并铸造 USDC)
        emit Deposit(msg.sender, riverAddress, amount, block.timestamp);
    }

    /**
     * @notice 从 RiverChain 发起取款请求
     * @dev 只能由 owner 调用 (链端桥接服务)
     * @param riverAddress RiverChain 地址
     * @param recipient 接收者以太坊地址
     * @param amount 取款金额
     */
    function initiateWithdrawal(
        string calldata riverAddress,
        address recipient,
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(amount >= MIN_WITHDRAWAL, "Amount below minimum");
        require(recipient != address(0), "Invalid recipient");
        require(
            withdrawalRequests[riverAddress].amount == 0,
            "Pending withdrawal exists"
        );

        // 创建取款请求
        withdrawalRequests[riverAddress] = WithdrawalRequest({
            recipient: recipient,
            amount: amount,
            executed: false,
            timestamp: block.timestamp
        });

        emit WithdrawalApproved(riverAddress, recipient, amount, block.timestamp);
    }

    /**
     * @notice 执行取款
     * @param riverAddress RiverChain 地址
     */
    function executeWithdrawal(
        string calldata riverAddress
    ) external nonReentrant whenNotPaused {
        WithdrawalRequest storage request = withdrawalRequests[riverAddress];

        require(request.amount > 0, "No withdrawal request");
        require(!request.executed, "Already executed");
        require(msg.sender == request.recipient, "Not the recipient");
        require(
            usdc.balanceOf(address(this)) >= request.amount,
            "Insufficient bridge balance"
        );

        // 标记为已执行
        request.executed = true;

        // 转移 USDC 给接收者
        usdc.safeTransfer(request.recipient, request.amount);

        emit Withdrawal(
            request.recipient,
            riverAddress,
            request.amount,
            block.timestamp
        );
    }

    /**
     * @notice 取消取款请求
     * @param riverAddress RiverChain 地址
     */
    function cancelWithdrawal(
        string calldata riverAddress
    ) external onlyOwner {
        WithdrawalRequest storage request = withdrawalRequests[riverAddress];
        require(request.amount > 0, "No withdrawal request");
        require(!request.executed, "Already executed");

        delete withdrawalRequests[riverAddress];
    }

    /**
     * @notice 查询取款请求
     * @param riverAddress RiverChain 地址
     * @return 取款请求详情
     */
    function getWithdrawalRequest(
        string calldata riverAddress
    ) external view returns (WithdrawalRequest memory) {
        return withdrawalRequests[riverAddress];
    }

    /**
     * @notice 紧急提取 (仅限 owner)
     * @param token 代币地址
     * @param amount 提取金额
     */
    function emergencyWithdraw(
        address token,
        uint256 amount
    ) external onlyOwner {
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    /**
     * @notice 暂停合约
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice 恢复合约
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice 查询合约 USDC 余额
     * @return USDC 余额
     */
    function getContractBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
