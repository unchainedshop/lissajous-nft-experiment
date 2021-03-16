import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';

export const AppContext = React.createContext({
  provider: null,
  setProvider: (f) => f,
  accounts: [],
  setAccounts: (f) => f,
  chainId: 0,
  setChainId: (f) => f,
  totalSupply: null,
  setTotalSupply: (f) => f,
  currentBlock: null,
  setCurrentBlock: (f) => f,
});

export const AppContextWrapper = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState(0);
  const [totalSupply, setTotalSupply] = useState<number>();
  const [currentBlock, setCurrentBlock] = useState<number>();

  return (
    <AppContext.Provider
      value={{
        provider,
        setProvider,
        accounts,
        setAccounts,
        chainId,
        setChainId,
        totalSupply,
        setTotalSupply,
        currentBlock,
        setCurrentBlock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
