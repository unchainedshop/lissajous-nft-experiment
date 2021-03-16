import { ethers } from 'ethers';

import LissajousCanvas from '../../components/LissajousCanvas';
import LissajousSvg from '../../components/LissajousSvg';

const colors = [
  '#ffd700', // Gold
  '#55FF55', // light green
  '#FFFF55', // yellow
  '#FF55FF', // light magenta
  '#55FFFF', // light cyan
  '#FF5555', // light red
  '#5555FF', // ligth blue
  '#FFFFFF', // white
  '#AAAAAA', // light gray
  '#00AA00', // green
  '#AA5500', // brown
  '#AA00AA', // magenta
  '#00AAAA', // cyan
  '#0000AA', // blue
  '#AA0000', // red
  '#555555', // dark grey
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

      const aspectRatio = aspectRatios[array[0] % 8];

      const height = aspectRatio.h;
      const width = aspectRatio.w;
      const frequenceX = (array[2] % 16) + 1;
      const frequenceY = (array[3] % 16) + 1;
      const phaseShift = (1 / 16) * (array[5] % 16);
      const totalSteps = (array[6] % 16) + 1;
      const startStep = (array[7] % 16) + 1;
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

  const possibleCombinations = 8 * 16 * 16 * 16;

  console.log(possibleCombinations, figures);

  return (
    <div>
      {figures.slice(0, 200).map((figure, i) => (
        <>
          <div key={i} className="figure">
            <LissajousCanvas {...figure} />
          </div>
          <div key={`${i}_`} className="figure">
            <LissajousSvg {...figure} />
          </div>
        </>
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
