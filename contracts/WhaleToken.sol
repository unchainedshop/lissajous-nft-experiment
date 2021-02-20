pragma solidity ^0.7.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract MyCollectible is ERC721 {
    constructor() ERC721('MyCollectible', 'MCO') {}
}
