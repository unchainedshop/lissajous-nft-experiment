import { ethers } from 'ethers';

const cleanEthInput = (input: string) => {
  if (!input) return '0';

  if (input.includes('.')) {
    const [ints, decimals] = input.split('.');

    const intsCleaned = ints.replace(/\D/g, '') || '0';
    const decimalsCleaned = decimals.slice(0, 18).replace(/\D/g, '');

    return `${intsCleaned}.${decimalsCleaned}`;
  } else {
    return input.replace(/\D/g, '') || '0';
  }
};

export const parseEthFromInput = (price: string) => {
  const cleaned = cleanEthInput(price);
  return ethers.utils.parseEther(cleaned);
};
