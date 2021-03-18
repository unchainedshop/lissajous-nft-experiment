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
    startBlock,
    endBlock,
    writeContract,
    minPrice,
    addTransaction,
  } = useAppContext();
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, errors } = useForm({
    mode: 'onChange',
  });
  const { price, amount } = watch();
  const defaultPrice = minPrice
    ? ethers.utils.formatEther(minPrice.mul(1000).div(999))
    : 0;

  const hasStarted = currentBlock >= startBlock && currentBlock < endBlock;
  const hasEnded = currentBlock >= endBlock;

  let isMobile = false;
  let location: Location;

  if (typeof window !== 'undefined') {
    isMobile = !!navigator?.userAgent.toLowerCase().match(/mobile/i);
    location = document.location;
  }

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
          <div>
            First of its kind ethereum native generative geometric art
            experiment
          </div>
          {!currentBlock && <h1>No connection to Ethereum Network :(</h1>}

          {currentBlock && !hasStarted && (
            <>
              <h1>The experiment has not yet started</h1>
              <p>{startBlock - currentBlock} Blocks remaining ...</p>
            </>
          )}

          {currentBlock && hasEnded && (
            <>
              <h1>The experiment is over!</h1>
            </>
          )}

          {currentBlock && hasStarted && (
            <>
              <p>
                Next Block: {currentBlock + 1} <br />
                <small>{endBlock - currentBlock} blocks remaining</small>
              </p>

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

                {!accounts[0] && hasSigner && (
                  <button className="w-100 button--primary" onClick={connect}>
                    Connect
                  </button>
                )}

                {accounts[0] && hasSigner && (
                  <>
                    <span className="mb-3 d-block">
                      Total: Ξ
                      {ethers.utils.formatEther(
                        parseEthFromInput(price).mul(amount || '1'),
                      )}
                    </span>
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
              </form>
            </>
          )}
          {!hasSigner && isMobile && (
            <p>
              {/* eslint-disable-next-line react/jsx-no-target-blank */}
              <a
                href={`https://metamask.app.link/dapp/${location?.host}/${location?.pathname}`}
                target="_blank"
                rel="noopener"
                className="button"
              >
                Open in MetaMask
              </a>
            </p>
          )}
          {!hasSigner && !isMobile && (
            <>
              <p>
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a
                  href="https://metamask.io"
                  target="_blank"
                  rel="noopener"
                  className="button"
                >
                  Install MetaMask
                </a>
                <br />
                Or scan the following QR Code with your Mobile Phone:
              </p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=https%3A//metamask.app.link/dapp/${location?.host}/${location?.pathname}&qzone=1&margin=0&size=240x240&ecc=L`}
              />
            </>
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

        .button {
          border: 1px solid white;
          width: 100%;
          display: block;
          padding: 0.2em 0.5em;
          text-align: center;
          box-sizing: border-box;
        }

        .button:hover {
          color: black;
          background-color: white;
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
