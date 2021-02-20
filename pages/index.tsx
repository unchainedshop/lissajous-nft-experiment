import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import 'mvp.css';

import addresses from '../addresses.json';
// import WhalteTokenABI from '../artifacts/contracts/WhaleToken.sol/WhaleToken.json';
import { WhaleToken, WhaleToken__factory } from '../artifacts/typechain';

const Index = () => {
  const [address, setAddress] = useState('');
  const [whaleToken, setWhaleToken] = useState<WhaleToken>();
  const [totalSupply, setTotalSupply] = useState<number>();

  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
      );
      const { chainId, name } = await provider.getNetwork();
      const signer = await provider.getSigner();

      setAddress(await signer.getAddress());

      console.log({ signer, address });
      const blockNumber = await provider.getBlockNumber();

      console.log({ blockNumber, addresses, name, chainId });

      // const whaleToken: WhaleToken = new ethers.Contract(
      //   addresses[chainId].WhaleToken,
      //   WhalteTokenABI as any,
      //   provider,
      // );

      const whaleToken = WhaleToken__factory.connect(
        addresses[chainId].WhaleToken,
        signer,
      );

      setWhaleToken(whaleToken);

      const baseUri = await whaleToken.baseURI();
      setTotalSupply(await (await whaleToken.totalSupply()).toNumber());
      console.log({ baseUri });

      whaleToken.on('Transfer', async (from, to, tokenId) => {
        console.log('Transfer', { from, to, tokenId });
        setTotalSupply((await whaleToken.totalSupply()).toNumber());
      });
    })();
  }, []);

  const mint = async () => {
    await whaleToken.mint(address);
  };

  return (
    <header>
      <h1>Lets Save The Whales International Coin</h1>
      <h2>{totalSupply} already minted</h2>
      <p>
        <button onClick={mint}>
          <i>Mint!</i>
        </button>
      </p>
    </header>
  );
};

export default Index;
