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

  useEffect(() => {
    (async () => {
      if (!ethereum) {
        alert('Please install metamask');
      }

      const provider = ethereum
        ? new ethers.providers.Web3Provider(ethereum)
        : ethers.getDefaultProvider('rinkeby', {
            alchemy: 'IAShCvvktlU_ZEHJOvhLYXngadTDjBdX',
          });

      const { chainId } = await provider.getNetwork();
      setChainId(chainId);
      const contractAddress = addresses[chainId].LissajousToken;
      setContractAddress(addresses[chainId].LissajousToken);

      setProvider(provider);

      provider.on('chainChanged', (chainId) => {
        console.log('chainChanged');
        setChainId(chainId);
        setContractAddress(addresses[chainId].LissajousToken);
      });

      if (chainId !== 4) {
        alert('Please switch to Rinkeby');
      }

      const contract = LissajousToken__factory.connect(
        contractAddress,
        provider,
      );
      setReadContract(contract);

      setTotalSupply((await contract.totalSupply()).toNumber());

      provider.on('block', async (blockNumber) => {
        // console.log('newBlcok');
        const minPrice = await contract.currentMinPrice();
        setCurrentBlock(blockNumber);
        setMinPrice(minPrice);
      });

      contract.on('Transfer', async (from, to, tokenId) => {
        console.log('Transfer', { from, to, tokenId });
        setTotalSupply((await contract.totalSupply()).toNumber());
      });

      if (ethereum) {
        const accounts = await ethereum.request({
          method: 'eth_accounts',
        });

        setAccounts(accounts);

        provider.on('accountsChanged', (accounts) => {
          console.log('accounts changed');
          setAccounts(accounts);
        });
      }
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
