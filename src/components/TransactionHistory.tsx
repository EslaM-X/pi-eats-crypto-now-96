
import React from 'react';
import { usePiPrice } from '@/contexts/PiPriceContext';
import { Transaction } from '@/contexts/WalletContext';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const { convertPiToUsd, convertPiToEgp } = usePiPrice();
  
  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">USD/EGP</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`capitalize ${
                      tx.type === 'receive' ? 'text-green-500' : 
                      tx.type === 'send' ? 'text-orange' : ''
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">
                      {tx.type === 'receive' || tx.type === 'reward' ? '+' : '-'} π {tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{tx.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                    <div>${convertPiToUsd(tx.amount).toFixed(2)}</div>
                    <div>£E{convertPiToEgp(tx.amount).toFixed(2)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
