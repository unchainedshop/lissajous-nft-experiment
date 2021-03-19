import { ethers } from 'ethers';

import {
  addresses,
  LissajousToken,
  LissajousToken__factory,
} from '@private/contracts';

const cache = {};

const metaData = async (req, res) => {
  const { tokenId } = req.query;

  if (cache[tokenId]) {
    return res.status(200).json(cache[tokenId]);
  }

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

  if (!lissajousArguments) {
    return res.status(404).json({ error: 'Not found' });
  }

  const metaData = {
    description: `Lissajous Figure NFT #${tokenId}`,
    external_url: `https://lissajous.art/token/${tokenId}`,
    // image: `https://lissajous.art/api/images/${tokenId}.svg`,
    name: `Lissajous Figure NFT #${tokenId}`,
    attributes: [
      {
        trait_type: 'Color',
        value: color,
      },
      {
        trait_type: 'Aspect Ratio',
        value: `${aspectRatio.width}/${aspectRatio.height}`,
      },
      {
        trait_type: 'Frequence X',
        value: lissajousArguments.frequenceX,
      },
      {
        trait_type: 'Frequence Y',
        value: lissajousArguments.frequenceY,
      },
      {
        trait_type: 'Phase Shift',
        value: `${lissajousArguments.phaseShift}/16`,
      },
      {
        trait_type: 'Start Step',
        value: lissajousArguments.startStep,
      },
      {
        trait_type: 'Total Steps',
        value: lissajousArguments.totalSteps,
      },
      {
        trait_type: 'Rainbow',
        value: lissajousArguments.rainbow,
      },
    ],
  };

  cache[tokenId] = metaData;

  return res.status(200).json(metaData);
};

export default metaData;

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' });
// }
