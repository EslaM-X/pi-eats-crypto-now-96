
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

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
}

const WalletContext = createContext<WalletContextType>({
  balance: 0,
  transactions: [],
  addTransaction: () => {},
  updateTransactionStatus: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePiAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load wallet data from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedBalance = localStorage.getItem(`pi_balance_${user.uid}`);
      if (savedBalance) {
        try {
          setBalance(parseFloat(savedBalance));
        } catch (error) {
          console.error('Failed to parse saved balance', error);
        }
      } else {
        // Initialize with default balance for demo purposes
        setBalance(10.0);
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
    } else {
      // Clear wallet data when user logs out
      setBalance(0);
      setTransactions([]);
    }
  }, [user]);

  // Save wallet data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`pi_balance_${user.uid}`, balance.toString());

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
        setBalance((current) => current + transaction.amount);
      } else if (transaction.type === 'send' || transaction.type === 'payment') {
        setBalance((current) => current - transaction.amount);
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
              setBalance((current) => current + tx.amount);
            } else if (tx.type === 'send' || tx.type === 'payment') {
              setBalance((current) => current - tx.amount);
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
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
