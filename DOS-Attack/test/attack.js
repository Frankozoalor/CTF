const {expect} = require("chai");
const {BigNumber} = require("ethers");
const {ethers, waffle} = require("hardhat");
const { itemFromArray } = require("tsparticles");

describe("Attack", function() {
    it("After being declared the winner, Attack.sol should not allow anyone else become the winner", async function() {
        //Deploying the Good contract 
         const goodContract = await ethers.getContractFactory("Good");
         const _goodContract = await goodContract.deploy();
         await _goodContract.deployed();
         console.log("Good contract's Address:", _goodContract.address);
       
         //Deploy the Attack contract
         const attackContract = await ethers.getContractFactory("Attack");
         const _attackContract = await attackContract.deploy(_goodContract.address);
         await _attackContract.deployed();
         console.log("Attack contract address", _attackContract.address);

         //Attacking the the Good contract 
         const [_, addr1, addr2] = await ethers.getSigners();

         //Initially let addr1 become the current winner of the aution
         let tx = await _goodContract.connect(addr1).setCurrentAuctionPrice({
            value: ethers.utils.parseEther("1")
         });
         await tx.wait();

         //Start the attack and make Attack.sol the current winner of the auction 
         tx = await _attackContract.attack({
            value: ethers.utils.parseEther("3.0")
         });
         await tx.wait();

         //Now lets try making addr2 the current winner of the auction 
         tx = await _goodContract.connect(addr2).setCurrentAuctionPrice({
            value: ethers.utils.parseEther("4")
         });
         await tx.wait();

         //Now lets check if the current winner is still attack contract
         expect(await _goodContract.currentWinner()).to.equal(_attackContract.address);      

    })
})