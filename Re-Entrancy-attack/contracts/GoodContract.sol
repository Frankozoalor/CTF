//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract GoodContract {
    mapping(address => uint256) public balances;

    //Update the 'Balance' mapping to include the new Eth deposited by msg.sender;
    function addBalance() public payable {
        balances[msg.sender] += msg.value;
    }

    //Send Eth worth 'balance[msg.sender]' back to msg.sender
    function withdraw() public {
        require(balances[msg.sender] > 0);
        (bool sent, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(sent, "Failed to send ether");
        //This code becomes unreachable because the contract's balance is drained
        //before user's balance could have been set at 0
        balances[msg.sender] = 0;
    }
}
