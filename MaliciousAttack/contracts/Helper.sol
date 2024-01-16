//SPDX-License-Identifier: MIT

contract Helper {
    mapping(address => bool) userEligible;

    function isUserEligible(address user) public view returns (bool) {
        return userEligible[user];
    }

    function setUserEligble(address user) public {
        userEligible[user] = true;
    }

    fallback() external {}
}
