const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('@ethersproject/bignumber');

const day = 60*60*24;
const vestingPeriod = 30*day;
const E18 = BigNumber.from(10).pow(18);

describe("ERC20Vester", function () {
    let owner;
    let user1;
    let user2;    
    let token;
    let vester;
    beforeEach(async () => {
        [owner, user1] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("ERC20Mintable");
        const Vester = await ethers.getContractFactory("ERC20Vester");
        token = await Token.deploy("NAME", "SYMBOL");
        vester = await Vester.deploy(token.address, vestingPeriod);
    });
    describe("Deployment", async function() {
        it("Deployment should assign the correct contract owner", async function () {
            expect(await vester.owner()).to.equal(owner.address);
        });
        it("Deployment should assign the correct token address", async function () {
            expect(await vester.tokenAddress()).to.equal(token.address);
        });
        it("Deployment should assign the correct vesting Periot", async function () {
            expect(await vester.vestingPeriod()).to.equal(vestingPeriod);
        });
    });
    describe("Ownership transfer", async function() {
        it("Should transfer ownership of ERC20Mintable from owner to ERC20Vester", async function() {
            await token.connect(owner).transferOwnership(vester.address);
            expect(await token.owner()).to.equal(vester.address);
        })
    });
    describe("Vesting", async function() {
        beforeEach(async () => {
            [owner, user1] = await ethers.getSigners();
            const Token = await ethers.getContractFactory("ERC20Mintable");
            const Vester = await ethers.getContractFactory("ERC20Vester");
            token = await Token.deploy("NAME", "SYMBOL");
            vester = await Vester.deploy(token.address, vestingPeriod);
            await token.connect(owner).transferOwnership(vester.address);
        });
        it("Vesting called by not the owner should fail", async function(){
            await expect(vester.connect(user1).vest(owner.address, 1000)).to.be.reverted;
        });
        it("Vesting called by the owner should change the state correctly", async function(){
            await vester.connect(owner).vest(user1.address, 1000);
            const vest = await vester.vestings(user1.address,0);
            expect(vest[0]).to.be.true;
            expect(vest[2]).to.equal(1000);
            expect(vest[3]).to.equal(0);
        })
        it("Two vestings to the same beneficier should chould change the state correctly", async function(){
            const totalAmount0 = BigNumber.from(Math.round(Math.random() * 10**9)).mul(E18);
            const totalAmount1 = BigNumber.from(Math.round(Math.random() * 10**9)).mul(E18);
            await vester.connect(owner).vest(user1.address, totalAmount0);
            await vester.connect(owner).vest(user1.address, totalAmount1);
            const vest0 = await vester.vestings(user1.address,0);
            const vest1 = await vester.vestings(user1.address,1);
            expect(vest0[0]).to.be.true;
            expect(vest0[2]).to.equal(totalAmount0);
            expect(vest0[3]).to.equal(0);
            expect(vest1[0]).to.be.true;
            expect(vest1[2]).to.equal(totalAmount1);
            expect(vest1[3]).to.equal(0);
        })
    });

    describe("Claiming", async function() {
        let totalAmount;
        beforeEach(async () => {
            [owner, user1, user2] = await ethers.getSigners();
            const Token = await ethers.getContractFactory("ERC20Mintable");
            const Vester = await ethers.getContractFactory("ERC20Vester");
            token = await Token.deploy("NAME", "SYMBOL");
            vester = await Vester.deploy(token.address, vestingPeriod);
            await token.connect(owner).transferOwnership(vester.address);
            totalAmount = BigNumber.from(Math.round(Math.random() * 10**9)).mul(E18);
            await vester.connect(owner).vest(user1.address, totalAmount);
        });

        it("User with no vestigs should claim 0 tokens after vesting period time", async function(){
            await network.provider.send("evm_increaseTime", [vestingPeriod]);
            await vester.connect(user2).claim();
            const userBalance = await token.balanceOf(user2.address);
            expect(userBalance).to.equal(0) 
        });

        it("User with vesting should claim amountTotal after vesting period time", async function(){
            await network.provider.send("evm_increaseTime", [vestingPeriod + day]);
            await vester.connect(user1).claim();
            const userBalance = await token.balanceOf(user1.address);
            expect(userBalance).to.equal(totalAmount) 
        });

        it("User with vesting should claim 1/30 of amountTotal each day", async function(){
            for(let i = 1; i <= 30; i++){
                await network.provider.send("evm_increaseTime", [day]);
                await vester.connect(user1).claim();
                let userBalance = await token.balanceOf(user1.address);
                expect(userBalance.lte(totalAmount.div(30).mul(i).mul(100).div(99))).to.be.true;
                expect(userBalance.gte(totalAmount.div(30).mul(i).mul(99).div(100))).to.be.true;
            }
        })
        it("User with two vesting seperated by 15 days should claim right amount after vesting periods", async function(){
            await network.provider.send("evm_increaseTime", [15*day]);
            const totalAmount1 = BigNumber.from(Math.round(Math.random() * 10**9)).mul(E18);
            await vester.connect(owner).vest(user1.address, totalAmount1);
            await network.provider.send("evm_increaseTime", [31*day]);
            await vester.connect(user1).claim();
            const userBalance = await token.balanceOf(user1.address);
            expect(userBalance).to.equal(totalAmount.add(totalAmount1)) 

        });
        it("User with two vesting seperated by 15 days should claim right amounts each day", async function(){
            for(let i = 1; i <= 15; i++){
                await network.provider.send("evm_increaseTime", [day]);
                await vester.connect(user1).claim();
                let userBalance = await token.balanceOf(user1.address);
                expect(userBalance.lte(totalAmount.div(30).mul(i).mul(100).div(99))).to.be.true;
                expect(userBalance.gte(totalAmount.div(30).mul(i).mul(99).div(100))).to.be.true;
            }
            const totalAmount1 = BigNumber.from(Math.round(Math.random() * 10**9)).mul(E18);
            await vester.connect(owner).vest(user1.address, totalAmount1);
            for(let i = 16; i <= 30; i++){
                await network.provider.send("evm_increaseTime", [day]);
                await vester.connect(user1).claim();
                let userBalance = await token.balanceOf(user1.address);
                let predictedBalance = totalAmount.div(30).mul(i).add(totalAmount1.div(30).mul(i-15))
                expect(userBalance.lte(predictedBalance.mul(100).div(99))).to.be.true;
                expect(userBalance.gte(predictedBalance.mul(99).div(100))).to.be.true;
            }
            for(let i = 31; i <= 45; i++){
                await network.provider.send("evm_increaseTime", [day]);
                await vester.connect(user1).claim();
                let userBalance = await token.balanceOf(user1.address);
                let predictedBalance = totalAmount.add(totalAmount1.div(30).mul(i-15))
                expect(userBalance.lte(predictedBalance.mul(100).div(99))).to.be.true;
                expect(userBalance.gte(predictedBalance.mul(99).div(100))).to.be.true;
            }
        });
        
    });
});
