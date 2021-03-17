import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Link from 'next/link';

import { simulateLissajousArgs } from '@private/contracts';
import { useAppContext } from '../../components/AppContextWrapper';
import LissajousSvg from '../../components/LissajousSvg';

const Token = () => {
  const { readContract } = useAppContext();
  const router = useRouter();
  const [block, setBlock] = useState(null);
  const [price, setPrice] = useState(null);
  const [owner, setOwner] = useState(null);

  const tokenId = router.query.tokenId as string;

  useEffect(() => {
    (async () => {
      if (!readContract) return;
      setBlock((await readContract.tokenMintBlock(tokenId)).toNumber());
      setPrice(await readContract.tokenMintValue(tokenId));
      setOwner(await readContract.ownerOf(tokenId));
    })();
  }, [tokenId, readContract]);

  return (
    <div>
      <div>
        <div className="figure">
          {block && price && (
            <LissajousSvg {...simulateLissajousArgs(block, price)} />
          )}
        </div>
        <div>Price: Ξ{price ? ethers.utils.formatEther(price) : '?'}</div>
        <div>Block: {block}</div>
        <div>
          Owner:{' '}
          <Link href={`/address/${owner}`}>
            <a>{owner}</a>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .figure {
          position: relative;
          display: inline-block;
          height: 512px;
          width: 512px;
          margin: 10px;
          border: 1px solid darkgrey;
        }
      `}</style>
    </div>
  );
};

export default Token;
