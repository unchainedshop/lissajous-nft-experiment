import {
  LissajousArgs,
  addresses,
  LissajousToken,
  LissajousToken__factory,
} from '@private/contracts';
import { ethers } from 'ethers';

const cache: Record<string, LissajousArgs> = {};

const getDataFromContract = async (tokenId): Promise<LissajousArgs | false> => {
  if (cache[tokenId]) return cache[tokenId];

  const provider = ethers.getDefaultProvider('mainnet', {
    alchemy: 'U3ZksHolqD4YuDZrJuEn0PLpzMO2lCqC',
  });

  const contractAddress = addresses[1].LissajousToken;

  const contract: LissajousToken = LissajousToken__factory.connect(
    contractAddress,
    provider,
  );

  const [lissajousArguments, color, aspectRatio] = await Promise.all([
    contract.lissajousArguments(tokenId),
    contract.tokenColor(tokenId).then((result) => result.replace('0x', '#')),
    contract.aspectRatio(tokenId),
  ]);

  if (!lissajousArguments) return false;

  const args = {
    height: aspectRatio.height,
    width: aspectRatio.width,
    frequenceX: lissajousArguments.frequenceX,
    frequenceY: lissajousArguments.frequenceY,
    phaseShift: lissajousArguments.phaseShift,
    totalSteps: lissajousArguments.totalSteps,
    startStep: lissajousArguments.startStep,
    rainbow: lissajousArguments.rainbow,
    strokeColor: color,
  };

  cache[tokenId] = args;

  return args;
};

export default getDataFromContract;
