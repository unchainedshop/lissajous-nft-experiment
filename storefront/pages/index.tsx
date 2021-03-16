import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ethers } from 'ethers';

import { simulateLissajousArgs } from '@private/contracts';
import LissajousSvg from '../components/LissajousSvg';
import { useAppContext } from '../components/AppContextWrapper';
import { useRouter } from 'next/router';

let renderTimestamp: Date;

const Index = () => {
  const {
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
                            ? ethers.utils.parseEther(price || '0')
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
          <h2>Next Block: {currentBlock + 1}</h2>
          <form onSubmit={handleSubmit(mint)}>
            {/* register your input into the hook by invoking the "register" function */}
            <p>
              <label>
                How many?
                <input
                  disabled={!accounts[0]}
                  name="amount"
                  defaultValue="1"
                  min={1}
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
              Mint
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

        input {
          background-color: transparent;
          border: 1px solid white;
          font-family: monospace;
          font-size: 1.5em;
          padding: 0.2em 0.2em;
          color: white;
          width: 100%;
        }

        button {
          width: 100%;
          background-color: white;
          border: 1px solid white;
          font-size: 1.5em;
          padding: 0.1em 0.2em;
          color: black;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Index;
