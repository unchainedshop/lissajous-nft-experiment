import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ethers } from 'ethers';

import { simulateLissajousArgs } from '@private/contracts';
import LissajousSvg from '../components/LissajousSvg';
import { useAppContext } from '../components/AppContextWrapper';

const Index = () => {
  const {
    accounts,
    totalSupply,
    currentBlock,
    writeContract,
    minPrice,
  } = useAppContext();

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
    <div className="container">
      <div className="holder">
        {currentBlock &&
          Array(128)
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

      <div className="control">
        <div className="control-inner">
          {' '}
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
        </div>
      </div>

      <style jsx>{`
        .figure {
          position: relative;
          display: inline-block;
          height: 128px;
          width: 128px;
          margin: 5px;
        }

        .container {
          display: flex;
        }

        .holder {
          max-height: calc(100vh - 2em);
          overflow: hidden;
        }

        .control {
          position: relative;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default Index;
