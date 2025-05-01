
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useOrders, OrderStatus } from '@/contexts/OrdersContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  X, 
  CheckCircle2, 
  Truck, 
  CookingPot, 
  ShoppingBag, 
  Calendar 
} from 'lucide-react';

const Orders = () => {
  const { t } = useLanguage();
  const { user, login } = usePiAuth();
  const { orders, cancelOrder } = useOrders();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Filter orders by selected status
  const filteredOrders = selectedStatus 
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

  // Status filter options
  const statusFilters: { value: OrderStatus | 'all', label: string, icon: React.ReactNode }[] = [
    { value: 'all', label: t('orders.all'), icon: <ShoppingBag className="h-4 w-4" /> },
    { value: 'pending', label: t('orders.pending'), icon: <Clock className="h-4 w-4" /> },
    { value: 'preparing', label: t('orders.preparing'), icon: <CookingPot className="h-4 w-4" /> },
    { value: 'delivering', label: t('orders.delivering'), icon: <Truck className="h-4 w-4" /> },
    { value: 'delivered', label: t('orders.delivered'), icon: <CheckCircle2 className="h-4 w-4" /> },
    { value: 'cancelled', label: t('orders.cancelled'), icon: <X className="h-4 w-4" /> },
  ];

  // Handle status filter change
  const handleStatusFilter = (status: string | null) => {
    setSelectedStatus(status === 'all' ? null : status);
  };

  // Get status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('nav.orders')}</h1>
          <p className="text-muted-foreground">
            {t('orders.track')}
          </p>
        </div>
        
        {!user ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-10">
              <div className="mb-6 text-center">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-medium">{t('orders.loginRequired')}</h3>
                <p className="text-muted-foreground mt-2">
                  {t('orders.loginMessage')}
                </p>
              </div>
              <Button onClick={login} className="button-gradient">
                {t('auth.connectWithPi')}
              </Button>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-10">
              <div className="mb-6 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-medium">{t('orders.noOrders')}</h3>
                <p className="text-muted-foreground mt-2">
                  {t('orders.browseRestaurants')}
                </p>
              </div>
              <Button 
                onClick={() => navigate('/restaurants')}
                className="button-gradient"
              >
                {t('orders.browseNow')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Status filter */}
            <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  onClick={() => handleStatusFilter(filter.value)}
                  variant={selectedStatus === filter.value || (filter.value === 'all' && selectedStatus === null) ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center"
                >
                  {filter.icon}
                  <span className="ml-2">{filter.label}</span>
                </Button>
              ))}
            </div>
            
            <div className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('orders.id')}</TableHead>
                    <TableHead>{t('orders.date')}</TableHead>
                    <TableHead>{t('orders.status')}</TableHead>
                    <TableHead>{t('orders.items')}</TableHead>
                    <TableHead className="text-right">{t('orders.total')}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusBadge(order.status)}`}>
                          {t(`orders.${order.status}`)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} {t('orders.itemsCount')}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.paymentMethod === 'pi' ? 'π' : 'PiEat'} {order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          {t('orders.view')}
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => cancelOrder(order.id)}
                          >
                            {t('orders.cancel')}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Orders;
