import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';

import {
  addresses,
  LissajousToken,
  LissajousToken__factory,
} from '@private/contracts';
import LissajousSvg from '../components/LissajousSvg';

const colors = [
  '#ffd700', // Gold
  '#55FF55', // light green
  '#FFFF55', // yellow
  '#FF55FF', // light magenta
  '#55FFFF', // light cyan
  '#FF5555', // light red
  '#5555FF', // ligth blue
  '#FFFFFF', // white
  '#AAAAAA', // light gray
  '#00AA00', // green
  '#AA5500', // brown
  '#AA00AA', // magenta
  '#00AAAA', // cyan
  '#0000AA', // blue
  '#AA0000', // red
  '#555555', // dark grey
];

const aspectRatios = [
  { h: 16, w: 16 },
  { h: 16, w: 9 },
  { h: 9, w: 16 },
  { h: 12, w: 16 },
  { h: 16, w: 12 },
  { h: 3, w: 16 },
  { h: 16, w: 3 },
  { h: 10, w: 10 },
];

const Index = () => {
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState<LissajousToken>();
  const [totalSupply, setTotalSupply] = useState<number>();
  const [currentBlock, setCurrentBlock] = useState<number>();
  const [lissajousArgs, setLissajousArgs] = useState<Record<string, any>>({});

  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
      );
      const { chainId } = await provider.getNetwork();
      const signer = await provider.getSigner();

      setAddress(await signer.getAddress());

      // const blockNumber = await provider.getBlockNumber();

      const contract = LissajousToken__factory.connect(
        addresses[chainId].LissajousToken,
        signer,
      );

      setContract(contract);

      // const baseUri = await contract.baseURI();
      setTotalSupply((await contract.totalSupply()).toNumber());

      provider.on('block', (blockNumber) => {
        setCurrentBlock(blockNumber);
      });

      contract.on('Transfer', async (from, to, tokenId) => {
        console.log('Transfer', { from, to, tokenId });
        setTotalSupply((await contract.totalSupply()).toNumber());
      });
    })();
  }, []);

  useEffect(() => {
    if (!currentBlock) return;

    const currentHash = ethers.utils.keccak256(
      ethers.utils.hexlify(currentBlock),
    );
    const array = ethers.utils.arrayify(currentHash);

    const aspectRatio = aspectRatios[array[0] % 8];

    const height = aspectRatio.h;
    const width = aspectRatio.w;
    const frequenceX = (array[2] % 16) + 1;
    const frequenceY = (array[3] % 16) + 1;
    const phaseShift = (1 / 16) * (array[5] % 16);
    const totalSteps = (array[6] % 16) + 1;
    const startStep = (array[7] % 16) + 1;
    const lineWidth = 3;
    const strokeColor = colors[array[6] % 16];

    setLissajousArgs({
      height,
      width,
      frequenceX,
      frequenceY,
      lineWidth,
      phaseShift,
      totalSteps,
      strokeColor,
      startStep,
    });
  }, [currentBlock]);

  console.log(lissajousArgs);

  const mint = async () => {
    await contract.mint(address, 1, { value: BigNumber.from('10').pow('17') });
  };

  return (
    <div>
      <h1>LissajousToken</h1>
      <h2>{totalSupply} already minted</h2>
      <h2>Block Number: {currentBlock}</h2>
      <p>
        <button onClick={mint}>
          <i>Mint!</i>
        </button>
      </p>
      <div className="figure">
        {lissajousArgs && <LissajousSvg {...lissajousArgs} />}
      </div>
      <style jsx>{`
        :global(html),
        :global(body) {
          background-color: black;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          color: white;
        }
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

export default Index;
