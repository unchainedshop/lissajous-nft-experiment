import { useRouter } from 'next/router';
import { simulateLissajousArgs } from '@private/contracts';
import LissajousSvg from '../../components/LissajousSvg';

const BlockNumber = () => {
  const router = useRouter();

  const blockNumber = router.query.blockNumber as string;

  const args = simulateLissajousArgs(parseInt(blockNumber, 10));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap flex-column">
        <div className="figure">
          <LissajousSvg {...args} animated />
        </div>
      </div>
      <style jsx>{`
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

export default BlockNumber;
