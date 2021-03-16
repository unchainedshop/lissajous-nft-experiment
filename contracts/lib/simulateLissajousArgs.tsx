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
  [ethers.utils.parseEther('100'), '#E5E4E2'], // Platinum
  [ethers.utils.parseEther('10'), '#ffd700'], // Gold
  [ethers.utils.parseEther('5'), '#55FF55'], // light_green
  [ethers.utils.parseEther('3'), '#FFFF55'], // yellow
  [ethers.utils.parseEther('1'), '#FF55FF'], // light_magenta
  [ethers.utils.parseEther('0.8'), '#55FFFF'], // light_cyan
  [ethers.utils.parseEther('0.6'), '#FF5555'], // light_red
  [ethers.utils.parseEther('0.4'), '#FF5555'], // ligth_blue
  [ethers.utils.parseEther('0.2'), '#FFFFFF'], // white
  [ethers.utils.parseEther('0.1'), '#AAAAAA'], // light_gray
  [ethers.utils.parseEther('0.08'), '#00AA00'], // green
  [ethers.utils.parseEther('0.06'), '#AA5500'], // brown
  [ethers.utils.parseEther('0.04'), '#AA00AA'], // magenta
  [ethers.utils.parseEther('0.02'), '#00AAAA'], // cyan
  [ethers.utils.parseEther('0.01'), '#AA0000'], // red]
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

const simulateLissajousArgs = (
  blockNumber: number,
  tokenPrice: BigNumber = BigNumber.from(0),
): LissajousArgs => {
  const currentHash = getBlockHash(blockNumber);
  const array = ethers.utils.arrayify(currentHash);

  const aspectRatio = aspectRatios[array[0] % 8];

  const [, strokeColor] = priceColorMap.find(([price]) =>
    tokenPrice.gte(price) ? true : false,
  ) || [, '#555555'];

  return {
    height: aspectRatio.h,
    width: aspectRatio.w,
    frequenceX: (array[1] % 16) + 1,
    frequenceY: (array[2] % 16) + 1,
    phaseShift: (1 / 16) * (array[3] % 16),
    totalSteps: (array[4] % 16) + 1,
    startStep: (array[5] % 16) + 1,
    lineWidth: 10,
    strokeColor: (strokeColor as string).toLowerCase(),
  };
};

export default simulateLissajousArgs;
