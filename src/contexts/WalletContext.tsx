
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { usePiAuth } from './PiAuthContext';

export type Transaction = {
  id: string;
  type: 'send' | 'receive' | 'reward';
  amount: number;
  timestamp: Date;
  description: string;
  status: 'completed' | 'pending' | 'failed';
};

type WalletContextType = {
  balance: number;
  transactions: Transaction[];
  sendPi: (amount: number, recipient: string) => Promise<boolean>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  isLoading: boolean;
};

const WalletContext = createContext<WalletContextType>({
  balance: 0,
  transactions: [],
  sendPi: async () => false,
  addTransaction: () => {},
  isLoading: false,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePiAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Load saved wallet data from localStorage
      const savedBalance = localStorage.getItem(`wallet_balance_${user.uid}`);
      const savedTransactions = localStorage.getItem(`wallet_transactions_${user.uid}`);
      
      if (savedBalance) {
        setBalance(parseFloat(savedBalance));
      } else {
        // For demo purposes, initialize with some Pi
        const initialBalance = 10 + Math.random() * 100;
        setBalance(initialBalance);
        localStorage.setItem(`wallet_balance_${user.uid}`, initialBalance.toString());
      }
      
      if (savedTransactions) {
        try {
          const parsedTransactions = JSON.parse(savedTransactions);
          // Convert timestamp strings back to Date objects
          const formattedTransactions = parsedTransactions.map((tx: any) => ({
            ...tx,
            timestamp: new Date(tx.timestamp)
          }));
          setTransactions(formattedTransactions);
        } catch (error) {
          console.error('Failed to parse saved transactions', error);
        }
      } else {
        // Initialize with some mock transactions
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            type: 'receive',
            amount: 5,
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            description: 'Welcome bonus',
            status: 'completed',
          },
          {
            id: '2',
            type: 'reward',
            amount: 0.5,
            timestamp: new Date(Date.now() - 43200000), // 12 hours ago
            description: 'First order reward',
            status: 'completed',
          },
        ];
        
        setTransactions(mockTransactions);
        localStorage.setItem(`wallet_transactions_${user.uid}`, JSON.stringify(mockTransactions));
      }
    }
  }, [user]);

  const saveWalletData = (newBalance: number, newTransactions: Transaction[]) => {
    if (!user) return;
    
    localStorage.setItem(`wallet_balance_${user.uid}`, newBalance.toString());
    localStorage.setItem(`wallet_transactions_${user.uid}`, JSON.stringify(newTransactions));
  };

  const sendPi = async (amount: number, recipient: string): Promise<boolean> => {
    if (!user) return false;
    if (amount <= 0) {
      toast.error('Amount must be greater than zero');
      return false;
    }
    if (amount > balance) {
      toast.error('Insufficient balance');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update balance and add transaction
      const newBalance = balance - amount;
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'send',
        amount,
        timestamp: new Date(),
        description: `Sent to ${recipient}`,
        status: 'completed',
      };
      
      const updatedTransactions = [newTransaction, ...transactions];
      
      setBalance(newBalance);
      setTransactions(updatedTransactions);
      saveWalletData(newBalance, updatedTransactions);
      
      toast.success(`Successfully sent ${amount} Pi to ${recipient}`);
      return true;
    } catch (error) {
      console.error('Transaction failed', error);
      toast.error('Transaction failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    const newTransactions = [newTransaction, ...transactions];
    
    let newBalance = balance;
    if (transaction.status === 'completed') {
      if (transaction.type === 'receive' || transaction.type === 'reward') {
        newBalance += transaction.amount;
      } else if (transaction.type === 'send') {
        newBalance -= transaction.amount;
      }
    }
    
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveWalletData(newBalance, newTransactions);
    
    if (transaction.type === 'receive' || transaction.type === 'reward') {
      toast.success(`Received ${transaction.amount} Pi: ${transaction.description}`);
    }
  };
  
  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        sendPi,
        addTransaction,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
