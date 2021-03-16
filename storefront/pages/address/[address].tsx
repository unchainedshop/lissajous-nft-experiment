import { useRouter } from 'next/router';
import { simulateLissajousArgs } from '@private/contracts';
import { useAppContext } from '../../components/AppContextWrapper';
import { useEffect, useState } from 'react';
import LissajousSvg from '../../components/LissajousSvg';
import Link from 'next/link';

const Address = () => {
  const router = useRouter();
  const { readContract, accounts, transactions } = useAppContext();
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
        <h1>{isOwner ? 'Your Tokens' : `Tokens of ${router.query.address}`}</h1>
        {transactions.length > 0 && (
          <div>{transactions.length} pending transactions</div>
        )}
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

export default Address;
