const withTM = require('next-transpile-modules')([
  '@private/tinac-nft-contracts',
]);

module.exports = withTM();
