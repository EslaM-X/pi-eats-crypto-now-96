
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePiAuth } from './PiAuthContext';

// Transaction type
export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'reward' | 'exchange';
  amount: number;
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  recipient?: string;
  sender?: string;
}

interface WalletContextType {
  piBalance: number;
  ptmBalance: number;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  resetWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock initial data
const initialTransactions: Transaction[] = [
  {
    id: 'tx1',
    type: 'receive',
    amount: 5.0,
    description: 'Welcome bonus',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: 'tx2',
    type: 'reward',
    amount: 0.5,
    description: 'First order reward',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: 'tx3',
    type: 'send',
    amount: 2.5,
    description: 'Payment to Cairo Kebab',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'completed',
    recipient: 'Cairo Kebab'
  }
];

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePiAuth();
  const [piBalance, setPiBalance] = useState(5.0);
  const [ptmBalance, setPtmBalance] = useState(10.0);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  
  // Load wallet data when user changes
  useEffect(() => {
    if (user) {
      const loadWalletData = () => {
        // Load saved wallet data from localStorage
        const walletKey = `wallet_${user.uid}`;
        const savedWallet = localStorage.getItem(walletKey);
        
        if (savedWallet) {
          try {
            const parsedWallet = JSON.parse(savedWallet);
            
            // Parse date strings back to Date objects
            const processedTransactions = parsedWallet.transactions.map((tx: any) => ({
              ...tx,
              timestamp: new Date(tx.timestamp)
            }));
            
            setPiBalance(parsedWallet.piBalance || 5.0);
            setPtmBalance(parsedWallet.ptmBalance || 10.0);
            setTransactions(processedTransactions);
          } catch (error) {
            console.error('Failed to parse wallet data:', error);
            // Reset to defaults on error
            setPiBalance(5.0);
            setPtmBalance(10.0);
            setTransactions(initialTransactions);
            localStorage.removeItem(walletKey);
          }
        }
      };
      
      loadWalletData();
    } else {
      // Reset when logged out
      setPiBalance(5.0);
      setPtmBalance(10.0);
      setTransactions(initialTransactions);
    }
  }, [user]);
  
  // Save wallet data when it changes
  useEffect(() => {
    if (user) {
      const walletKey = `wallet_${user.uid}`;
      const walletData = {
        piBalance,
        ptmBalance,
        transactions
      };
      
      localStorage.setItem(walletKey, JSON.stringify(walletData));
    }
  }, [user, piBalance, ptmBalance, transactions]);
  
  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}`,
      timestamp: new Date()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update balance based on transaction type
    if (transaction.type === 'receive' || transaction.type === 'reward') {
      setPiBalance(prev => prev + transaction.amount);
    } else if (transaction.type === 'send') {
      setPiBalance(prev => prev - transaction.amount);
    }
  };
  
  // Reset wallet to initial state
  const resetWallet = () => {
    setPiBalance(5.0);
    setPtmBalance(10.0);
    setTransactions(initialTransactions);
    
    if (user) {
      const walletKey = `wallet_${user.uid}`;
      localStorage.removeItem(walletKey);
    }
  };
  
  return (
    <WalletContext.Provider value={{
      piBalance,
      ptmBalance,
      transactions,
      addTransaction,
      resetWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
