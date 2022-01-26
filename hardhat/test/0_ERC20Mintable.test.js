const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('@ethersproject/bignumber');

describe("ERC20Mintable", function () {
    let owner;
    let user1    
    let token;
    beforeEach(async () => {
        [owner, user1] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("ERC20Mintable");
        token = await Token.deploy("NAME", "SYMBOL");
    });
    describe("Deployment", async function() {
        it("Deployment should assign the correct contract owner", async function () {
            expect(await token.owner()).to.equal(owner.address);
        });
    });
    describe("Minting", async function() {
        it("Minting called by not the owner should be reverted", async function(){
            await expect(token.connect(user1).mint(user1.address, 100)).to.be.reverted;
        });
        it("Minting called by the owner should work", async function(){
            token.connect(owner).mint(user1.address, 100);
            await expect((await token.balanceOf(user1.address)).toString()).to.equal("100");
        });
    });
});

