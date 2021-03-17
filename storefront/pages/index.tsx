import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ethers } from 'ethers';

import { simulateLissajousArgs } from '@private/contracts';
import LissajousSvg from '../components/LissajousSvg';
import { useAppContext } from '../components/AppContextWrapper';
import { useRouter } from 'next/router';

let renderTimestamp: Date;

const cleanPrice = (priceInput: string) => {
  if (!priceInput) return '0';

  if (priceInput.includes('.')) {
    const [ints, decimals] = priceInput.split('.');
    return `${ints}.${decimals.slice(0, 18)}`;
  } else {
    return priceInput;
  }
};

const parseEthFromPrice = (price: string) =>
  ethers.utils.parseEther(cleanPrice(price));

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
  const { register, handleSubmit, watch } = useForm();
  const { price, amount } = watch();
  const defaultPrice = ethers.utils.formatEther(minPrice.mul(1000).div(999));

  const blockTime = 15 * 1000;

  const mint = async () => {
      // if (!accounts[0]) return;

    try {
      const tx = await writeContract.mint(accounts[0], amount, {
        value: ethers.utils.parseEther(price).mul(amount),
      });

      addTransaction(tx);

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

  useLayoutEffect(() => {
    console.log('useLayoutEffect');
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
                        {...(simulateLissajousArgs(
                          startBlock + i,
                          isMarked(currentBlock, startBlock, i, amount)
                            ? parseEthFromPrice(price)
                            : undefined,
                        ) as any)}
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
          <h1>LissajousToken</h1>
          {currentBlock ? (
            <>
              {' '}
              <h2>Next Block: {currentBlock + 1}</h2>
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

                  <span className="mb-3 d-block">Total: Ξ
                  {ethers.utils.formatEther(
                    parseEthFromPrice(price).mul(amount || '1'),
                  )}
                  </span>

                {!accounts[0] && hasSigner && (
                  <button onClick={connect}>Connect</button>
                )}

                {accounts[0] && hasSigner && (
                  <button className="w-100 button--primary" disabled={!accounts[0]} type="submit">
                    Mint
                  </button>
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
            position: absolute;
            left: 0;
            right: 0;
          }
          .control input {
            background-color: rgba(18,18,18);
          }
        }

        input {
          background-color: transparent;
          border: 1px solid rgba(255,255,255,.25);
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
