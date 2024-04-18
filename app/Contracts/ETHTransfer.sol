// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ETHTransfer {
    // Event to emit when a transfer is made
    event Transfer(address indexed from, address indexed to, uint256 amount);

    // Function to perform P2P Ether transfers
    function transferETH(address payable _to) external payable {
        require(msg.value > 0, "Transfer amount must be greater than 0");
        require(_to != address(0), "Invalid recipient address");

        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit Transfer(msg.sender, _to, msg.value);
    }

    // Function to check the Ether balance of a given address
    function checkBalance(address _addr) public view returns (uint256) {
        return _addr.balance;
    }
}
