import React, { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ethers } from 'ethers';

import { useAppContext } from '../components/AppContextWrapper';
import { useRouter } from 'next/router';
import AutoScrollPreview from '../components/AutoScrollPreview';
import { parseEthFromInput } from '../utils/parseEthFromInput';

const Index = () => {
  const {
    hasSigner,
    connect,
    accounts,
    currentBlock,
    writeContract,
    minPrice,
    addTransaction,
    endBlock,
  } = useAppContext();
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, errors } = useForm({
    mode: 'onChange',
  });
  const { price, amount } = watch();
  const defaultPrice = minPrice
    ? ethers.utils.formatEther(minPrice.mul(1000).div(999))
    : 0;

  const mint = async () => {
    // if (!accounts[0]) return;

    try {
      const parsedPrice = parseEthFromInput(price);

      const tx = await writeContract.mint(accounts[0], amount, {
        value: parsedPrice.mul(amount),
      });

      addTransaction({ amount, price: parsedPrice, tx });

      router.push(`/address/${accounts[0]}`);
    } catch (e) {
      console.error(e);
      // alert(e.message.match(/"message":"execution reverted:(.*)"$/gm));
      alert(e.message);
    }
  };

  useEffect(() => {
    if (!parseEthFromInput(price).gte(minPrice)) {
      setValue('price', ethers.utils.formatEther(minPrice.mul(1000).div(999)));
    }
  }, [minPrice]);

  return (
    <div className="container">
      <AutoScrollPreview {...{ currentBlock, price, amount }} />
      <div className="control">
        <div className="control-inner">
          {' '}
          {currentBlock ? (
            <>
              {' '}
              <div>
                First of its kind ethereum native generative geometric art
                experiment
              </div>
              <p>Next Block: {currentBlock + 1}</p>
              <p>{endBlock - currentBlock} blocks remaining</p>
              <form onSubmit={handleSubmit(mint)}>
                {/* register your input into the hook by invoking the "register" function */}
                <label>
                  <span className="dimmed">How many?</span>
                  <input
                    name="amount"
                    defaultValue="1"
                    min={1}
                    type="number"
                    ref={register({ required: true })}
                    data-errors={!!errors.amount}
                  />
                </label>

                <label className="mt-3 mb-3 d-block">
                  <span className="dimmed">Price per Token Ξ</span>
                  <input
                    name="price"
                    defaultValue={defaultPrice}
                    type="string"
                    ref={register({
                      required: true,
                      pattern: /\d{1,3}(.\d{1,18})?/g,
                    })}
                    data-errors={!!errors.price}
                  />
                </label>

                <span className="mb-3 d-block">
                  Total: Ξ
                  {ethers.utils.formatEther(
                    parseEthFromInput(price).mul(amount || '1'),
                  )}
                </span>

                {!accounts[0] && hasSigner && (
                  <button className="w-100 button--primary" onClick={connect}>
                    Connect
                  </button>
                )}

                {accounts[0] && hasSigner && (
                  <>
                    <button
                      className="w-100 button--primary"
                      disabled={!accounts[0] || !!Object.keys(errors).length}
                      type="submit"
                    >
                      Mint
                    </button>
                    <small className="mt-2 d-block">
                      It is not guaranteed that you actually catch the figures
                      that are highlighted.
                      <Link href="/about">
                        <a className="link"> Read more here.</a>
                      </Link>
                    </small>
                  </>
                )}

                {!hasSigner && 'Please install Metamask'}
              </form>
            </>
          ) : (
            <h1>Not connected</h1>
          )}
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
        }

        .control {
          position: relative;
          padding: 10px;
          min-width: 15em;
        }

        @media (max-width: 552px) {
          .control {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
          }
          .control input {
            background-color: rgba(18, 18, 18);
          }
        }

        input {
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.25);
          font-family: monospace;
          font-size: 1.5em;
          padding: 0.375em 0.5em 0.25em;
          color: white;
          margin-top: 4px;
          width: calc(100% - 1.25em);
        }
        input:focus {
          border: 1px solid white;
        }
        input[data-errors='true'] {
          border: 1px solid red;
        }
      `}</style>
    </div>
  );
};

export default Index;
