import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Link from 'next/link';

import { useAppContext } from '../../components/AppContextWrapper';
import LissajousSvg from '../../components/LissajousSvg';

const Token = () => {
  const { readContract } = useAppContext();
  const router = useRouter();
  const [block, setBlock] = useState(null);
  const [price, setPrice] = useState(null);
  const [owner, setOwner] = useState(null);
  const [color, setColor] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [lissajousArguments, setLissajousArguments] = useState(null);

  console.log(color);

  const tokenId = router.query.tokenId as string;

  useEffect(() => {
    (async () => {
      if (!readContract) return;
      setBlock((await readContract.tokenMintBlock(tokenId)).toNumber());
      setPrice(await readContract.tokenMintValue(tokenId));
      setColor((await readContract.tokenColor(tokenId)).replace('0x', '#'));
      setOwner(await readContract.ownerOf(tokenId));
      setLissajousArguments(await readContract.lissajousArguments(tokenId));
      setAspectRatio(await readContract.aspectRatio(tokenId));
    })();
  }, [tokenId, readContract]);

  console.log(aspectRatio);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap flex-column">
        <div className="figure">
          {lissajousArguments && (
            <LissajousSvg
              frequenceX={lissajousArguments?.frequenceX}
              frequenceY={lissajousArguments?.frequenceY}
              phaseShift={lissajousArguments?.phaseShift}
              height={aspectRatio?.height}
              width={aspectRatio?.width}
              strokeColor={color}
              rainbow={lissajousArguments?.rainbow}
              startStep={lissajousArguments?.startStep}
              totalSteps={lissajousArguments?.totalSteps}
              animated
            />
          )}
        </div>
        <div className="details">
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Price:</span>{' '}
            <span>Ξ{price ? ethers.utils.formatEther(price) : '?'}</span>
          </div>
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Block:</span> <span>{block}</span>
          </div>
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Owner:</span>
            <Link href={`/address/${owner}`}>
              <a>{owner}</a>
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .details {
          max-width: 480px;
          margin: 10px 0;
        }
        .figure {
          position: relative;
          display: inline-block;
          height: 300px;
          width: 300px;
          margin: 10px;
        }
        @media (min-width: 768px) {
          .figure {
            height: 512px;
            width: 512px;
          }
        }
      `}</style>
    </div>
  );
};

export default Token;
