import fs from 'fs';
import { BigNumber } from '@ethersproject/bignumber';

async function main() {
  const START_BLOCK = 8239787;
  const END_BLOCK = 8139787;
  const START_PRICE = BigNumber.from('10').pow('16'); // 0.01 ETH

  const LissajousTokenFactory = await global.ethers.getContractFactory(
    'LissajousToken',
  );
  const { chainId } = await global.ethers.provider.getNetwork();
  const LissajousToken = await LissajousTokenFactory.deploy(
    START_BLOCK,
    END_BLOCK,
    START_PRICE,
  );

  const addresses = fs.readFileSync(`./addresses.json`);

  const newAddresses = {
    ...JSON.parse(addresses),
    [chainId]: {
      LissajousToken: LissajousToken.address,
    },
  };

  fs.writeFileSync(`./addresses.json`, JSON.stringify(newAddresses, null, 2));

  console.log('Contract deployed to:', LissajousToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
