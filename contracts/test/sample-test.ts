import { expect } from 'chai';
import { ethers } from 'hardhat';
import { LissajousToken } from '../artifacts/typechain';

describe('LissajousToken', function () {
  const START_BLOCK = 3; // First blocks are for minting
  const END_BLOCK = 5;
  const MAX_SUPPLY = 1;
  let token: LissajousToken;

  it('Deploy', async function () {
    const LissajousTokenContract = await ethers.getContractFactory(
      'LissajousToken',
    );
    const tx = await LissajousTokenContract.deploy(
      'Lissajous Token',
      'LISSA',
      'https://lissajous.art/api/token',
      START_BLOCK,
      END_BLOCK,
      MAX_SUPPLY,
    );

    token = ((await tx.deployed()) as any) as LissajousToken;

    expect(await token.name()).to.equal('Lissajous Token');
    expect((await token.totalSupply()).toString()).to.equal('0');
  });

  it('Mint a token before starting block should fail', async () => {
    try {
      await token.mint();
      expect(false).to.equal(true);
    } catch (e) {
      expect(e.message).to.include('Sale not yet started');
    }
    // expect((await token.totalSupply()).toString()).to.equal('1');
  });

  it('Mint a block manually', async () => {
    const beforeBlock = await ethers.provider.getBlockNumber();
    await ethers.provider.send('evm_mine', []);
    const afterBlock = await ethers.provider.getBlockNumber();
    expect(afterBlock).to.be.greaterThan(beforeBlock);
    expect(afterBlock).to.be.greaterThan(START_BLOCK - 1);
  });

  it('Mint a token after starting block work', async () => {
    await token.mint();
    expect((await token.totalSupply()).toString()).to.equal('1');
  });

  it.skip('Owner can withdraw ether', () => {});
  it.skip('Owner can stop minting', () => {});
});
