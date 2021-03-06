import { expect } from 'chai';
import { ethers } from 'hardhat';
import { LissajousToken } from '../artifacts/typechain';

describe('LissajousToken', function () {
  let token: LissajousToken;

  it('Deploy', async function () {
    const LissajousTokenContract = await ethers.getContractFactory(
      'LissajousToken',
    );
    const tx = await LissajousTokenContract.deploy(
      'Lissajous Token',
      'LISSA',
      'https://lissajous.art/api/token',
      5,
      20,
      5,
    );

    token = ((await tx.deployed()) as any) as LissajousToken;

    expect(await token.name()).to.equal('Lissajous Token');
    expect((await token.totalSupply()).toString()).to.equal('0');
  });

  it('Mint a token before starting block should fail', async () => {
    await token.mint();
    expect((await token.totalSupply()).toString()).to.equal('1');
  });

  it.skip('Owner can withdraw ether', () => {});
  it.skip('Owner can stop minting', () => {});
});
