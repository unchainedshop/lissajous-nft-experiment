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
  [ethers.utils.parseEther('100'), '#E5E4E2'],
  [ethers.utils.parseEther('10'), '#ffd700'],
  [ethers.utils.parseEther('5'), '#55FF55'],
  [ethers.utils.parseEther('3'), '#FFFF55'],
  [ethers.utils.parseEther('1'), '#FF55FF'],
  [ethers.utils.parseEther('0.8'), '#55FFFF'],
  [ethers.utils.parseEther('0.6'), '#FF5555'],
  [ethers.utils.parseEther('0.4'), '#5555FF'],
  [ethers.utils.parseEther('0.2'), '#FFFFFF'],
  [ethers.utils.parseEther('0.1'), '#00AA00'],
  [ethers.utils.parseEther('0.08'), '#AA5500'],
  [ethers.utils.parseEther('0.06'), '#AA00AA'],
  [ethers.utils.parseEther('0.04'), '#00AAAA'],
  [ethers.utils.parseEther('0.02'), '#AA0000'],
  [ethers.utils.parseEther('0.01'), '#AAAAAA'],
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
    lineWidth: 8,
    strokeColor: (strokeColor as string).toLowerCase(),
  };
};

export default simulateLissajousArgs;
