import React, { useState, useContext, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  addresses,
  LissajousToken,
  LissajousToken__factory,
} from '@private/contracts';

type Transaction = {
  amount: number;
  price: BigNumber;
  tx?: ethers.ContractTransaction;
};

export const AppContext = React.createContext<{
  hasSigner?: boolean;
  accounts: string[];
  totalSupply?: number;
  currentBlock?: number;
  minPrice?: BigNumber;
  connect: () => Promise<void>;
  readContract?: LissajousToken;
  writeContract?: LissajousToken;
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
}>({
  accounts: [],
  connect: () => null,
  transactions: [],
  addTransaction: () => null,
});

export const useAppContext = () => useContext(AppContext);

const ethereum = (global as any).ethereum;

const unique = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);

export const AppContextWrapper = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    // { amount: 5, price: ethers.utils.parseEther('2') },
  ]);
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

      ethereum?.on('chainChanged', () => window.location.reload());

      if (chainId !== 4) {
        alert('Please switch to Rinkeby');
        return;
      }

      const contractAddress = addresses[chainId].LissajousToken;
      setContractAddress(addresses[chainId].LissajousToken);

      const blockNumber = await scopedProvider.getBlockNumber();

      scopedProvider.on('chainChanged', (chainId) => {
        console.log('chainChanged');
        setChainId(chainId);
        setContractAddress(addresses[chainId].LissajousToken);
      });

      const contract = LissajousToken__factory.connect(
        contractAddress,
        scopedProvider,
      );

      setReadContract(contract);

      const onBlock = async (blockNumber) => {
        setCurrentBlock(blockNumber);
        const block = await scopedProvider.getBlock(blockNumber);

        setLastBlockTimestamps((oldTimetamps) =>
          unique([block.timestamp, ...oldTimetamps]).slice(0, 10),
        );
        const minPrice = await contract.currentMinPrice();
        setMinPrice(minPrice);
      };
      onBlock(blockNumber);
      scopedProvider.on('block', onBlock);

      setTotalSupply((await contract.totalSupply()).toNumber());

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

  const addTransaction = (tx) => {
    setTransactions((current) => [tx, ...current]);
    tx.wait().then(() => {
      setTransactions((current) =>
        current.filter((t) => t.tx.nonce !== tx.nonce && tx.from !== t.tx.from),
      );
    });
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
        transactions,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
