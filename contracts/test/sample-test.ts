import { expect } from 'chai';
import { ethers } from 'hardhat';
import { WhaleToken } from '../artifacts/typechain';

describe('WhaleToken', function () {
  it('Deploy', async function () {
    const WhaleTokenContract = await ethers.getContractFactory('WhaleToken');
    const tx = await WhaleTokenContract.deploy('LSTWIT', 'LSTWIT', '');

    const token = ((await tx.deployed()) as any) as WhaleToken;

    console.log(await token.totalSupply());
    expect((await token.totalSupply()).toString()).to.equal('0');

    // await greeter.setGreeting('Hola, mundo!');
    // expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});
