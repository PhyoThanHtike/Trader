import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Package, DollarSign } from 'lucide-react';

interface FinancialData {
  name: string;
  value: number;
}

interface FinancialChartProps {
  orders: any[];
  tradesAsSeller: any[];
}

interface OrderStatusChartProps {
  orders: any[];
}

const COLORS = ['#0088FE', '#00C49F']; // Only two colors for two data points

// Custom tooltip component for pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-md">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-blue-600">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip component for bar chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-purple-600">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
};

// Empty state component
const EmptyState = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
      <div className="mb-4 text-4xl opacity-50">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-center">{description}</p>
    </div>
  );
};

export function FinancialChart({ orders, tradesAsSeller }: FinancialChartProps) {
  const calculateFinancials = () => {
    const buyOrders = orders.filter(o => o.type === 'BUY' && o.status === 'FILLED');
    const sellOrders = orders.filter(o => o.type === 'SELL' && o.status === 'FILLED');

    const totalSpent = buyOrders.reduce((sum, order) => sum + (order.price * order.filled), 0);
    const totalEarned = sellOrders.reduce((sum, order) => sum + (order.price * order.filled), 0);

    return [
      { name: 'Total Spent', value: totalSpent },
      { name: 'Total Earned', value: totalEarned }
    ];
  };

  const data = calculateFinancials();
  const hasData = data.some(item => item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Overview
              </CardTitle>
              <CardDescription>Total spending and earnings from orders</CardDescription>
            </div>
            {hasData && (
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-[#0088FE]" />
                <TrendingUp className="h-4 w-4 text-[#00C49F]" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          {hasData ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={60}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                      labelLine={false}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                      formatter={(value) => <span className="text-sm">{value}</span>}
                      iconType="circle"
                      iconSize={10}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-lg font-semibold text-[#0088FE]">${data[0]?.value.toFixed(2)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-lg font-semibold text-[#00C49F]">${data[1]?.value.toFixed(2)}</p>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="No financial data"
              description="You don't have any completed orders yet"
              icon={<DollarSign />}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function OrderStatusChart({ orders }: OrderStatusChartProps) {
  const getStatusData = () => {
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count
    }));
  };

  const data = getStatusData();
  const hasData = data.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status Distribution
              </CardTitle>
              <CardDescription>Breakdown of orders by status</CardDescription>
            </div>
            {hasData && (
              <div className="text-sm text-muted-foreground">
                {orders.length} total orders
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          {hasData ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="status" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend formatter={(value) => <span className="text-sm">Number of Orders</span>} />
                  <Bar 
                    dataKey="count" 
                    fill="#8884d8" 
                    name="Number of Orders"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="No order data"
              description="You don't have any orders yet"
              icon={<Package />}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main dashboard component to display both charts with consistent height
export default function DashboardCharts({ orders, tradesAsSeller }: FinancialChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FinancialChart orders={orders} tradesAsSeller={tradesAsSeller} />
      <OrderStatusChart orders={orders} />
    </div>
  );
}