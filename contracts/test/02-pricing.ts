import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';

import { LissajousToken } from '../artifacts/typechain';

describe.skip('LissajousToken Pricing', function () {
  const START_BLOCK = 12800000;
  const PRICE_DECREASE_PERIOD = 8192;
  const END_BLOCK = START_BLOCK + 64 * PRICE_DECREASE_PERIOD;
  const MAX_SUPPLY = 524288;
  const START_PRICE = BigNumber.from('10').pow('16'); // 0.01 ETH

  let token: LissajousToken;

  it('Deploy', async function () {
    const LissajousTokenContract = await ethers.getContractFactory(
      'LissajousToken',
    );
    const contract = await LissajousTokenContract.deploy(
      START_BLOCK,
      END_BLOCK,
      MAX_SUPPLY,
      START_PRICE,
      PRICE_DECREASE_PERIOD,
    );

    const tx = await contract.deployed();
    token = (tx as any) as LissajousToken;
    const receipt = await tx.deployTransaction.wait();

    expect(await token.name()).to.equal('Lissajous Token');
    expect((await token.totalSupply()).toString()).to.equal('0');
  });

  it('First token start price', async () => {
    expect((await token.pricingPreview(0, START_BLOCK)).eq(START_PRICE));
  });

  it('Second token increased price', async () => {
    expect(
      (await token.pricingPreview(1, START_BLOCK)).eq(
        START_PRICE.mul(108).div(100),
      ),
    );
  });

  it('Endblock no token sold', async () => {
    const endPrice = START_PRICE.mul(
      BigNumber.from(98).pow((END_BLOCK - START_BLOCK) / PRICE_DECREASE_PERIOD),
    ).div(
      BigNumber.from(100).pow(
        (END_BLOCK - START_BLOCK) / PRICE_DECREASE_PERIOD,
      ),
    );

    expect((await token.pricingPreview(0, END_BLOCK)).eq(endPrice));
  });

  it('Endblock all tokens sold', async () => {
    const endPriceNoTokens = START_PRICE.mul(
      BigNumber.from(98).pow((END_BLOCK - START_BLOCK) / PRICE_DECREASE_PERIOD),
    ).div(
      BigNumber.from(100).pow(
        (END_BLOCK - START_BLOCK) / PRICE_DECREASE_PERIOD,
      ),
    );

    const endPriceAllTokens = endPriceNoTokens
      .mul(BigNumber.from(108).pow(101))
      .div(BigNumber.from(100).pow(101));

    console.log(ethers.utils.formatEther(endPriceAllTokens));

    expect((await token.pricingPreview(101, END_BLOCK)).eq(endPriceAllTokens));
  });
});
