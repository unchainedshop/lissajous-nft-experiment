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

        const first = await readContract.tokenOfOwnerByIndex(
          address,
          balance.sub(1),
        );

        const firstBlock = await readContract.tokenMintBlock(first);
        const firstValue = await readContract.tokenMintValue(first);

        console.log({
          firstBlock: firstBlock.toNumber(),
          firstValue: ethers.utils.formatEther(firstValue),
        });

        setTokens([
          ...tokens,
          simulateLissajousArgs(firstBlock.toNumber(), firstValue),
        ]);

        console.log(balance);
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
