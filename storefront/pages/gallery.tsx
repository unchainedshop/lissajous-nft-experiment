import { useRouter } from 'next/router';
import { simulateLissajousArgs } from '@private/contracts';
import { useAppContext } from '../components/AppContextWrapper';
import { useEffect, useState } from 'react';
import LissajousSvg from '../components/LissajousSvg';
import Link from 'next/link';

const Gallery = () => {
  const router = useRouter();
  const { readContract } = useAppContext();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (readContract) {
      (async () => {
        const totalSupply = await readContract.totalSupply();

        const promises = Array(totalSupply.toNumber())
          .fill(0)
          .map(async (_, tokenId) => {
            const block = await readContract.tokenMintBlock(tokenId);
            const value = await readContract.tokenMintValue(tokenId);

            return {
              tokenId,
              block: block.toNumber(),
              value,
            };
          });

        const configs = await Promise.all(promises);

        setTokens(
          configs.map(({ tokenId, block, value }) => ({
            tokenId,
            args: simulateLissajousArgs(block, value),
          })),
        );
      })();
    }
  }, [readContract]);

  return (
    <div>
      <div>
        <h1>Gallery</h1>
        {tokens.map((token, i) => (
          <div className="figure" key={i}>
            <Link href={`/token/${token.tokenId}`}>
              <a>
                <LissajousSvg {...token.args} />
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
