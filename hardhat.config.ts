import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy-ethers';
import 'hardhat-deploy';
import 'hardhat-typechain';
import '@typechain/ethers-v5';

import addresses from './addresses.json';
import { WhaleToken } from './artifacts/typechain';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

task('send', 'Sends some ETH')
  .addPositionalParam('to', 'The account you want to send ETH to')
  .setAction(async ({ to }, { ethers }) => {
    const [signer] = await ethers.getSigners();
    await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther('1.0'),
    });
  });

task('mint', 'Mint a token for someone')
  .addPositionalParam('to', 'The account you want to send the LSTWT to')
  .setAction(async ({ to }, { ethers }) => {
    const [signer] = await ethers.getSigners();
    const { chainId } = await ethers.provider.getNetwork();
    const whaleToken = (await ethers.getContractAt(
      'WhaleToken',
      addresses[chainId].WhaleToken,
      signer,
    )) as WhaleToken;

    await whaleToken.mint(to);
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: '0.7.3',
  react: {
    providerPriority: ['web3modal', 'hardhat'],
  },
  paths: {
    react: './generated/hardhat',
    deployments: './generated/deployments/',
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  typechain: {
    outDir: './artifacts/typechain',
    target: 'ethers-v5',
  },
};