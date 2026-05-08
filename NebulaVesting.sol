// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NebulaVesting {
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 amountWithdrawn;
        uint256 startTime;
        uint256 duration;
    }

    mapping(address => VestingSchedule) public schedules;
    IERC20 public token;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function createSchedule(address _beneficiary, uint256 _amount, uint256 _duration) external {
        token.transferFrom(msg.sender, address(this), _amount);
        schedules[_beneficiary] = VestingSchedule(_amount, 0, block.timestamp, _duration);
    }

    function claim() external {
        VestingSchedule storage s = schedules[msg.sender];
        uint256 elapsed = block.timestamp - s.startTime;
        uint256 totalReleasable = (s.totalAmount * elapsed) / s.duration;
        
        if (totalReleasable > s.totalAmount) totalReleasable = s.totalAmount;
        uint256 amountToWithdraw = totalReleasable - s.amountWithdrawn;

        s.amountWithdrawn += amountToWithdraw;
        token.transfer(msg.sender, amountToWithdraw);
    }
}
