import { useRouter } from 'next/router';
import { simulateLissajousArgs, colorFromPrice } from '@private/contracts';
import { useAppContext } from '../../components/AppContextWrapper';
import { useEffect } from 'react';
import LissajousSvg from '../../components/LissajousSvg';
import Link from 'next/link';

const Address = () => {
  const router = useRouter();
  const {
    readContract,
    accounts,
    transactions,
    tokens,
    recordToken,
  } = useAppContext();

  const address = router.query.address as string;

  const isOwner = address === accounts[0];

  useEffect(() => {
    if (readContract) {
      (async () => {
        const balance = await readContract.balanceOf(address);

        const promises = Array(balance.toNumber())
          .fill(0)
          .map(async (_, i) => {
            const id = await readContract.tokenOfOwnerByIndex(address, i);

            const block = await readContract.tokenMintBlock(id);
            const price = await readContract.tokenMintValue(id);

            recordToken({
              block: block.toNumber(),
              price,
              owner: address,
              id,
            });
          });

        await Promise.all(promises);
      })();
    }
  }, [readContract]);

  return (
    <div>
      <div>
        {isOwner && transactions.length > 0 && (
          <>
            {console.log(transactions)}
            <h1>Pending Mints</h1>
            <div>
              {transactions.map(({ price, amount }) =>
                Array(amount)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      className="figure"
                      key={i}
                      style={{ color: colorFromPrice(price) }}
                    >
                      ???
                    </div>
                  )),
              )}
            </div>
          </>
        )}
        <h1>{isOwner ? 'Your Tokens' : `Tokens of ${router.query.address}`}</h1>
        {tokens
          .filter(({ owner }) => owner === address)
          .map((token, i) => (
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

export default Address;
