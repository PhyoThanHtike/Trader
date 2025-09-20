// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { motion } from 'framer-motion';

// interface FinancialData {
//   name: string;
//   value: number;
// }

// interface FinancialChartProps {
//   orders: any[];
//   tradesAsSeller: any[];
// }

// const COLORS = ['#0088FE', '#00C49F']; // Only two colors for two data points

// export default function FinancialChart({ orders, tradesAsSeller }: FinancialChartProps) {
//   const calculateFinancials = () => {
//     const buyOrders = orders.filter(o => o.type === 'BUY' && o.status === 'FILLED');
//     const sellOrders = orders.filter(o => o.type === 'SELL' && o.status === 'FILLED');

//     const totalSpent = buyOrders.reduce((sum, order) => sum + (order.price * order.filled), 0);
//     const totalEarned = sellOrders.reduce((sum, order) => sum + (order.price * order.filled), 0);

//     return [
//       { name: 'Total Spent', value: totalSpent },
//       { name: 'Total Earned', value: totalEarned }
//     ];
//   };

//   const data = calculateFinancials();

//   // Custom label formatter to show both name and value
//   const renderCustomizedLabel = ({ name, value }: { name: string; value: number }) => {
//     return `${name}: $${value.toFixed(2)}`;
//   };

//   // Custom tooltip formatter
//   const customTooltipFormatter = (value: number) => {
//     return [`$${value.toFixed(2)}`, 'Amount'];
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Card>
//         <CardHeader>
//           <CardTitle>Financial Overview</CardTitle>
//           <CardDescription>Total spending and earnings from orders</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={data}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 dataKey="value"
//                 label={renderCustomizedLabel}
//                 labelLine={false}
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={customTooltipFormatter} />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//           <div className="mt-4 text-center text-sm text-muted-foreground">
//             <p>Total Spent: ${data[0]?.value.toFixed(2) || '0.00'}</p>
//             <p>Total Earned: ${data[1]?.value.toFixed(2) || '0.00'}</p>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }