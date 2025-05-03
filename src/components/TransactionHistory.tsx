
import React from 'react';
import { usePiPrice } from '@/contexts/PiPriceContext';
import { Transaction } from '@/contexts/WalletContext';
import { DollarSign, ChevronRight } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const { convertPiToUsd, convertPiToEgp } = usePiPrice();
  
  if (transactions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No transactions found
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop view - table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium">Type</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium">Amount</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium">Description</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium">Status</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium">USD/EGP</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr 
                key={index} 
                className="border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => console.log(`Transaction details for ${tx.id}`)}
              >
                <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <span className={`capitalize font-medium ${
                    tx.type === 'receive' ? 'text-green-500' : 
                    tx.type === 'send' ? 'text-orange' : ''
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <span className={`font-medium ${
                    tx.type === 'receive' || tx.type === 'reward' ? 'text-green-500' : 'text-orange'
                  }`}>
                    {tx.type === 'receive' || tx.type === 'reward' ? '+' : '-'} π {tx.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4">{tx.description}</td>
                <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {convertPiToUsd(tx.amount).toFixed(2)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span className="mr-1">£E</span>
                    {convertPiToEgp(tx.amount).toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile view - cards */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx, index) => (
          <div 
            key={index} 
            className="bg-muted/10 rounded-lg p-3 border border-border hover:border-primary/50 active:bg-muted/30 transition-colors cursor-pointer relative"
            onClick={() => console.log(`Transaction details for ${tx.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`capitalize font-medium ${
                tx.type === 'receive' ? 'text-green-500' : 
                tx.type === 'send' ? 'text-orange' : ''
              }`}>
                {tx.type}
              </span>
              <span className={`font-medium ${
                tx.type === 'receive' || tx.type === 'reward' ? 'text-green-500' : 'text-orange'
              }`}>
                {tx.type === 'receive' || tx.type === 'reward' ? '+' : '-'} π {tx.amount.toFixed(2)}
              </span>
            </div>
            <div className="text-sm mb-2">{tx.description}</div>
            <div className="flex justify-between items-center">
              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {tx.status}
              </span>
              <div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {convertPiToUsd(tx.amount).toFixed(2)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span className="mr-1">£E</span>
                  {convertPiToEgp(tx.amount).toFixed(2)}
                </div>
              </div>
            </div>
            <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
