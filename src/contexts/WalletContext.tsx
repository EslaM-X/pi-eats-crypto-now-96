
import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePiAuth } from './PiAuthContext';
import { v4 as uuidv4 } from 'uuid';

// Define transaction type
export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'reward' | 'mining';
  amount: number;
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
  recipient?: string;
  sender?: string;
}

// Define wallet context type
interface WalletContextType {
  piBalance: number;
  ptmBalance: number;
  transactions: Transaction[];
  sendPi: (amount: number, recipient: string, description: string) => Promise<boolean>;
  receivePi: (amount: number, sender: string, description: string) => Promise<boolean>;
  addMiningReward: (amount: number) => Promise<boolean>;
  addBonus: (amount: number, reason: string) => Promise<boolean>;
}

// Create the context
const WalletContext = createContext<WalletContextType | null>(null);

// Create the provider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePiAuth();
  const [piBalance, setPiBalance] = useState(0);
  const [ptmBalance, setPtmBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load wallet data from localStorage when user changes
  useEffect(() => {
    if (user) {
      try {
        // Load Pi balance
        const savedPiBalance = localStorage.getItem(`pi_balance_${user.uid}`);
        if (savedPiBalance) {
          setPiBalance(Number(savedPiBalance));
        } else {
          // Default starting balance for new users
          setPiBalance(100);
          localStorage.setItem(`pi_balance_${user.uid}`, '100');
        }

        // Load PTM (PiEat-Me token) balance
        const savedPtmBalance = localStorage.getItem(`ptm_balance_${user.uid}`);
        if (savedPtmBalance) {
          setPtmBalance(Number(savedPtmBalance));
        } else {
          // Default starting PTM balance
          setPtmBalance(10);
          localStorage.setItem(`ptm_balance_${user.uid}`, '10');
        }

        // Load transactions
        const savedTransactions = localStorage.getItem(`transactions_${user.uid}`);
        if (savedTransactions) {
          // Parse the transactions and convert date strings to Date objects
          const parsedTransactions = JSON.parse(savedTransactions).map((tx: any) => ({
            ...tx,
            date: new Date(tx.date)
          }));
          
          setTransactions(parsedTransactions);
        } else {
          // Create default transactions history
          const defaultTransactions: Transaction[] = [
            {
              id: uuidv4(),
              type: 'receive',
              amount: 100,
              description: 'Welcome bonus',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
              status: 'completed'
            },
            {
              id: uuidv4(),
              type: 'reward',
              amount: 10,
              description: 'Sign-up reward in PTM tokens',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
              status: 'completed'
            }
          ];
          
          setTransactions(defaultTransactions);
          localStorage.setItem(`transactions_${user.uid}`, JSON.stringify(defaultTransactions));
        }
      } catch (error) {
        console.error('Error loading wallet data:', error);
      }
    } else {
      // Reset state when user logs out
      setPiBalance(0);
      setPtmBalance(0);
      setTransactions([]);
    }
  }, [user]);

  // Save wallet data to localStorage when changed
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`pi_balance_${user.uid}`, piBalance.toString());
        localStorage.setItem(`ptm_balance_${user.uid}`, ptmBalance.toString());
        
        // Convert Date objects to strings for JSON serialization
        const serializableTransactions = transactions.map(tx => ({
          ...tx,
          date: tx.date.toISOString()
        }));
        
        localStorage.setItem(`transactions_${user.uid}`, JSON.stringify(serializableTransactions));
      } catch (error) {
        console.error('Error saving wallet data:', error);
      }
    }
  }, [piBalance, ptmBalance, transactions, user]);

  // Send Pi to another user
  const sendPi = async (amount: number, recipient: string, description: string): Promise<boolean> => {
    if (!user) return false;
    
    if (amount <= 0) {
      console.error('Amount must be greater than 0');
      return false;
    }
    
    if (amount > piBalance) {
      console.error('Insufficient balance');
      return false;
    }
    
    // Create the transaction
    const transaction: Transaction = {
      id: uuidv4(),
      type: 'send',
      amount,
      description,
      recipient,
      date: new Date(),
      status: 'completed'
    };
    
    // Update balance and add transaction
    setPiBalance(prev => prev - amount);
    setTransactions(prev => [transaction, ...prev]);
    
    return true;
  };

  // Receive Pi from another user
  const receivePi = async (amount: number, sender: string, description: string): Promise<boolean> => {
    if (!user) return false;
    
    if (amount <= 0) {
      console.error('Amount must be greater than 0');
      return false;
    }
    
    // Create the transaction
    const transaction: Transaction = {
      id: uuidv4(),
      type: 'receive',
      amount,
      description,
      sender,
      date: new Date(),
      status: 'completed'
    };
    
    // Update balance and add transaction
    setPiBalance(prev => prev + amount);
    setTransactions(prev => [transaction, ...prev]);
    
    return true;
  };

  // Add mining reward
  const addMiningReward = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    
    if (amount <= 0) {
      console.error('Amount must be greater than 0');
      return false;
    }
    
    // Create the transaction
    const transaction: Transaction = {
      id: uuidv4(),
      type: 'mining',
      amount,
      description: 'Mining reward',
      date: new Date(),
      status: 'completed'
    };
    
    // Update balance and add transaction
    setPiBalance(prev => prev + amount);
    setTransactions(prev => [transaction, ...prev]);
    
    return true;
  };

  // Add bonus (rewards in PTM tokens)
  const addBonus = async (amount: number, reason: string): Promise<boolean> => {
    if (!user) return false;
    
    if (amount <= 0) {
      console.error('Amount must be greater than 0');
      return false;
    }
    
    // Create the transaction
    const transaction: Transaction = {
      id: uuidv4(),
      type: 'reward',
      amount,
      description: reason,
      date: new Date(),
      status: 'completed'
    };
    
    // Update PTM balance and add transaction
    setPtmBalance(prev => prev + amount);
    setTransactions(prev => [transaction, ...prev]);
    
    return true;
  };

  return (
    <WalletContext.Provider value={{
      piBalance,
      ptmBalance,
      transactions,
      sendPi,
      receivePi,
      addMiningReward,
      addBonus
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// Create a custom hook for using the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;
