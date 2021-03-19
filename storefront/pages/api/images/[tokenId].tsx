import { ethers } from 'ethers';
import { JSDOM } from 'jsdom';
import * as d3 from 'd3';

import {
  addresses,
  LissajousToken,
  LissajousToken__factory,
} from '@private/contracts';
import { cache } from '../../../utils/cache';

const metaData = async (req, res) => {
  const { tokenId } = req.query;

  console.log(tokenId);

  // let metaData; // cache[tokenId];

  // if (!metaData) {
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

  // const metaData = {
  //   description: `Lissajous Figure NFT #${tokenId}`,
  //   external_url: `https://lissajous.art/token/${tokenId}`,
  //   // image: `https://lissajous.art/api/images/${tokenId}.svg`,
  //   name: `Lissajous Figure NFT #${tokenId}`,
  //   attributes: [
  //     {
  //       trait_type: 'Color',
  //       value: color,
  //     },
  //     {
  //       trait_type: 'Aspect Ratio',
  //       value: `${aspectRatio.width}/${aspectRatio.height}`,
  //     },
  //     {
  //       trait_type: 'Frequence X',
  //       value: lissajousArguments.frequenceX,
  //     },
  //     {
  //       trait_type: 'Frequence Y',
  //       value: lissajousArguments.frequenceY,
  //     },
  //     {
  //       trait_type: 'Phase Shift',
  //       value: `${lissajousArguments.phaseShift}/16`,
  //     },
  //     {
  //       trait_type: 'Start Step',
  //       value: lissajousArguments.startStep,
  //     },
  //     {
  //       trait_type: 'Total Steps',
  //       value: lissajousArguments.totalSteps,
  //     },
  //     {
  //       trait_type: 'Rainbow',
  //       value: lissajousArguments.rainbow,
  //     },
  //   ],
  // };
  // }

  const dom = new JSDOM(`<div id="holder"><svg></svg></div>`);

  //
  const svg = d3.select(dom.window.document).select('svg');

  const lineWidth = 10;

  let interpolateHsl;
  let backgroundColor;

  console.log(dom, svg);

  if (lissajousArguments.rainbow) {
    interpolateHsl = d3.interpolateTurbo;
    backgroundColor = d3.hsl('black');
  } else {
    const hslStart = d3.hsl(color);

    console.log(hslStart);
    const hslEnd = d3.hsl(hslStart.h - 70, hslStart.s, hslStart.l - 0.1);

    interpolateHsl = d3.interpolateHslLong(hslEnd, color);
    backgroundColor = d3.hsl(
      (hslStart.h + 180) % 360,
      hslStart.s,
      hslStart.l - 0.25,
    );
  }

  const canvasHeight = 512;
  const canvasWidth = 512;

  const numberOfSteps = 16;
  const stepsUntilFull = 256;
  const absoluteStartStep =
    (stepsUntilFull / numberOfSteps) * lissajousArguments.startStep;
  const absoluteTotalSteps =
    (stepsUntilFull / numberOfSteps) * lissajousArguments.totalSteps;

  const figureHeight = canvasHeight - lineWidth - 32;
  const figureWidht = canvasWidth - lineWidth - 32;

  const amplitudeX = aspectRatio.width / 16 / 2;
  const amplitudeY = aspectRatio.height / 16 / 2;

  const translateX =
    lineWidth / 2 +
    (figureWidht - (figureWidht / 16) * aspectRatio.width) / 2 +
    16;
  const translateY =
    lineWidth / 2 +
    (figureHeight - (figureHeight / 16) * aspectRatio.height) / 2 +
    16;

  const speed = 0.03;

  const points = Array(absoluteTotalSteps)
    .fill(0)
    .map((_, index) => {
      const step = absoluteStartStep + index;

      return {
        x:
          translateX +
          figureWidht *
            amplitudeX *
            (1 + Math.sin(step * speed * lissajousArguments.frequenceX)),
        y:
          translateY +
          figureHeight *
            amplitudeY *
            (1 +
              Math.sin(
                step * speed * lissajousArguments.frequenceY +
                  Math.PI * lissajousArguments.phaseShift,
              )),
      };
    });

  // define the line
  const valueline = d3
    .line()
    .curve(d3.curveCatmullRomOpen)
    .x((d: any) => {
      return d.x;
    })
    .y((d: any) => d.y);

  const count = 0;

  svg
    .attr('style', `background-color: ${backgroundColor}`)
    .attr('width', '512px')
    .attr('height', '512px');

  points.map((_, i) => {
    const walkingI = (i + count) % absoluteTotalSteps;
    const color = interpolateHsl(walkingI / absoluteTotalSteps);

    return svg
      .append('path')
      .datum(points.slice(i, i + 4))
      .attr('d', valueline as any)
      .style('stroke', color)
      .attr('stroke-width', lineWidth + 1);
  });

  console.log();

  return res.status(200).send(dom.serialize());
};

export default metaData;

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' });
// }
