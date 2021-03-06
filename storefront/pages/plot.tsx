import { ethers } from 'ethers';

import Lissajous from '../components/Lissajous';

const colors = [
  '#ffd700',
  '#555555',
  '#0000AA',
  '#5555FF',
  '#00AA00',
  '#55FF55',
  '#00AAAA',
  '#55FFFF',
  '#AA0000',
  '#FF5555',
  '#AA00AA',
  '#FF55FF',
  '#AA5500',
  '#FFFF55',
  '#AAAAAA',
  '#FFFFFF',
];

const aspectRatios = [
  { h: 16, w: 16 },
  { h: 16, w: 9 },
  { h: 9, w: 16 },
  { h: 12, w: 16 },
  { h: 16, w: 12 },
  { h: 3, w: 16 },
  { h: 16, w: 3 },
  { h: 10, w: 10 },
];

const Plot = () => {
  const figures = Array(65536)
    .fill(0)
    .map((_, i) => {
      const startBlock = Math.round(Math.random() * 10000);
      const currentBlock = startBlock + i;
      const currentHash = ethers.utils.keccak256(
        ethers.utils.hexlify(currentBlock),
      );
      const array = ethers.utils.arrayify(currentHash);
      // console.log(array);

      const aspectRatio = aspectRatios[array[0] % 8];

      const height = aspectRatio.h;
      const width = aspectRatio.w;
      const frequenceX = (array[2] % 16) + 1;
      const frequenceY = (array[3] % 16) + 1;
      const phaseShift = (1 / 16) * (array[5] % 16);
      // const totalSteps = 6384;
      // const totalSteps = 1000;
      const totalSteps = (6384 / 16) * ((array[6] % 16) + 1);
      const startStep = (6384 / 16) * ((array[7] % 16) + 1);
      const lineWidth = 1;
      const strokeColor = colors[array[6] % 16];

      return {
        height,
        width,
        frequenceX,
        frequenceY,
        lineWidth,
        phaseShift,
        totalSteps,
        strokeColor,
        startStep,
      };
    });

  console.log(
    figures.reduce((acc, curr) => (curr.frequenceX === 4 ? acc + 1 : acc), 0),
  );

  const blocksPerDay = 6408;

  const possibleCombinations = 8 * 16 * 16 * 16;

  console.log(possibleCombinations, figures);

  return (
    <div>
      {figures.slice(0, 200).map((figure, i) => (
        <div key={i} className="figure">
          <Lissajous {...figure} />
        </div>
      ))}

      <style jsx>{`
        :global(html),
        :global(body) {
          background-color: black;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          color: white;
        }
        .figure {
          position: relative;
          display: inline-block;
          height: 100px;
          width: 100px;
          margin: 10px;
        }
      `}</style>
    </div>
  );
};

export default Plot;
