import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import addresses from '../addresses.json';
// import WhalteTokenABI from '../artifacts/contracts/WhaleToken.sol/WhaleToken.json';
import { WhaleToken__factory } from '../artifacts/typechain';

const Index = () => {
  const [account, setAccount] = useState('');

  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
      );
      const { chainId, name } = await provider.getNetwork();

      const blockNumber = await provider.getBlockNumber();

      console.log({ blockNumber, addresses, name, chainId });

      // const whaleToken: WhaleToken = new ethers.Contract(
      //   addresses[chainId].WhaleToken,
      //   WhalteTokenABI as any,
      //   provider,
      // );

      const whaleToken = WhaleToken__factory.connect(
        addresses[chainId].WhaleToken,
        provider,
      );

      const baseUri = await whaleToken.baseURI();
      console.log({ baseUri });

      setAccount(baseUri);
    })();
  }, []);

  return <h1>Hello {account}</h1>;
};

export default Index;
