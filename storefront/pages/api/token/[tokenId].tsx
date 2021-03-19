import { BigNumber, ethers } from 'ethers';

import {
  addresses,
  LissajousToken,
  LissajousToken__factory,
} from '@private/contracts';

const metaData = async (req, res) => {
  const { tokenId } = req.query;

  const provider = ethers.getDefaultProvider('mainnet', {
    alchemy: 'U3ZksHolqD4YuDZrJuEn0PLpzMO2lCqC',
  });

  const contractAddress = addresses[1].LissajousToken;

  const contract: LissajousToken = LissajousToken__factory.connect(
    contractAddress,
    provider,
  );

  const [lissajousArguments, price, color, aspectRatio] = await Promise.all([
    contract.lissajousArguments(tokenId),
    contract.tokenMintValue(tokenId),
    contract.tokenColor(tokenId).then((result) => result.replace('0x', '#')),
    contract.aspectRatio(tokenId),
  ]);

  // const  = await ;
  // const price = await ;
  // const color = (await );
  // const aspectRatio = await contract.aspectRatio(tokenId);

  return res.status(200).json({
    description: `Lissajous Figure NFT #${tokenId}`,
    external_url: `https://lissajous.art/token/${tokenId}`,
    // image: `https://lissajous.art/api/token-images/${tokenId}.svg`,
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
  });
};

export default metaData;

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' });
// }
