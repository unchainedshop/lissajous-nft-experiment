import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { simulateLissajousArgs } from '@private/contracts';
import LissajousSvg from './LissajousSvg';
import { parseEthFromInput } from '../utils/parseEthFromInput';
import Link from 'next/link';

let renderTimestamp: Date;

const isMarked = (currentBlock, startBlock, i, amount) => {
  const currentFigure = startBlock + i;
  const firstMarked = currentBlock + 1;
  const lastMarked = currentBlock + parseInt(amount, 10);

  return firstMarked <= currentFigure && currentFigure <= lastMarked;
};

const AutoScrollPreview = ({ currentBlock, amount, price }) => {
  const scrollingEl = useRef(null);
  const [onLoadBlock, setOnLoadBlock] = useState<number>(null);
  const [startBlock, setStartBlock] = useState<number>(null);

  const blockTime = 15 * 1000;

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

  console.log(startBlock);

  useEffect(() => {
    if (currentBlock && !onLoadBlock) setOnLoadBlock(() => currentBlock);
  }, [currentBlock]);

  useLayoutEffect(() => {
    if (onLoadBlock) {
      const innerWidth = scrollingEl.current.getBoundingClientRect().width;
      const figuresPerRow = Math.floor(innerWidth / (128 + 10));
      console.log(figuresPerRow);
      setStartBlock(onLoadBlock - 2 * figuresPerRow);
    }
  }, [onLoadBlock]);

  return (
    <div className="holder">
      <div className="holder-inner" ref={scrollingEl}>
        {startBlock &&
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

        .holder {
          width: 100%;
          max-height: calc(100vh - 2em);
          overflow: hidden;
        }

        .holder-inner {
          min-width: 100%;

      `}</style>
    </div>
  );
};

export default AutoScrollPreview;
