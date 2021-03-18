import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ethers } from 'ethers';

import { simulateLissajousArgs } from '@private/contracts';
import LissajousSvg from '../components/LissajousSvg';
import { useAppContext } from '../components/AppContextWrapper';
import { useRouter } from 'next/router';

let renderTimestamp: Date;

const cleanEthInput = (input: string) => {
  if (!input) return '0';

  if (input.includes('.')) {
    const [ints, decimals] = input.split('.');
    return `${ints}.${decimals.slice(0, 18)}`;
  } else {
    return input;
  }
};

const parseEthFromInput = (price: string) =>
  ethers.utils.parseEther(cleanEthInput(price));

const Index = () => {
  const {
    hasSigner,
    connect,
    accounts,
    currentBlock,
    writeContract,
    minPrice,
    addTransaction,
  } = useAppContext();
  const router = useRouter();
  const [onLoadBlock, setOnLoadBlock] = useState<number>(null);
  const scrollingEl = useRef(null);
  const { register, handleSubmit, watch, setValue } = useForm();
  const { price, amount } = watch();
  const defaultPrice = minPrice
    ? ethers.utils.formatEther(minPrice.mul(1000).div(999))
    : 0;

  const blockTime = 15 * 1000;

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
    if (currentBlock && !onLoadBlock) setOnLoadBlock(() => currentBlock);
  }, [currentBlock]);

  useEffect(() => {
    if (!parseEthFromInput(price).gte(minPrice)) {
      setValue('price', ethers.utils.formatEther(minPrice.mul(1000).div(999)));
    }
  }, [minPrice]);

  useLayoutEffect(() => {
    renderTimestamp = new Date();

    let animationFrame;

    const scrollInner = () => {
      const innerWidth = scrollingEl.current.getBoundingClientRect().width;
      const figuresPerRow = Math.floor(innerWidth / (128 + 10));
      const now = new Date();
      const timeSinceRender = now.getTime() - renderTimestamp.getTime();
      const timeForOneRow = figuresPerRow * blockTime;
      const rowHeight = 128 + 10;
      const currentScroll = Math.floor(
        -(timeSinceRender / timeForOneRow) * rowHeight,
      );
      scrollingEl.current.style.transform = `translateY(${currentScroll}px)`;
      animationFrame = window.requestAnimationFrame(scrollInner);
    };
    animationFrame = window.requestAnimationFrame(scrollInner);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const startBlock = onLoadBlock - 8;

  const isMarked = (currentBlock, startBlock, i, amount) => {
    const currentFigure = startBlock + i;
    const firstMarked = currentBlock + 1;
    const lastMarked = currentBlock + parseInt(amount, 10);

    return firstMarked <= currentFigure && currentFigure <= lastMarked;
  };

  return (
    <div className="container">
      <div className="holder">
        <div className="holder-inner" ref={scrollingEl}>
          {onLoadBlock &&
            Array(128)
              .fill(0)
              .map((_, i) => (
                <div
                  className="figure"
                  key={startBlock + i}
                  data-current={isMarked(currentBlock, startBlock, i, amount)}
                >
                  <Link href={`block/${startBlock + i}`}>
                    <a>
                      <LissajousSvg
                        {...{
                          ...simulateLissajousArgs(
                            startBlock + i,
                            isMarked(currentBlock, startBlock, i, amount)
                              ? parseEthFromInput(price)
                              : undefined,
                          ),
                          gradient:
                            isMarked(currentBlock, startBlock, i, amount) &&
                            amount < 4,
                        }}
                      />
                    </a>
                  </Link>
                </div>
              ))}
        </div>
      </div>

      <div className="control">
        <div className="control-inner">
          {' '}
          {currentBlock ? (
            <>
              {' '}
              <div>
                First of kind ethereum native generative geometric art
                experiment
              </div>
              <pre>Next Block: {currentBlock + 1}</pre>
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
                      // pattern: /\d{1-3}(.\d{1-18})+/,
                    })}
                  />
                </label>

                <span className="mb-3 d-block">
                  Total: Ξ
                  {ethers.utils.formatEther(
                    parseEthFromInput(price).mul(amount || '1'),
                  )}
                </span>

                {!accounts[0] && hasSigner && (
                  <button onClick={connect}>Connect</button>
                )}

                {accounts[0] && hasSigner && (
                  <>
                    <button
                      className="w-100 button--primary"
                      disabled={!accounts[0]}
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
        .figure {
          position: relative;
          display: inline-block;
          height: 128px;
          width: 128px;
          margin: 5px;
          box-sizing: border-box;
        }

        .figure[data-current='true'] {
          // border: 1px solid lightgrey;
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
      `}</style>
    </div>
  );
};

export default Index;
