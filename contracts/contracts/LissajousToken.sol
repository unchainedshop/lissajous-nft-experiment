// SPDX-License-Identifier: MIT

pragma solidity ^0.7.3;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Context.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

import 'hardhat/console.sol';

// https://docs.opensea.io/docs/metadata-standards
contract LissajousToken is Context, Ownable, ERC721 {
    using SafeMath for uint256;

    uint256 private _startBlock;
    uint256 private _endBlock;
    uint256 private _startPrice;

    uint256 public constant _priceIncreasePromille = 1001;

    uint256[15] public priceSteps = [
        100 ether,
        10 ether,
        5 ether,
        3 ether,
        1 ether,
        0.8 ether,
        0.6 ether,
        0.4 ether,
        0.2 ether,
        0.1 ether,
        0.08 ether,
        0.06 ether,
        0.04 ether,
        0.02 ether,
        0.01 ether
    ];

    bytes3[15] public sortedColorList = [
        bytes3(0xE5E4E2), // Platinum
        bytes3(0xffd700), // Gold
        bytes3(0x55FF55), // light_green
        bytes3(0xFFFF55), // yellow
        bytes3(0xFF55FF), // light_magenta
        bytes3(0x55FFFF), // light_cyan
        bytes3(0xFF5555), // light_red
        bytes3(0xFF5555), // ligth_blue
        bytes3(0xFFFFFF), // white
        bytes3(0xAAAAAA), // light_gray
        bytes3(0x00AA00), // green
        bytes3(0xAA5500), // brown
        bytes3(0xAA00AA), // magenta
        bytes3(0x00AAAA), // cyan
        bytes3(0xAA0000) // red
    ];

    struct TokenInfo {
        uint256 mintValue;
        uint256 mintBlock;
        uint256 minPrice; // used for next price calculation
    }

    mapping(uint256 => TokenInfo) private _tokenInfos;

    constructor(
        uint256 startBlock_,
        uint256 endBlock_, // Maybe 64 * 8192 (=~80 days)
        uint256 startPrice_ // 0.01 ether
    ) ERC721('Lissajous Token', 'LISSA') {
        uint256 id;
        assembly {
            id := chainid()
        }
        if (id == 56) revert('Nope!');
        if (id == 97) revert('Nope!');
        _setBaseURI('https://lissajous.art/api/token/');
        _startBlock = startBlock_;
        _endBlock = endBlock_;
        _startPrice = startPrice_;
    }

    function minPrice(uint256 tokenIndex) public view returns (uint256) {
        if (tokenIndex == 0) return _startPrice;
        uint256 lastMinPrice = _tokenInfos[tokenIndex - 1].minPrice;
        return (lastMinPrice * _priceIncreasePromille) / 1000;
    }

    function currentMinPrice() public view returns (uint256) {
        return minPrice(totalSupply());
    }

    /**
     * If minting more than one, the lower minimum mint price is used for all tokens
     *
     * Returns change:
     * - If current minPrice is 0.15 and the sender sends 0.19 -> 0.04 change
     * - If current minPrice is 0.15 and the sender sends 0.2 (next price step) -> 0 change
     * - If current minPrice is 0.15 and the sender sends 0.21 (down to next price step) -> 0.01 change
     */
    function mint(address to, uint8 amount) public payable {
        require(amount > 0, 'Mint at least one token');
        require(amount <= 16, 'Only 16 token at a time');
        require(block.number > _startBlock, 'Sale not yet started');
        require(block.number < _endBlock, 'Sale ended');

        uint256 txMinPrice = currentMinPrice().mul(amount);

        require(msg.value >= txMinPrice, 'Min price not met');

        uint256 pricePerToken = msg.value.div(amount);
        uint256 priceStep = priceStepFromValue(pricePerToken);
        uint256 aboveMinPrice = pricePerToken.sub(currentMinPrice());
        uint256 abovePriceStep = pricePerToken.sub(priceStep);

        for (uint8 i = 0; i < amount; i++) {
            uint256 tokenIndex = totalSupply();
            _safeMint(to, tokenIndex);
            _tokenInfos[tokenIndex] = TokenInfo(
                msg.value.div(amount),
                block.number.add(i),
                minPrice(tokenIndex)
            );
        }

        if (aboveMinPrice < abovePriceStep) {
            msg.sender.transfer(aboveMinPrice.mul(amount));
        } else {
            msg.sender.transfer(abovePriceStep.mul(amount));
        }
    }

    function tokenMintValue(uint256 tokenIndex) public view returns (uint256) {
        return _tokenInfos[tokenIndex].mintValue;
    }

    function tokenMintBlock(uint256 tokenIndex) public view returns (uint256) {
        return _tokenInfos[tokenIndex].mintBlock;
    }

    function tokenMintBlockHash(uint256 tokenIndex)
        public
        view
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_tokenInfos[tokenIndex].mintBlock));
    }

    function tokenColor(uint256 tokenIndex) public view returns (bytes3) {
        uint256 mintValue = tokenMintValue(tokenIndex);

        for (uint256 i; i < priceSteps.length; i++) {
            if (mintValue >= priceSteps[i]) {
                return sortedColorList[i];
            }
        }

        return sortedColorList[sortedColorList.length - 1];
    }

    function priceStepFromValue(uint256 valuePerToken)
        public
        view
        returns (uint256)
    {
        for (uint256 i; i < priceSteps.length; i++) {
            if (valuePerToken >= priceSteps[i]) {
                return priceSteps[i];
            }
        }

        return 0;
    }

    function aspectRatio(uint256 tokenIndex)
        public
        view
        returns (uint8 height, uint8 width)
    {
        bytes32 mintBlockHash = tokenMintBlockHash(tokenIndex);
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

    function lissajousArguments(uint256 tokenIndex)
        public
        view
        returns (
            uint8 frequenceX,
            uint8 frequenceY,
            uint8 phaseShift,
            uint8 totalSteps,
            uint8 startStep
        )
    {
        bytes32 mintBlockHash = tokenMintBlockHash(tokenIndex);

        uint8 second = uint8(mintBlockHash[1]);
        uint8 third = uint8(mintBlockHash[2]);
        uint8 fourth = uint8(mintBlockHash[3]);
        uint8 fifth = uint8(mintBlockHash[4]);
        uint8 sixth = uint8(mintBlockHash[5]);

        return (
            (second % 16) + 1,
            (third % 16) + 1,
            fourth % 16,
            (fifth % 16) + 1,
            (sixth % 16) + 1
        );
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        msg.sender.transfer(balance);
    }
}
