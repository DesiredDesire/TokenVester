const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");


const vestingPeriod = 60*60*24*30;

async function main() {
    try{
        const [owner, U1] = await ethers.getSigners();
        console.log("Deploying...")
            console.log('Deploying contracts with the owner account: %s', owner.address);
            

            const ERC20Mintable = await ethers.getContractFactory("ERC20Mintable");
            const erc20Mintable = await ERC20Mintable.deploy('Name', 'SYMBOL');
            console.log(`ERC20Mintable deployed`)
            
            const TokenVester = await ethers.getContractFactory("TokenVester");
            const tokenVester = await TokenVester.deploy(erc20Mintable.address, vestingPeriod);
            console.log("TokenVester deployed")  
        console.log("+++ ALL CONTRACTS DEPLOYED +++")
        erc20Mintable.connect(owner).transferOwnership(tokenVester.address);
        console.log(`ERC20Mintable address: ${erc20Mintable.address}`);
        console.log(` TokenVester  address: ${tokenVester.address}`);
        const vesterOwner = await tokenVester.owner();
        console.log(vesterOwner)
        console.log(owner.address); 
        await tokenVester.connect(owner).vest(owner.address, 123123);
    } catch (err) {
        console.error('Rejection handled.',err);
    }


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
    });