import fs from 'fs';

async function main() {
  const LissajousToken = await global.ethers.getContractFactory('LissajousToken');
  const { chainId } = await global.ethers.provider.getNetwork();
  const LissajousToken = await LissajousToken.deploy(
    'Lets Save The Wales Token',
    'LSTWT',
    'https://token.thisisnotacommercial.com/',
  );

  const addresses = fs.readFileSync(`./addresses.json`);

  const newAddresses = {
    ...JSON.parse(addresses),
    [chainId]: {
      LissajousToken: LissajousToken.address,
    },
  };

  fs.writeFileSync(`./addresses.json`, JSON.stringify(newAddresses, null, 2));

  console.log('Whale Token deployed to:', LissajousToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
