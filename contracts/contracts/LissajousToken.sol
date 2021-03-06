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

// https://docs.opensea.io/docs/metadata-standards
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

    // save the block when a token is minted
    mapping(uint256 => uint256) private _mintBlocks;

    // save the value provided when a token is minted
    mapping(uint256 => uint256) private _mintValues;

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
        _mintValues[_tokenIdTracker.current()] = msg.value;
        _mintBlocks[_tokenIdTracker.current()] = block.number;
        _tokenIdTracker.increment();
    }

    function tokenMintValue(uint256 tokenId) public view returns (uint256) {
        return _mintValues[tokenId];
    }

    function tokenMintBlock(uint256 tokenId) public view returns (uint256) {
        return _mintBlocks[tokenId];
    }

    function tokenMintBlockHash(uint256 tokenId) public view returns (bytes32) {
        return keccak256(abi.encodePacked(_mintBlocks[tokenId]));
    }

    function tokenColor(uint256 tokenId) public view returns (bytes3) {
        uint256 mintValue = tokenMintValue(tokenId);

        if (mintValue >= 100 ether) {
            return 0xffd700; // Gold
        } else if (mintValue >= 70 ether) {
            return 0x55FF55; // light_green
        } else if (mintValue >= 30 ether) {
            return 0xFFFF55; // yellow
        } else if (mintValue >= 10 ether) {
            return 0xFF55FF; // light_magenta
        } else if (mintValue >= 7 ether) {
            return 0x55FFFF; // light_cyan
        } else if (mintValue >= 3 ether) {
            return 0xFF5555; // light_red
        } else if (mintValue >= 1 ether) {
            return 0xFF5555; // ligth_blue
        } else if (mintValue >= 0.4 ether) {
            return 0xFFFFFF; // white
        } else if (mintValue >= 0.4 ether) {
            return 0xAAAAAA; // light_gray
        } else if (mintValue >= 0.2 ether) {
            return 0x00AA00; // green
        } else if (mintValue >= 0.1 ether) {
            return 0xAA5500; // brown
        } else if (mintValue >= 0.07 ether) {
            return 0xAA00AA; // magenta
        } else if (mintValue >= 0.04 ether) {
            return 0x00AAAA; // cyan
        } else if (mintValue >= 0.02 ether) {
            return 0x0000AA; // blue
        } else if (mintValue >= 0.01 ether) {
            return 0xAA0000; // red
        }

        return 0x555555; // dark_grey
    }

    function aspectRatio(uint256 tokenId)
        public
        view
        returns (int8 height, int8 width)
    {
        bytes32 mintBlockHash = tokenMintBlockHash(tokenId);
        uint8 first = uint8(mintBlockHash[0]);

        if (first % 8 == 0) {
            return (16, 16);
        } else if (first % 8 == 1) {
            return (16, 9);
        } else if (first % 8 == 2) {
            return (9, 16);
        } else if (first % 8 == 3) {
            return (12, 16);
        } else if (first % 8 == 4) {
            return (16, 12);
        } else if (first % 8 == 5) {
            return (3, 16);
        } else if (first % 8 == 6) {
            return (16, 3);
        }

        return (10, 10);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        msg.sender.transfer(balance);
    }
}
