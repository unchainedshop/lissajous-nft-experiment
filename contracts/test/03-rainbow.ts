import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumber } from '@ethersproject/bignumber';

import { LissajousToken } from '../artifacts/typechain';
import { compareSimulation } from './utils/compareSimulation';
import { createFixedInterest } from './utils/bigNumberCompoundInterest';
import { expectBigNumberEqual } from './utils/expectBigNumberEqual';

const START_BLOCK = 3; // First blocks are for contract creation
const END_BLOCK = 10000;
const START_PRICE = BigNumber.from('10').pow('16'); // 0.01 ETH

require('./01-walkthrough');

const calculatePrice = createFixedInterest(START_PRICE, 1001);

describe('LissajousToken Rainbow Token', function () {
  let deployed: LissajousToken;
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
      4,
    );

    const tx = await contract.deployed();
    deployed = (tx as any) as LissajousToken;
    await tx.deployTransaction.wait();

    expect(await deployed.name()).to.equal('Lissajous Token');
    expect((await deployed.totalSupply()).toString()).to.equal('0');
  });

  it('There are some rainbows', async () => {
    let rainbows = [];

    for (let i = 0; i < 10; i++) {
      const isRainbow = await deployed.isBlockRainbow(i);
      rainbows.push(isRainbow);
    }
    expect(rainbows).to.deep.eq([
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
    ]);

    // expectBigNumberEqual(await deployed.currentMinPrice(), calculatePrice(104));
    // await compareSimulation(deployed, 5);
    // await compareSimulation(deployed, 23);
    // await compareSimulation(deployed, 103);
  });

  it('Mint next rainbow', async () => {
    let rainbows = [];
    const currentBlock = await ethers.provider.getBlockNumber();

    for (let i = currentBlock; i < currentBlock + 20; i++) {
      const isRainbow = await deployed.isBlockRainbow(i);
      rainbows.push({ block: i, isRainbow });
    }

    const nextRainbow = rainbows.find((r) => r.isRainbow);

    expect(nextRainbow.isRainbow).to.eq(true);

    for (let i = 0; i < nextRainbow.block - currentBlock - 1; i++) {
      await ethers.provider.send('evm_mine', []);
    }

    // It should return the excess
    const balanceBefore = await owner.getBalance();
    const currentMinPrice = await deployed.currentMinPrice();
    const txResponse = await deployed.mint(ownerAddress, 1, {
      value: ethers.utils.parseEther('5'),
    });
    const txReceipt = await txResponse.wait();
    const gasCost = txReceipt.gasUsed.mul(txResponse.gasPrice);
    const balanceAfter = await owner.getBalance();
    const tokenBalance = await deployed.balanceOf(ownerAddress);
    expectBigNumberEqual(tokenBalance, BigNumber.from(1));
    const args = await deployed.lissajousArguments(0);

    expect(balanceAfter.add(gasCost).add(currentMinPrice).toString()).equals(
      balanceBefore.toString(),
    );

    // expectBigNumberEqual(await deployed.currentMinPrice(), calculatePrice(104));
    // await compareSimulation(deployed, 5);
    // await compareSimulation(deployed, 23);
    // await compareSimulation(deployed, 103);
  });

  it('Try to sweep the next rainbow', async () => {
    const balanceBefore = await owner.getBalance();
    const txResponse = await deployed.mint(ownerAddress, 2, {
      value: ethers.utils.parseEther('6'),
    });
    const txReceipt = await txResponse.wait();
    const gasCost = txReceipt.gasUsed.mul(txResponse.gasPrice);
    const balanceAfter = await owner.getBalance();
    const tokenBalance = await deployed.balanceOf(ownerAddress);
    // It should only be two because one is already another rainbow
    expectBigNumberEqual(tokenBalance, BigNumber.from(2));
    await compareSimulation(deployed, 1);
    // Pay for one in full
    expect(
      balanceAfter.add(gasCost).add(ethers.utils.parseEther('3')).toString(),
    ).equals(balanceBefore.toString());
  });
});
