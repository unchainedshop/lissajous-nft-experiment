// SPDX-License-Identifier: MIT

pragma solidity ^0.7.3;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Context.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721Pausable.sol';

/**
Compound interest in JavaScript:

const compoundInterest = (initialValue, interest, iterations) =>
  initialValue * (1 + interest) ** iterations;
 */

/**
 * @dev {ERC721} token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - a minter role that allows for token minting (creation)
 *  - a pauser role that allows to stop all token transfers
 *  - token ID and URI autogeneration
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
contract LissajousToken is Context, Ownable, ERC721Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;

    uint256 private _startBlock;
    uint256 private _endBlock;
    uint64 private _maxSupply;
    uint256 private _startPrice;

    uint256 public constant priceIncreasePercent = 108;
    uint256 public constant priceDecreasePercent = 98;
    // Blocks. This is a bit more than one day. ~6525 blocks per day
    uint256 public constant priceDecreasePeriod = 8192;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        uint256 startBlock_,
        uint256 endBlock_,
        uint64 maxSupply_,
        uint256 startPrice_
    ) ERC721(name, symbol) {
        _setBaseURI(baseURI);
        _startBlock = startBlock_;
        _endBlock = endBlock_;
        _maxSupply = maxSupply_;
        _startPrice = startPrice_;
    }

    function minPrice() public view returns (uint256) {
        return _startPrice;
    }

    function mint() public payable {
        require(totalSupply() < _maxSupply, 'All items sold');
        require(block.number < _endBlock, 'Sale ended');
        require(block.number > _startBlock, 'Sale not yet started');
        require(msg.value >= minPrice(), 'Min price not met');

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        _mint(msg.sender, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        msg.sender.transfer(balance);
    }
}
