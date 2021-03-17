import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BigNumber } from '@ethersproject/bignumber';

import { LissajousToken } from '../artifacts/typechain';
import simulateLissajousArgs, {
  getBlockHash,
} from '../lib/simulateLissajousArgs';

/**
 *
 * const compoundInterest = (initialValue, interest, iterations) =>
  initialValue * (1 + interest) ** iterations;
 */

const START_BLOCK = 3; // First blocks are for contract creation
const END_BLOCK = 10000;
const START_PRICE = BigNumber.from('10').pow('16'); // 0.01 ETH
const BASE_URI = 'https://lissajous.art/api/token/';

const compareSimulation = async (deployed, tokenId) => {
  const uri = await deployed.tokenURI(tokenId);
  expect(uri).equal(`${BASE_URI}${tokenId}`);

  const mintValue = await deployed.tokenMintValue(tokenId);
  const mintBlock = await deployed.tokenMintBlock(tokenId);
  const tokenColor = await deployed.tokenColor(tokenId);
  const aspectRatio = await deployed.aspectRatio(tokenId);
  const lissajousArguments = await deployed.lissajousArguments(tokenId);
  const tokenMintBlockHash = await deployed.tokenMintBlockHash(tokenId);

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
  expect(lissajousArguments.startStep).equal(simulatedLissajousArgs.startStep);
};

describe('LissajousToken Pricing', function () {
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
    );

    const tx = await contract.deployed();
    deployed = (tx as any) as LissajousToken;
    const receipt = await tx.deployTransaction.wait();

    expect(await deployed.name()).to.equal('Lissajous Token');
    expect((await deployed.totalSupply()).toString()).to.equal('0');
  });

  it('start price', async () => {
    expect((await deployed.currentMinPrice()).eq(START_PRICE));
  });

  it('increased price', async () => {
    await deployed.mint(ownerAddress, 1, { value: START_PRICE });
    expect(
      (await deployed.currentMinPrice()).eq(START_PRICE.mul(1001).div(1000)),
    );
    await compareSimulation(deployed, 0);
  });

  it('Higher value', async () => {
    await deployed.mint(ownerAddress, 1, {
      value: ethers.utils.parseEther('1'),
    });
    expect(
      (await deployed.currentMinPrice()).eq(START_PRICE.mul(1001).div(1000)),
    );
    await compareSimulation(deployed, 1);
  });

  it('Even Higher value', async () => {
    await deployed.mint(ownerAddress, 1, {
      value: ethers.utils.parseEther('2'),
    });
    expect(
      (await deployed.currentMinPrice()).eq(START_PRICE.mul(1001).div(1000)),
    );
    await compareSimulation(deployed, 2);
  });

  it('Ridiculous higher value', async () => {
    await deployed.mint(ownerAddress, 1, {
      value: ethers.utils.parseEther('200'),
    });
    expect(
      (await deployed.currentMinPrice()).eq(START_PRICE.mul(1001).div(1000)),
    );
    await compareSimulation(deployed, 3);
  });

  it('Ridiculous higher value', async () => {
    for (let i = 0; i < 100; i++) {
      await deployed.mint(ownerAddress, 1, {
        value: ethers.utils.parseEther('10'),
      });
    }

    const currentMinPrice = await deployed.currentMinPrice();

    console.log(ethers.utils.formatEther(currentMinPrice));

    expect(
      (await deployed.currentMinPrice()).eq(
        START_PRICE.mul(1001).div(1000).pow(12),
      ),
    );
    await compareSimulation(deployed, 5);
    await compareSimulation(deployed, 23);
    await compareSimulation(deployed, 103);
  });
});
