import { ethers } from 'ethers';

import {
  LissajousArgs,
  addresses,
  LissajousToken,
  LissajousToken__factory,
} from '..';
import simulateLissajousArgs from '../lib/simulateLissajousArgs';

export const main = async () => {
  const provider = ethers.getDefaultProvider('mainnet', {
    alchemy: 'U3ZksHolqD4YuDZrJuEn0PLpzMO2lCqC',
  });

  const contractAddress = addresses[1].LissajousToken;

  const contract: LissajousToken = LissajousToken__factory.connect(
    contractAddress,
    provider,
  );

  // console.log(await provider.detectNetwork());

  const now = new Date().getTime();
  const currentBlock = await provider.getBlockNumber();
  const startBlock = (await contract.startBlock()).toNumber();
  const endBlock = (await contract.endBlock()).toNumber();
  const rainbowFrequency = await contract.rainbowFrequency();

  console.log((endBlock - startBlock) / rainbowFrequency);

  // console.log(rainbowFrequency);

  // let i;
  // for (i = currentBlock; i <= endBlock; i++) {
  //   const { rainbow } = simulateLissajousArgs(i);

  //   if (rainbow) {
  //     const isRainbow = await contract.isBlockRainbow(i);
  //     console.log(i, rainbow, isRainbow);
  //   }
  // }

  const averageBlockTime = 13.21;

  const nextRainbowBlocks = [
    12373314,
    12374516,
    12399679,
    12426259,
    12444663,
    12466279,
    12470457,
    12476918,
    12484634,
    12488171,
    12501032,
    12532935,
    12540699,
    12565110,
    12567458,
  ];

  const expectedDates = nextRainbowBlocks.map((block) => {
    const diff = block - currentBlock;
    const diffMs = diff * averageBlockTime * 1000;
    return { block, date: new Date(now + diffMs), timestamp: now + diffMs };
  });

  console.table(expectedDates);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
