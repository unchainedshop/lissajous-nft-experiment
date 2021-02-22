import fs from 'fs';

async function main() {
  const WhaleToken = await global.ethers.getContractFactory('WhaleToken');
  const { chainId } = await global.ethers.provider.getNetwork();
  const whaleToken = await WhaleToken.deploy(
    'Lets Save The Wales Token',
    'LSTWT',
    'https://token.thisisnotacommercial.com/',
  );

  const addresses = fs.readFileSync(`./addresses.json`);

  const newAddresses = {
    ...JSON.parse(addresses),
    [chainId]: {
      WhaleToken: whaleToken.address,
    },
  };

  fs.writeFileSync(`./addresses.json`, JSON.stringify(newAddresses, null, 2));

  console.log('Whale Token deployed to:', whaleToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
