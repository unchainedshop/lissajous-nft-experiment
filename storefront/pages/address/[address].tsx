import { useRouter } from 'next/router';
import { simulateLissajousArgs } from '@private/contracts';
import { useAppContext } from '../../components/AppContextWrapper';
import { useEffect, useState } from 'react';
import LissajousSvg from '../../components/LissajousSvg';

const Address = () => {
  const router = useRouter();
  const { readContract, accounts } = useAppContext();
  const [tokens, setTokens] = useState([]);

  const address = router.query.address as string;

  const isOwner = address === accounts[0];

  useEffect(() => {
    if (readContract) {
      (async () => {
        const balance = await readContract.balanceOf(address);

        const promises = Array(balance.toNumber())
          .fill(0)
          .map(async (_, i) => {
            const tokenId = await readContract.tokenOfOwnerByIndex(address, i);

            const block = await readContract.tokenMintBlock(tokenId);
            const value = await readContract.tokenMintValue(tokenId);

            return {
              block: block.toNumber(),
              value,
            };
          });

        const configs = await Promise.all(promises);

        console.log(configs);

        setTokens(
          configs.map(({ block, value }) =>
            simulateLissajousArgs(block, value),
          ),
        );
      })();
    }
  }, [readContract]);

  return (
    <div>
      <div>
        <h1>{isOwner ? 'Your Tokens' : `Tokens of ${router.query.address}`}</h1>
        {tokens.map((args, i) => (
          <div className="figure" key={i}>
            <LissajousSvg {...args} />
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

export default Address;
