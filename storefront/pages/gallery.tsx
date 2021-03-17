import { simulateLissajousArgs } from '@private/contracts';
import { useAppContext } from '../components/AppContextWrapper';
import { useEffect } from 'react';
import LissajousSvg from '../components/LissajousSvg';
import Link from 'next/link';
import { BigNumber } from 'ethers';

const Gallery = () => {
  const { readContract, tokens, recordToken } = useAppContext();

  useEffect(() => {
    if (readContract) {
      (async () => {
        const totalSupply = await readContract.totalSupply();

        const promises = Array(totalSupply.toNumber())
          .fill(0)
          .map(async (_, id) => {
            const block = await readContract.tokenMintBlock(id);
            const price = await readContract.tokenMintValue(id);
            const owner = await readContract.ownerOf(id);

            recordToken({
              block: block.toNumber(),
              price,
              owner,
              id: BigNumber.from(id),
            });
          });

        await Promise.all(promises);
      })();
    }
  }, [readContract]);

  return (
    <div>
      <div>
        <h1>Gallery</h1>
        {tokens.map((token, i) => (
          <div className="figure" key={i}>
            <Link href={`/token/${token.id}`}>
              <a>
                <LissajousSvg
                  {...simulateLissajousArgs(token.block, token.price)}
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

export default Gallery;
