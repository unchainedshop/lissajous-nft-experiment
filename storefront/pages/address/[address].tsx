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

  return (
    <div>
      <div className="text-center">
        <h1>{isOwner ? 'Your Tokens' : `Tokens of ${router.query.address}`}</h1>
        {isOwner && transactions.length > 0 && (
          <>
            <h2>Pending Mints</h2>
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
                      <svg
                        width="45"
                        height="45"
                        viewBox="0 0 45 45"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#fff"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          transform="translate(1 1)"
                          strokeWidth="2"
                        >
                          <circle cx="22" cy="22" r="6" strokeOpacity="0">
                            <animate
                              attributeName="r"
                              begin="1.5s"
                              dur="3s"
                              values="6;22"
                              calcMode="linear"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="stroke-opacity"
                              begin="1.5s"
                              dur="3s"
                              values="1;0"
                              calcMode="linear"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="stroke-width"
                              begin="1.5s"
                              dur="3s"
                              values="2;0"
                              calcMode="linear"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle cx="22" cy="22" r="6" strokeOpacity="0">
                            <animate
                              attributeName="r"
                              begin="3s"
                              dur="3s"
                              values="6;22"
                              calcMode="linear"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="stroke-opacity"
                              begin="3s"
                              dur="3s"
                              values="1;0"
                              calcMode="linear"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="stroke-width"
                              begin="3s"
                              dur="3s"
                              values="2;0"
                              calcMode="linear"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle cx="22" cy="22" r="8">
                            <animate
                              attributeName="r"
                              begin="0s"
                              dur="1.5s"
                              values="6;1;2;3;4;5;6"
                              calcMode="linear"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      </svg>
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
