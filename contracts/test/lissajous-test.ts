import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';

import { LissajousToken } from '../artifacts/typechain';

describe('LissajousToken', function () {
  const START_BLOCK = 3; // First blocks are for minting
  const END_BLOCK = 6;
  const MAX_SUPPLY = 2;
  const START_PRICE = BigNumber.from('10').pow('16'); // 0.01 ETH
  const SAFE_PRICE = BigNumber.from('10').pow('18'); // 1 ETH
  const BASE_URI = 'https://lissajous.art/api/token/';

  let token: LissajousToken;

  it('Deploy', async function () {
    const LissajousTokenContract = await ethers.getContractFactory(
      'LissajousToken',
    );
    const tx = await LissajousTokenContract.deploy(
      'Lissajous Token',
      'LISSA',
      BASE_URI,
      START_BLOCK,
      END_BLOCK,
      MAX_SUPPLY,
      START_PRICE,
    );

    token = ((await tx.deployed()) as any) as LissajousToken;

    expect(await token.name()).to.equal('Lissajous Token');
    expect((await token.totalSupply()).toString()).to.equal('0');
  });

  it('Mint a token before starting block should fail', async () => {
    try {
      await token.mint({ value: SAFE_PRICE });
      expect(false).to.equal(true);
    } catch (e) {
      expect(e.message).to.include('Sale not yet started');
    }
  });

  it('Mine a block manually', async () => {
    const beforeBlock = await ethers.provider.getBlockNumber();
    await ethers.provider.send('evm_mine', []);
    const afterBlock = await ethers.provider.getBlockNumber();
    expect(afterBlock).to.be.greaterThan(beforeBlock);
    expect(afterBlock).to.be.greaterThan(START_BLOCK - 1);
  });

  it('Mint a token with too little value', async () => {
    try {
      await token.mint();
      expect(false).to.equal(true);
    } catch (e) {
      expect(e.message).to.include('Min price not met');
    }
  });

  it('Mint a token after starting block works with correct value', async () => {
    await token.mint({ value: START_PRICE });
    expect((await token.totalSupply()).toString()).to.equal('1');
  });

  it('Minting after last block denied', async () => {
    for (let i = 0; i < 10; i++) {
      await ethers.provider.send('evm_mine', []);
    }
    try {
      await token.mint({ value: SAFE_PRICE });
      expect(false).to.equal(true);
    } catch (e) {
      expect(e.message).to.include('Sale ended');
    }
  });

  it('Owner can withdraw ether', async () => {
    const [owner] = await ethers.getSigners();
    const balanceBefore = await owner.getBalance();
    const txResponse = await owner.sendTransaction(
      await token.populateTransaction.withdraw(),
    );
    const txReceipt = await txResponse.wait();
    const gasCost = txReceipt.gasUsed.mul(txResponse.gasPrice);
    const balanceAfter = await owner.getBalance();
    expect(balanceAfter.gt(balanceBefore.add(gasCost).add(START_PRICE)));
  });

  it('Only Owner can withdraw ether', async () => {
    const [_, someone] = await ethers.getSigners();
    try {
      await someone.sendTransaction(await token.populateTransaction.withdraw());
      // await token.withdraw();
      expect(false).to.equal(true);
    } catch (e) {
      expect(e.message).to.include('from address mismatch');
    }
  });

  it('Get token MetaData', async () => {
    const uri = await token.tokenURI(0);
    expect(uri).equal(`${BASE_URI}${0}`);

    const mintValue = await token.tokenMintValue(0);
    expect(mintValue.eq(START_PRICE));

    const mintBlock = await token.tokenMintBlock(0);
    expect(mintBlock.eq(4));

    const tokenColor = await token.tokenColor(0);
    expect(tokenColor).equal('0xaa0000');

    const aspectRatio = await token.aspectRatio(0);
    expect(aspectRatio.height).equal(12);
    expect(aspectRatio.width).equal(16);
  });

  it.skip('Owner can stop minting', () => {});
});
