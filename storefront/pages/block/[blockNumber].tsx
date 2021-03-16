import { useRouter } from 'next/router';
import { simulateLissajousArgs } from '@private/contracts';
import { useAppContext } from '../../components/AppContextWrapper';
import { useEffect, useState } from 'react';
import LissajousSvg from '../../components/LissajousSvg';

const BlockNumber = () => {
  const router = useRouter();

  const blockNumber = router.query.blockNumber as string;

  const args = simulateLissajousArgs(parseInt(blockNumber, 10));

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

export default BlockNumber;
