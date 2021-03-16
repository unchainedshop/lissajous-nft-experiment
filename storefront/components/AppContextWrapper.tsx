import React, { useState, useContext, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  addresses,
  LissajousToken,
  LissajousToken__factory,
} from '@private/contracts';

export const AppContext = React.createContext<{
  hasSigner?: boolean;
  accounts: string[];
  totalSupply?: number;
  currentBlock?: number;
  minPrice?: BigNumber;
  connect: () => Promise<void>;
  readContract?: LissajousToken;
  writeContract?: LissajousToken;
}>({
  accounts: [],
  connect: () => null,
});

export const useAppContext = () => useContext(AppContext);

const ethereum = (global as any).ethereum;

const unique = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);

export const AppContextWrapper = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.BaseProvider>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState(0);
  const [totalSupply, setTotalSupply] = useState<number>();
  const [currentBlock, setCurrentBlock] = useState<number>();
  const [contractAddress, setContractAddress] = useState<string>('');
  const [readContract, setReadContract] = useState<LissajousToken>();
  const [writeContract, setWriteContract] = useState<LissajousToken>();
  const [minPrice, setMinPrice] = useState<BigNumber>(
    ethers.utils.parseEther('0.01'),
  );
  const [lastBlockTimestamps, setLastBlockTimestamps] = useState([]);

  useEffect(() => {
    (async () => {
      const scopedProvider = ethereum
        ? new ethers.providers.Web3Provider(ethereum)
        : ethers.getDefaultProvider('rinkeby', {
            alchemy: 'IAShCvvktlU_ZEHJOvhLYXngadTDjBdX',
          });

      setProvider(scopedProvider);

      const { chainId } = await scopedProvider.getNetwork();
      setChainId(chainId);
      const contractAddress = addresses[chainId].LissajousToken;
      setContractAddress(addresses[chainId].LissajousToken);

      const blockNumber = await scopedProvider.getBlockNumber();
      const onBlock = async (blockNumber) => {
        setCurrentBlock(blockNumber);

        if (scopedProvider) {
          const block = await scopedProvider.getBlock(blockNumber);

          setLastBlockTimestamps((oldTimetamps) =>
            unique([block.timestamp, ...oldTimetamps]).slice(0, 10),
          );
        }
        if (readContract) {
          const minPrice = await readContract.currentMinPrice();
          setMinPrice(minPrice);
        }
      };
      onBlock(blockNumber);

      scopedProvider.on('chainChanged', (chainId) => {
        console.log('chainChanged');
        setChainId(chainId);
        setContractAddress(addresses[chainId].LissajousToken);
      });

      if (chainId !== 4) {
        alert('Please switch to Rinkeby');
      }

      const contract = LissajousToken__factory.connect(
        contractAddress,
        scopedProvider,
      );
      setReadContract(contract);

      setTotalSupply((await contract.totalSupply()).toNumber());

      scopedProvider.on('block', onBlock);

      contract.on('Transfer', async (from, to, tokenId) => {
        console.log('Transfer', { from, to, tokenId });
        setTotalSupply((await contract.totalSupply()).toNumber());
      });

      if (ethereum) {
        const accounts = await ethereum.request({
          method: 'eth_accounts',
        });

        setAccounts(accounts);

        scopedProvider.on('accountsChanged', (accounts) => {
          console.log('accounts changed');
          setAccounts(accounts);
        });
      }

      // return () => {
      //   provider.off('block');
      // };
    })();
  }, []);

  useEffect(() => {
    if (!(provider as any)?.getSigner) return;

    (async () => {
      const signer = await (provider as any).getSigner();

      const contract = LissajousToken__factory.connect(contractAddress, signer);

      setWriteContract(contract);
    })();
  }, [accounts]);

  const connect = async () => {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await ethereum.request({
      method: 'eth_accounts',
    });
    setAccounts(accounts);
  };

  return (
    <AppContext.Provider
      value={{
        hasSigner: !!ethereum,
        accounts,
        totalSupply,
        currentBlock,
        connect,
        readContract,
        writeContract,
        minPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
