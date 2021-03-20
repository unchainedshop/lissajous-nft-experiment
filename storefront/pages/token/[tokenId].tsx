import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import { useAppContext } from '../../components/AppContextWrapper';
import LissajousSvg from '../../components/LissajousSvg';

const Token = () => {
  const { readContract } = useAppContext();
  const router = useRouter();
  const [block, setBlock] = useState(null);
  // const [price, setPrice] = useState(null);
  const [owner, setOwner] = useState(null);
  const [color, setColor] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [lissajousArguments, setLissajousArguments] = useState(null);

  const tokenId = router.query.tokenId as string;

  useEffect(() => {
    (async () => {
      if (!readContract) return;
      setBlock((await readContract.tokenMintBlock(tokenId)).toNumber());
      // setPrice(await readContract.tokenMintValue(tokenId));
      setColor((await readContract.tokenColor(tokenId)).replace('0x', '#'));
      setOwner(await readContract.ownerOf(tokenId));
      setLissajousArguments(await readContract.lissajousArguments(tokenId));
      setAspectRatio(await readContract.aspectRatio(tokenId));
    })();
  }, [tokenId, readContract]);

  return (
    <div>
      <Head>
        <title>
          Lissajous.art NFT #{tokenId} - Ethereum native generative geometric
          art experiment
        </title>
        <meta
          name="twitter:description"
          content={
            lissajousArguments?.rainbow
              ? `This is a super rare Lissajous Figure Rainbow NFT. It is part of an Ethereum Native Generative Geometric Art Experiment. Only a few randomly selected blocks can produce Rainbow Tokens.`
              : `This Lissajous Figure NFT is part of an Ethereum Native Generative Geometric Art Experiment. The block it was minted determines the figure and the price determines the color.`
          }
        />
        <meta
          name="twitter:image"
          content={`https://lissajous.art/api/token/${tokenId}.svg`}
        ></meta>
      </Head>
      <div className="d-flex align-items-center justify-content-between flex-wrap flex-column">
        <div className="figure">
          {lissajousArguments && (
            <LissajousSvg
              frequenceX={lissajousArguments?.frequenceX}
              frequenceY={lissajousArguments?.frequenceY}
              phaseShift={(1 / 16) * lissajousArguments?.phaseShift}
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
            <span className="dimmed mr-3">Color:</span>{' '}
            <span>Ξ{color || '?'}</span>
          </div>
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Aspect Ratio:</span>{' '}
            <span>
              {aspectRatio ? `${aspectRatio.width}/${aspectRatio.height}` : '?'}
            </span>
          </div>
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Frequence X:</span>{' '}
            <span>{lissajousArguments?.frequenceX || '?'}</span>
          </div>
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Frequence Y:</span>{' '}
            <span>{lissajousArguments?.frequenceY || '?'}</span>
          </div>
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Phase Shift:</span>{' '}
            <span>
              {lissajousArguments?.phaseShift
                ? `${lissajousArguments.phaseShift}/16`
                : '?'}
            </span>
          </div>
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Start Step:</span>{' '}
            <span>{lissajousArguments?.startStep || '?'}</span>
          </div>
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Total Steps:</span>{' '}
            <span>{lissajousArguments?.totalSteps || '?'}</span>
          </div>
          <div className="mt-2 d-flex justify-content-between flex-wrap">
            <span className="dimmed mr-3">Rainbow:</span>{' '}
            <span>{lissajousArguments?.rainbow ? 'yes' : 'no'}</span>
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
