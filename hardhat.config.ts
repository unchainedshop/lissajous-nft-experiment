import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy-ethers';
import 'hardhat-deploy';
import '@symfoni/hardhat-react';
import 'hardhat-typechain';
import '@typechain/ethers-v5';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
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
    outDir: './generated/typechain',
    target: 'ethers-v5',
  },
};
