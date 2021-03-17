import { BigNumber, ethers } from 'ethers';

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

const priceColorMap = [
  ['100', '#E5E4E2'],
  ['10', '#ffd700'],
  ['9', '#f6ff00'],
  ['8', '#c6ff00'],
  ['7', '#95ff00'],
  ['6', '#64ff00'],
  ['5', '#34ff00'],
  ['4', '#03ff00'],
  ['3', '#00ff2e'],
  ['2', '#00ff5e'],
  ['1', '#00ff8f'],
  ['0.9', '#00ffc0'],
  ['0.8', '#00fff0'],
  ['0.7', '#00ddff'],
  ['0.6', '#00acff'],
  ['0.5', '#007cff'],
  ['0.4', '#004bff'],
  ['0.3', '#001aff'],
  ['0.2', '#1600ff'],
  ['0.1', '#4700ff'],
  ['0.09', '#7800ff'],
  ['0.08', '#a800ff'],
  ['0.07', '#d900ff'],
  ['0.06', '#ff00f4'],
  ['0.05', '#ff00c4'],
  ['0.04', '#ff0093'],
  ['0.03', '#ff0062'],
  ['0.02', '#ff0032'],
  ['0.01', '#ff0001'],
];

export type LissajousArgs = {
  height: number;
  width: number;
  frequenceX: number;
  frequenceY: number;
  lineWidth?: number;
  phaseShift: number;
  totalSteps: number;
  startStep: number;
  strokeColor?: string;
};

export const getBlockHash = (blockNumber: number) =>
  ethers.utils.solidityKeccak256(['uint256'], [blockNumber]);

export const colorFromPrice = (
  tokenPrice: BigNumber = BigNumber.from(0),
): string => {
  const [, color] = priceColorMap.find(([price]) =>
    tokenPrice.gte(ethers.utils.parseEther(price)) ? true : false,
  ) || [, '#555555'];

  return color.toLocaleLowerCase();
};

const simulateLissajousArgs = (
  blockNumber: number,
  tokenPrice: BigNumber = BigNumber.from(0),
): LissajousArgs => {
  const currentHash = getBlockHash(blockNumber);
  const array = ethers.utils.arrayify(currentHash);

  const aspectRatio = aspectRatios[array[0] % 8];

  return {
    height: aspectRatio.h,
    width: aspectRatio.w,
    frequenceX: (array[1] % 16) + 1,
    frequenceY: (array[2] % 16) + 1,
    phaseShift: (1 / 16) * (array[3] % 16),
    totalSteps: (array[4] % 16) + 1,
    startStep: (array[5] % 16) + 1,
    lineWidth: 8,
    strokeColor: colorFromPrice(tokenPrice),
  };
};

export default simulateLissajousArgs;
