import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  addresses,
  LissajousToken,
  LissajousToken__factory,
} from '@private/contracts';

export const AppContext = React.createContext<{
  accounts: string[];
  totalSupply?: number;
  currentBlock?: number;
  connect: () => Promise<void>;
  readContract?: LissajousToken;
  writeContract?: LissajousToken;
}>({
  accounts: [],
  totalSupply: null,
  currentBlock: null,
  connect: () => null,
  readContract: null,
  writeContract: null,
});

export const useAppContext = () => useContext(AppContext);

const ethereum = (global as any).ethereum;

export const AppContextWrapper = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState(0);
  const [totalSupply, setTotalSupply] = useState<number>();
  const [currentBlock, setCurrentBlock] = useState<number>();
  const [contractAddress, setContractAddress] = useState<string>('');
  const [readContract, setReadContract] = useState<LissajousToken>();
  const [writeContract, setWriteContract] = useState<LissajousToken>();

  useEffect(() => {
    (async () => {
      if (!ethereum) {
        alert('Please install metamask');
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      setChainId(chainId);
      const contractAddress = addresses[chainId].LissajousToken;
      setContractAddress(addresses[chainId].LissajousToken);

      setProvider(provider);

      const accounts = await (window as any).ethereum.request({
        method: 'eth_accounts',
      });
      setAccounts(accounts);

      provider.on('accountsChanged', (accounts) => {
        console.log('accounts changed');
        setAccounts(accounts);
      });

      provider.on('chainChanged', (chainId) => {
        console.log('accounts changed');
        setChainId(chainId);
        setContractAddress(addresses[chainId].LissajousToken);
      });

      if (chainId !== 4) {
        alert('Please switch to Rinkeby');
      }

      // const blockNumber = await provider.getBlockNumber();

      console.log(contractAddress, provider);

      const contract = LissajousToken__factory.connect(
        contractAddress,
        provider,
      );
      setReadContract(contract);

      // const baseUri = await contract.baseURI();
      setTotalSupply((await contract.totalSupply()).toNumber());

      provider.on('block', (blockNumber) => {
        // console.log('newBlcok');
        setCurrentBlock(blockNumber);
      });

      contract.on('Transfer', async (from, to, tokenId) => {
        console.log('Transfer', { from, to, tokenId });
        setTotalSupply((await contract.totalSupply()).toNumber());
      });
    })();
  }, []);

  useEffect(() => {
    if (!provider) return;

    (async () => {
      const signer = await provider.getSigner();

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
        accounts,
        totalSupply,
        currentBlock,
        connect,
        readContract,
        writeContract,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
