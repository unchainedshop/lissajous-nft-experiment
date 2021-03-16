import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { BigNumber } from '@ethersproject/bignumber';

import {
  addresses,
  LissajousToken,
  LissajousToken__factory,
  simulateLissajousArgs,
} from '@private/contracts';
import LissajousSvg from '../components/LissajousSvg';

const ethereum = (global as any).ethereum;

const Index = () => {
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState<LissajousToken>();
  const [totalSupply, setTotalSupply] = useState<number>();
  const [currentBlock, setCurrentBlock] = useState<number>();

  useEffect(() => {
    (async () => {
      if (!ethereum) {
        alert('Please install metamask');
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();

      const accounts = await (window as any).ethereum.request({
        method: 'eth_accounts',
      });

      ethereum.on('accountsChanged', function (accounts) {
        console.log('accounts changed');
      });

      if (!accounts.length) {
        alert('Please unlock metamask');
        return;
      }

      if (chainId !== 4) {
        alert('Please switch to Rinkeby');
      }

      console.log({ chainId, provider });

      const signer = await provider.getSigner();

      setAddress(await signer.getAddress());

      // const blockNumber = await provider.getBlockNumber();

      const contract = LissajousToken__factory.connect(
        addresses[chainId].LissajousToken,
        signer,
      );

      setContract(contract);

      // const baseUri = await contract.baseURI();
      setTotalSupply((await contract.totalSupply()).toNumber());

      provider.on('block', (blockNumber) => {
        // console.log('newBlcok');
        setCurrentBlock(blockNumber);
      });

      contract.on('Transfer', async (from, to, tokenId) => {
        console.log('Transfer', { from, to, tokenId });
        setTotalSupply((await contract.totalSupply()).toNumber());
      });
    })();
  }, []);

  const mint = async () => {
    await contract.mint(address, 1, { value: BigNumber.from('10').pow('17') });
  };

  return (
    <div>
      <h1>LissajousToken</h1>
      <h2>{totalSupply} already minted</h2>
      <h2>Block Number: {currentBlock}</h2>
      <p>
        <button onClick={mint}>
          <i>Mint!</i>
        </button>
      </p>
      <div className="holder">
        {currentBlock &&
          Array(128)
            .fill(0)
            .map((_, i) => (
              <div className="figure" key={currentBlock + i}>
                <LissajousSvg
                  {...(simulateLissajousArgs(currentBlock + i) as any)}
                />
              </div>
            ))}
      </div>
      <style jsx>{`
        :global(html),
        :global(body) {
          background-color: black;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          color: white;
        }
        .figure {
          position: relative;
          display: inline-block;
          height: 128px;
          width: 128px;
          margin: 10px;
          border: 1px solid darkgrey;
        }
      `}</style>
    </div>
  );
};

export default Index;
