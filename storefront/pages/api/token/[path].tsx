import getDataFromContract from '../../../utils/api/getDataFromContract';
import generateSvg from '../../../utils/api/generateSvg';

const metaData = async (req, res) => {
  const { path } = req.query;

  const [tokenId, suffix] = path.split('.');

  const lissajousArguments = await getDataFromContract(tokenId);

  if (!lissajousArguments) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (suffix === 'svg') {
    const svg = generateSvg(lissajousArguments);

    res.setHeader('Content-Type', 'image/svg+xml');

    return res.status(200).send(svg);
  }

  const metaData = {
    description: lissajousArguments.rainbow
      ? `This is a super rare Lissajous Figure Rainbow NFT. It is part of an Ethereum Native Generative Geometric Art Experiment. Only a few randomly selected blocks can produce Rainbow Tokens.`
      : `This Lissajous Figure NFT is part of an Ethereum Native Generative Geometric Art Experiment. The block it was minted determines the figure and the price determines the color.`,
    external_url: `https://lissajous.art/token/${tokenId}`,
    image: `https://lissajous.art/api/token/${tokenId}.svg`,
    name: `Lissajous Figure NFT #${tokenId}`,
    attributes: [
      {
        trait_type: 'Color',
        value: lissajousArguments.strokeColor,
      },
      {
        trait_type: 'Aspect Ratio',
        value: `${lissajousArguments.width}/${lissajousArguments.height}`,
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

  return res.status(200).json(metaData);
};

export default metaData;

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' });
// }
