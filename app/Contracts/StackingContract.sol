// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingContract {
    IERC20 public token;
    address public owner;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        bool isClaimed;
    }

    mapping(address => Stake) public stakes;
    uint256 public constant STAKING_DURATION = 5 minutes;
    uint256 public totalStaked;
    uint256 public totalRewardFunds;

    event Staked(address indexed user, uint256 amount, uint256 endTime);
    event Claimed(address indexed user, uint256 amount, uint256 reward);
    event Funded(uint256 amount);
    event RewardFundsUsed(address to, uint256 amount);
    event StakedFundsUsed(address to, uint256 amount);


    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function fundContract(uint256 amount) public onlyOwner {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        totalRewardFunds += amount;
        emit Funded(amount);
    }

    function stake(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(stakes[msg.sender].amount == 0, "Ongoing stake already exists");

        stakes[msg.sender] = Stake(amount, block.timestamp, block.timestamp + STAKING_DURATION, false);
        totalStaked += amount;
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        emit Staked(msg.sender, amount, stakes[msg.sender].endTime);
    }

    function claim() public {
        Stake storage userStake = stakes[msg.sender];
        require(block.timestamp >= userStake.endTime, "Staking period has not ended yet");
        require(!userStake.isClaimed, "Rewards already claimed");

        uint256 reward = calculateReward(userStake.amount);
        require(totalRewardFunds >= reward, "Insufficient reward funds");

        userStake.isClaimed = true;
        totalStaked -= userStake.amount;  // Reflect the claim in total staked
        totalRewardFunds -= reward;  // Deduct the reward from the reward pool

        require(token.transfer(msg.sender, userStake.amount + reward), "Transfer failed");

        emit Claimed(msg.sender, userStake.amount, reward);
    }

    function calculateReward(uint256 amount) public pure returns (uint256) {
        uint256 rewardRate = 10; // 10% reward 
        return amount * rewardRate / 100;
    }

    function getTotalStakes() public view returns (uint256) {
        return totalStaked;
    }

    function getAvailableRewardFunds() public view returns (uint256) {
        return totalRewardFunds;
    }

    function getStake(address userAddress) public view returns (Stake memory) {
        return stakes[userAddress];
    }
    function getTotalBalance() public view returns (uint256) {
    return totalStaked + totalRewardFunds;
    }

    function useRewardFunds(uint256 amount, address to) public onlyOwner {
    require(amount <= totalRewardFunds, "Insufficient reward funds");
    totalRewardFunds -= amount;
    require(token.transfer(to, amount), "Transfer failed");
    emit RewardFundsUsed(to, amount);
    }

    function useStakedFunds(uint256 amount, address to) public onlyOwner {
    require(amount <= totalStaked, "Insufficient staked funds");
    totalStaked -= amount;
    require(token.transfer(to, amount), "Transfer failed");
    emit StakedFundsUsed(to, amount);
    }


}
