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

type Token = {
  id: BigNumber;
  owner: string;
  price: BigNumber;
  block: number;
};

const chainIdMap = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
  5: 'goerli',
};

export const AppContext = React.createContext<{
  hasSigner?: boolean;
  accounts: string[];
  totalSupply?: number;
  currentBlock?: number;
  startBlock?: number;
  endBlock?: number;
  minPrice?: BigNumber;
  connect: () => Promise<void>;
  readContract?: LissajousToken;
  writeContract?: LissajousToken;
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  tokens: Token[];
  recordToken: (t: Token) => void;
  balance?: BigNumber;
  remainingBlocks?: number;
}>({
  accounts: [],
  connect: () => null,
  transactions: [],
  addTransaction: () => null,
  tokens: [],
  recordToken: () => null,
});

export const useAppContext = () => useContext(AppContext);

const ethereum = (global as any).ethereum;

const unique = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);
const uniqueToken = (tokens: Token[]) =>
  tokens.filter(
    ({ owner, block }, i, ts) =>
      ts.findIndex(
        (t) =>
          t.owner.toLowerCase() === owner.toLowerCase() && t.block === block,
      ) === i,
  );

export const AppContextWrapper = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    // { amount: 5, price: ethers.utils.parseEther('2') },
  ]);
  const [tokens, setTokens] = useState<Token[]>([]);
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
  const [balance, setBalance] = useState<BigNumber>();
  const [lastBlockTimestamps, setLastBlockTimestamps] = useState([]);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(0);

  const recordToken = (token: Token) =>
    setTokens((tokens) => uniqueToken([token, ...tokens]));

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
        alert(
          `You are on ${chainIdMap[chainId]}. Please switch to Rinkeby or you won't be able to mint here`,
        );
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

        if (accounts[0]) {
          const userBalance = await scopedProvider.getBalance(accounts[0]);
          setBalance(userBalance);
        }
      };
      onBlock(blockNumber);
      scopedProvider.on('block', onBlock);

      setStartBlock((await contract.startBlock()).toNumber());
      setEndBlock((await contract.endBlock()).toNumber());
      setTotalSupply((await contract.totalSupply()).toNumber());

      contract.on('Transfer', async (from, to, id) => {
        setTotalSupply((await contract.totalSupply()).toNumber());
        const block = await contract.tokenMintBlock(id);
        const price = await contract.tokenMintValue(id);
        recordToken({ block: block.toNumber(), price, owner: to, id });
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

  console.log({ startBlock });

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
    setTransactions((current) => [
      { ...tx, amount: parseInt(tx.amount.toString(), 10) }, // HACK to ensure amount is a number
      ...current,
    ]);
    tx.tx.wait().then(() => {
      setTransactions((current) =>
        current.filter(
          (t) => t.tx.nonce !== tx.tx.nonce && tx.tx.from !== t.tx.from,
        ),
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
        tokens,
        recordToken,
        balance,
        startBlock,
        endBlock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
