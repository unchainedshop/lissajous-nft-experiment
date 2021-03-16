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
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState(0);
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

      setProvider(provider);

      const accounts = await (window as any).ethereum.request({
        method: 'eth_accounts',
      });
      setAccounts(accounts);

      provider.on('accountsChanged', (accounts) => {
        console.log('accounts changed');
        setAccounts(accounts);
      });

      provider.on('chainChanged', (chainId) => {
        console.log('accounts changed');
        setChainId(chainId);
      });

      if (chainId !== 4) {
        alert('Please switch to Rinkeby');
      }

      // const blockNumber = await provider.getBlockNumber();

      const contract = LissajousToken__factory.connect(
        addresses[chainId].LissajousToken,
        provider,
      );

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

  const connect = async () => {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await ethereum.request({
      method: 'eth_accounts',
    });
    setAccounts(accounts);
  };

  const mint = async () => {
    const signer = await provider.getSigner();

    const contract = LissajousToken__factory.connect(
      addresses[chainId].LissajousToken,
      signer,
    );
    await contract.mint(accounts[0], 1, {
      value: BigNumber.from('10').pow('17'),
    });
  };

  return (
    <div>
      <header>
        {accounts[0] || <button onClick={connect}>Connect</button>}{' '}
      </header>
      <h1>LissajousToken</h1>
      <h2>{totalSupply} already minted</h2>
      <h2>Block Number: {currentBlock}</h2>
      <p>
        <button onClick={mint} disabled={!accounts[0]}>
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
