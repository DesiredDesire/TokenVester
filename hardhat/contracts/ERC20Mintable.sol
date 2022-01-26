// SPDX-License-Identifier: Unknown
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC20Mintable.sol";

contract ERC20Mintable is ERC20, IERC20Mintable, Ownable {
    constructor(string memory name_, string memory symbol_)
        ERC20(name_, symbol_)
    {}

    function mint(address to, uint256 amount) external override onlyOwner {
        _mint(to, amount);
    }
}
