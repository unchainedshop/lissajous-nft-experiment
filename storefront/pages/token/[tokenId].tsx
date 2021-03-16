import { useRouter } from 'next/router';
import { simulateLissajousArgs } from '@private/contracts';
import { useAppContext } from '../../components/AppContextWrapper';
import { useEffect, useState } from 'react';
import LissajousSvg from '../../components/LissajousSvg';

const Token = () => {
  const router = useRouter();
  const [args, setArgs] = useState(null);

  const tokenId = router.query.tokenId as string;

  const { readContract } = useAppContext();

  useEffect(() => {
    (async () => {
      const block = await readContract.tokenMintBlock(tokenId);
      const value = await readContract.tokenMintValue(tokenId);

      setArgs(simulateLissajousArgs(block.toNumber(), value));
    })();
  }, [tokenId]);

  return (
    <div>
      <div>
        <div className="figure">
          <LissajousSvg {...args} />
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
