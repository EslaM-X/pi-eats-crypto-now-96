
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Pickaxe } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'mine' | 'claim' | 'spend';
  amount: number;
  timestamp: Date;
  description: string;
}

// Sample activity data
const activityData: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'mine',
    amount: 0.0234,
    timestamp: new Date(Date.now() - 10 * 60000),  // 10 minutes ago
    description: 'Mining session completed'
  },
  {
    id: 'act-2',
    type: 'claim',
    amount: 0.01,
    timestamp: new Date(Date.now() - 25 * 60000),  // 25 minutes ago
    description: 'Daily login reward'
  },
  {
    id: 'act-3',
    type: 'spend',
    amount: -0.15,
    timestamp: new Date(Date.now() - 120 * 60000),  // 2 hours ago
    description: 'Discount applied to order #1234'
  },
  {
    id: 'act-4',
    type: 'mine',
    amount: 0.0251,
    timestamp: new Date(Date.now() - 140 * 60000),  // 2.3 hours ago
    description: 'Mining session completed'
  },
  {
    id: 'act-5',
    type: 'claim',
    amount: 0.05,
    timestamp: new Date(Date.now() - 24 * 60 * 60000),  // 1 day ago
    description: 'First order bonus'
  },
];

const MiningActivity = () => {
  // Function to format time as "X minutes/hours/days ago"
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mine':
        return <Pickaxe className="h-4 w-4 text-pi" />;
      case 'claim':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'spend':
        return <ArrowUp className="h-4 w-4 text-orange" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activityData.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No recent mining activity
          </div>
        ) : (
          <div className="space-y-4">
            {activityData.map((item) => (
              <div key={item.id} className="flex items-start">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-3">
                  {getActivityIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.description}</p>
                    <span className={`font-bold ${
                      item.amount < 0 ? 'text-orange' : 'text-green-500'
                    }`}>
                      {item.amount > 0 && '+'}<span className="text-sm mr-1">ꟼ</span>{item.amount.toFixed(4)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(item.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MiningActivity;
