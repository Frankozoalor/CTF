const { parse } = require("@ethersproject/transactions");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const {parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Attack", function() {
    it("Should empty the balance of the good contract", async function() {
        //Deploying the good contract 
        const goodContractFactory = await ethers.getContractFactory("GoodContract");
        const goodContract = await goodContractFactory.deploy();
        await goodContract.deployed();

        //Deploying the Bad contract 
        const badContractFactory = await ethers.getContractFactory("BadContract");
        const badContract = await badContractFactory.deploy(goodContract.address);
        await badContract.deployed();

        //Getting two addresses, treat one as innocent user and one as attacker
        const [_, innocentAddress, attackerAddress] = await ethers.getSigners();

        //Innocent user deposits 10 Eth into GoodContract
        let tx = await goodContract.connect(innocentAddress).addBalance({
            value: parseEther("10"),
        });
        await tx.wait();

        //Checking that at this point the GoodContract balance is 10Eth
        let balanceETH = await ethers.provider.getBalance(goodContract.address);
        expect(balanceETH).to.equal(parseEther("10"));

        //Attacker calls the `attack` funcition on BadContract
        //and sends 1 Eth

        tx = await badContract.connect(attackerAddress).attack({
            value: parseEther("1"),
        });
        await tx.wait();

        //Balance of the Good Contract is now zero
         balanceETH = await ethers.provider.getBalance(goodContract.address);
        expect(balanceETH).to.equal(BigNumber.from("0"));

        //Balance of Badcontract is now 11Eth(10 Eth stolen + 1 Eth from attacker)
        balanceETH = await ethers.provider.getBalance(badContract.address);
        expect(balanceETH).to.equal(parseEther("11"));
    })
})
