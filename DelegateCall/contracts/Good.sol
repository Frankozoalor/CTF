//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Good {
    address public helper;
    address public owner;

    constructor(address _helper) {
        helper = _helper;
        owner = msg.sender;
    }

    function setNum(uint256 _num) public {
        helper.delegatecall(abi.encodeWithSignature("setNum(uint256)", _num));
    }
}
