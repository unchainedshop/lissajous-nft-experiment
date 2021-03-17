import { useRouter } from 'next/router';
import { simulateLissajousArgs, colorFromPrice } from '@private/contracts';
import { useAppContext } from '../../components/AppContextWrapper';
import { useEffect } from 'react';
import LissajousSvg from '../../components/LissajousSvg';
import Link from 'next/link';

let preventRefresh = false;

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

  useEffect(() => {
    const onbeforeunload = (e) => {
      e.preventDefault();
      return 'When you leave, the pending transactions will not be visible until they are mined.';
    };

    if (transactions.length && !preventRefresh) {
      preventRefresh = true;
      window.addEventListener('beforeunload', onbeforeunload);
    }

    if (transactions.length === 0 && preventRefresh) {
      preventRefresh = false;
      window.removeEventListener('beforeunload', onbeforeunload);
    }

    return () => {
      preventRefresh = false;
      window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, [transactions.length]);

  console.log(transactions);

  return (
    <div>
      <div>
        <h1 className="text-center">
          {isOwner ? 'Your Tokens' : `Tokens of ${router.query.address}`}
        </h1>
        {isOwner && transactions.length > 0 && (
          <>
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

        <div className="d-flex align-items-center justify-content-around flex-wrap">
          {tokens.map((token, i) => (
            <div className="figure" key={i}>
              <Link href={`/token/${token.id}`}>
                <a>
                  <LissajousSvg
                    gradient
                    {...simulateLissajousArgs(token.block, token.price)}
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .figure {
          position: relative;
          display: inline-block;
          height: 128px;
          width: 128px;
          margin: 10px;
        }
      `}</style>
    </div>
  );
};

export default Address;
