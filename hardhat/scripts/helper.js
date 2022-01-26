const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");


const erc20MintableAddress = '0x610178dA211FEF7D417bC0e6FeD39F05609AD788';
const tokenVesterAddress = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';

async function main() {
    try{
        const [owner, U1] = await ethers.getSigners();
        const ERC20Mintable = await ethers.getContractFactory("ERC20Mintable");
        const erc20Mintable = await ERC20Mintable.attach(erc20MintableAddress);
            
        const TokenVester = await ethers.getContractFactory("TokenVester");
        const tokenVester = await TokenVester.attach(tokenVesterAddress);
        
        const vesterBalance = await erc20Mintable.balanceOf(tokenVesterAddress);
        console.log(vesterBalance);
        const ownerBalance = await erc20Mintable.balanceOf(owner.address);
        console.log(ownerBalance);

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