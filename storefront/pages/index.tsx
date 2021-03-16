import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ethers } from 'ethers';

import { simulateLissajousArgs } from '@private/contracts';
import LissajousSvg from '../components/LissajousSvg';
import { useAppContext } from '../components/AppContextWrapper';

const Index = () => {
  const {
    hasSigner,
    accounts,
    totalSupply,
    currentBlock,
    connect,
    writeContract,
    minPrice,
  } = useAppContext();

  console.log(hasSigner);

  const { register, handleSubmit, watch } = useForm();

  const { price, amount } = watch();

  const defaultPrice = ethers.utils.formatEther(minPrice.mul(1000).div(999));

  const mint = async () => {
    try {
      await writeContract.mint(accounts[0], amount, {
        value: ethers.utils.parseEther(price).mul(amount),
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
        {accounts[0] && (
          <Link href={`/address/${accounts[0]}`}>
            <a>{accounts[0]}</a>
          </Link>
        )}
        {hasSigner ? (
          <button onClick={connect}>Connect</button>
        ) : (
          'No MetaMask found :('
        )}
      </header>
      <h1>LissajousToken</h1>
      <h2>{totalSupply} already minted</h2>
      <h2>Block Number: {currentBlock}</h2>

      <form onSubmit={handleSubmit(mint)}>
        {/* register your input into the hook by invoking the "register" function */}
        <p>
          <label>
            How many?
            <input
              disabled={!accounts[0]}
              name="amount"
              defaultValue="1"
              type="number"
              ref={register({ required: true })}
            />
          </label>
        </p>

        <p>
          <label>
            Price Per Token Ξ
            <input
              disabled={!accounts[0]}
              name="price"
              defaultValue={defaultPrice}
              type="string"
              ref={register({ required: true })}
            />
          </label>
        </p>

        <p>
          Total: Ξ
          {ethers.utils.formatEther(
            ethers.utils.parseEther(price || '0').mul(amount || '1'),
          )}
        </p>

        <button disabled={!accounts[0]} type="submit">
          <i>Mint!</i>
        </button>
      </form>

      <div className="holder">
        {currentBlock &&
          Array(512)
            .fill(0)
            .map((_, i) => (
              <div className="figure" key={currentBlock + i}>
                <Link href={`block/${currentBlock + i}`}>
                  <a>
                    <LissajousSvg
                      {...(simulateLissajousArgs(currentBlock + i) as any)}
                    />
                  </a>
                </Link>
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
