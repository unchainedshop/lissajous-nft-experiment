import React from 'react';
import Link from 'next/link';

import { BigNumber } from '@ethersproject/bignumber';

import { simulateLissajousArgs } from '@private/contracts';
import LissajousSvg from '../components/LissajousSvg';
import { useAppContext } from '../components/AppContextWrapper';

const Index = () => {
  const {
    accounts,
    totalSupply,
    currentBlock,
    connect,
    writeContract,
  } = useAppContext();

  const mint = async () => {
    try {
      await writeContract.mint(accounts[0], 1, {
        value: BigNumber.from('10').pow('17'),
      });
    } catch (e) {
      console.error(e);
      // alert(e.message.match(/"message":"execution reverted:(.*)"$/gm));
      alert(e.message);
    }
  };

  return (
    <div>
      <header>
        {accounts[0] ? (
          <Link href={`/address/${accounts[0]}`}>
            <a>{accounts[0]}</a>
          </Link>
        ) : (
          <button onClick={connect}>Connect</button>
        )}{' '}
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
