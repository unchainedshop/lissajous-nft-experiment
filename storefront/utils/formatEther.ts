import { BigNumber, ethers } from 'ethers';

const formatEther = (input: BigNumber, fractionalDigits = 4): string => {
  const longString = ethers.utils.formatEther(input);
  const ensuredPoint = longString.includes('.') ? longString : `${longString}.`;
  const padded = `${ensuredPoint}000000000000000000`;
  const [ints, fractionals] = padded.split('.');
  return `${ints}.${fractionals.slice(0, fractionalDigits)}`;
};

export default formatEther;
