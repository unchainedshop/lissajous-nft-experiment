import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';

import { LissajousToken } from '../artifacts/typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import simulateLissajousArgs, {
  getBlockHash,
} from '../lib/simulateLissajousArgs';

describe('LissajousToken', function () {
  const START_BLOCK = 3; // First blocks are for contract creation
  const END_BLOCK = 20;
  const START_PRICE = BigNumber.from('10').pow('16'); // 0.01 ETH
  const SAFE_PRICE = BigNumber.from('10').pow('18'); // 1 ETH
  const BASE_URI = 'https://lissajous.art/api/token/';

  let token: LissajousToken;
  let owner: SignerWithAddress;
  let someone: SignerWithAddress;
  let ownerAddress: string;

  it('Deploy', async function () {
    [owner, someone] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();

    const LissajousTokenContract = await ethers.getContractFactory(
      'LissajousToken',
    );
    const contract = await LissajousTokenContract.deploy(
      START_BLOCK,
      END_BLOCK,
      START_PRICE,
    );

    const tx = await contract.deployed();
    token = (tx as any) as LissajousToken;
    const receipt = await tx.deployTransaction.wait();

    console.log(
      'Gas fees with 100 gwei gas price: ETH',
      ethers.utils.formatEther(receipt.gasUsed.mul(100).mul(1000000000)),
    );

    expect(await token.name()).equal('Lissajous Token');
    expect((await token.totalSupply()).toString()).equal('0');
  });

  it('Mint a token before starting block should fail', async () => {
    try {
      await token.mint(ownerAddress, 1, { value: SAFE_PRICE });
      expect(false).equal(true);
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
      await token.mint(ownerAddress, 1);
      expect(false).equal(true);
    } catch (e) {
      expect(e.message).to.include('Min price not met');
    }
  });

  it('Mint a token after starting block works with correct value', async () => {
    await token.mint(ownerAddress, 1, { value: START_PRICE });
    expect((await token.totalSupply()).toString()).equal('1');
  });

  it('Mint more token with the same value fails because of price increase', async () => {
    try {
      await token.mint(ownerAddress, 16, { value: START_PRICE });
      expect(false).equal(true);
    } catch (e) {
      expect(e.message).to.include('Min price not met');
    }
  });

  it('Mint more than 24 is forbidden', async () => {
    try {
      await token.mint(ownerAddress, 17, {
        value: START_PRICE.mul(1001).div(1000).mul(17),
      });

      expect(false).equal(true);
    } catch (e) {
      expect(e.message).to.include('Only 16 token at a time');
    }
  });

  it('Mint more token with the correct value', async () => {
    const tx = await token.mint(ownerAddress, 16, {
      value: START_PRICE.mul(1001).div(1000).mul(16),
    });
    const receipt = await tx.wait();
    console.log(receipt.gasUsed.toString());
    expect((await token.totalSupply()).toString()).equal('17');
  });

  it('Price is up after minting several tokens', async () => {
    const currentMinPrice = await token.currentMinPrice();
    const priceIncrease = BigNumber.from(1001).div(1000);
    expect(currentMinPrice.eq(START_PRICE.mul(priceIncrease.pow(17))));
  });

  it('Return change if over minPrice', async () => {
    const tooHighPrice = ethers.utils.parseEther('0.019');
    const currentMinPrice = await token.currentMinPrice();
    const balanceBefore = await owner.getBalance();
    const txResponse = await owner.sendTransaction(
      await token.populateTransaction.mint(ownerAddress, 1, {
        value: tooHighPrice,
      }),
    );

    const txReceipt = await txResponse.wait();
    const gasCost = txReceipt.gasUsed.mul(txResponse.gasPrice);
    const balanceAfter = await owner.getBalance();

    expect(balanceAfter.add(gasCost).add(currentMinPrice).toString()).equals(
      balanceBefore.toString(),
    );
  });

  it('Minting after last block denied', async () => {
    for (let i = 0; i < 20; i++) {
      await ethers.provider.send('evm_mine', []);
    }
    try {
      await token.mint(ownerAddress, 1, { value: SAFE_PRICE });
      expect(false).equal(true);
    } catch (e) {
      expect(e.message).to.include('Sale ended');
    }
  });

  it('Owner can withdraw ether', async () => {
    const balanceBefore = await owner.getBalance();
    const contractBalance = await ethers.provider.getBalance(token.address);
    const txResponse = await owner.sendTransaction(
      await token.populateTransaction.withdraw(),
    );
    const txReceipt = await txResponse.wait();
    const gasCost = txReceipt.gasUsed.mul(txResponse.gasPrice);
    const balanceAfter = await owner.getBalance();

    expect(balanceAfter.add(gasCost).toString()).equals(
      balanceBefore.add(contractBalance).toString(),
    );
  });

  it('Only Owner can withdraw ether', async () => {
    try {
      await someone.sendTransaction(await token.populateTransaction.withdraw());
      expect(false).equal(true);
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

    const lissajousArguments = await token.lissajousArguments(0);
    expect(lissajousArguments.frequenceX).equal(12);
    expect(lissajousArguments.frequenceY).equal(4);
    expect(lissajousArguments.phaseShift).equal(4);
    expect(lissajousArguments.totalSteps).equal(6);
    expect(lissajousArguments.startStep).equal(13);
  });

  it('Check simulated lissajous', async () => {
    const tokenId = 3;
    const uri = await token.tokenURI(tokenId);
    expect(uri).equal(`${BASE_URI}${tokenId}`);

    const mintValue = await token.tokenMintValue(tokenId);
    const mintBlock = await token.tokenMintBlock(tokenId);
    const tokenColor = await token.tokenColor(tokenId);
    const aspectRatio = await token.aspectRatio(tokenId);
    const lissajousArguments = await token.lissajousArguments(tokenId);
    const tokenMintBlockHash = await token.tokenMintBlockHash(tokenId);

    expect(tokenMintBlockHash).equal(getBlockHash(mintBlock.toNumber()));

    const simulatedLissajousArgs = simulateLissajousArgs(
      mintBlock.toNumber(),
      mintValue,
    );

    expect(tokenColor.replace('0x', '#')).equal(
      simulatedLissajousArgs.strokeColor,
    );
    expect(aspectRatio.height).equal(simulatedLissajousArgs.height);
    expect(aspectRatio.width).equal(simulatedLissajousArgs.width);
    expect(lissajousArguments.frequenceX).equal(
      simulatedLissajousArgs.frequenceX,
    );
    expect(lissajousArguments.frequenceY).equal(
      simulatedLissajousArgs.frequenceY,
    );
    expect((1 / 16) * lissajousArguments.phaseShift).equal(
      simulatedLissajousArgs.phaseShift,
    );
    expect(lissajousArguments.totalSteps).equal(
      simulatedLissajousArgs.totalSteps,
    );
    expect(lissajousArguments.startStep).equal(
      simulatedLissajousArgs.startStep,
    );
  });
});
