async function main() {
  const WhaleToken = await global.ethers.getContractFactory('WhaleToken');
  const whaleToken = await WhaleToken.deploy(
    'Lets Save The Wales Token',
    'LSTWT',
    'https://token.thisisnotacommercial.com/',
  );

  console.log('Whale Token deployed to:', whaleToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
