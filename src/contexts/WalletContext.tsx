
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePiAuth } from './PiAuthContext';

export type TransactionType = 'send' | 'receive' | 'payment' | 'mining' | 'reward';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: Date;
  status: TransactionStatus;
  recipient?: string;
  sender?: string;
  metadata?: Record<string, any>;
}

// Define the wallet balance structure
interface WalletBalance {
  pi: number;
  ptm: number;
}

interface WalletContextType {
  balance: WalletBalance;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
  fetchBalance: () => void;
}

const WalletContext = createContext<WalletContextType>({
  balance: { pi: 0, ptm: 0 },
  transactions: [],
  addTransaction: () => {},
  updateTransactionStatus: () => {},
  fetchBalance: () => {}
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePiAuth();
  const [balance, setBalance] = useState<WalletBalance>({ pi: 0, ptm: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Function to fetch balance data
  const fetchBalance = () => {
    if (user) {
      const savedPiBalance = localStorage.getItem(`pi_balance_${user.uid}`);
      const savedPtmBalance = localStorage.getItem(`ptm_balance_${user.uid}`);
      
      if (savedPiBalance) {
        try {
          setBalance(prevBalance => ({
            ...prevBalance,
            pi: parseFloat(savedPiBalance)
          }));
        } catch (error) {
          console.error('Failed to parse saved Pi balance', error);
        }
      } else {
        // Initialize with default Pi balance for demo purposes
        setBalance(prevBalance => ({
          ...prevBalance,
          pi: 10.0
        }));
      }
      
      if (savedPtmBalance) {
        try {
          setBalance(prevBalance => ({
            ...prevBalance,
            ptm: parseFloat(savedPtmBalance)
          }));
        } catch (error) {
          console.error('Failed to parse saved PTM balance', error);
        }
      } else {
        // Initialize with default PTM balance for demo purposes
        setBalance(prevBalance => ({
          ...prevBalance,
          ptm: 50.0
        }));
      }

      const savedTransactions = localStorage.getItem(`pi_transactions_${user.uid}`);
      if (savedTransactions) {
        try {
          const parsedTransactions = JSON.parse(savedTransactions);
          // Convert timestamp strings back to Date objects
          setTransactions(
            parsedTransactions.map((tx: any) => ({
              ...tx,
              timestamp: new Date(tx.timestamp),
            }))
          );
        } catch (error) {
          console.error('Failed to parse saved transactions', error);
        }
      }
    }
  };

  // Load wallet data from localStorage when user changes
  useEffect(() => {
    fetchBalance();
  }, [user]);

  // Save wallet data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`pi_balance_${user.uid}`, balance.pi.toString());
      localStorage.setItem(`ptm_balance_${user.uid}`, balance.ptm.toString());

      if (transactions.length > 0) {
        localStorage.setItem(
          `pi_transactions_${user.uid}`,
          JSON.stringify(transactions)
        );
      }
    }
  }, [balance, transactions, user]);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setTransactions((current) => [newTransaction, ...current]);

    // Update balance based on transaction type
    if (transaction.status === 'completed') {
      if (transaction.type === 'receive' || transaction.type === 'mining' || transaction.type === 'reward') {
        setBalance((current) => ({
          ...current,
          pi: current.pi + transaction.amount
        }));
      } else if (transaction.type === 'send' || transaction.type === 'payment') {
        setBalance((current) => ({
          ...current,
          pi: current.pi - transaction.amount
        }));
      }
    }
  };

  // Update status of an existing transaction
  const updateTransactionStatus = (id: string, status: TransactionStatus) => {
    setTransactions((current) =>
      current.map((tx) => {
        if (tx.id === id) {
          const updatedTx = { ...tx, status };
          
          // Update balance if status changed to completed
          if (tx.status !== 'completed' && status === 'completed') {
            if (tx.type === 'receive' || tx.type === 'mining' || tx.type === 'reward') {
              setBalance((current) => ({
                ...current,
                pi: current.pi + tx.amount
              }));
            } else if (tx.type === 'send' || tx.type === 'payment') {
              setBalance((current) => ({
                ...current,
                pi: current.pi - tx.amount
              }));
            }
          }
          
          return updatedTx;
        }
        return tx;
      })
    );
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        addTransaction,
        updateTransactionStatus,
        fetchBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
