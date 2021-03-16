import { useRouter } from 'next/router';
import { simulateLissajousArgs } from '@private/contracts';
import { useAppContext } from '../../components/AppContextWrapper';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import LissajousSvg from '../../components/LissajousSvg';

const Address = () => {
  const router = useRouter();
  const { readContract } = useAppContext();
  const [tokens, setTokens] = useState([]);

  const address = router.query.address as string;

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
      {router.query.address}
      <div>
        {tokens.map((args, i) => (
          <LissajousSvg key={i} {...args} />
        ))}
      </div>
    </div>
  );
};

export default Address;
