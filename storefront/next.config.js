const withTM = require('next-transpile-modules')(['@private/contracts']);
const withMDX = require('@next/mdx')({
  extension: /\.mdx$/,
});

module.exports = withMDX(withTM({ pageExtensions: ['tsx', 'jsx', 'mdx'] }));
