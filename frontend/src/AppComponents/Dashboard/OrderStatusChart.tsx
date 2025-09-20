// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { motion } from 'framer-motion';

// interface OrderStatusChartProps {
//   orders: any[];
// }

// export default function OrderStatusChart({ orders }: OrderStatusChartProps) {
//   const getStatusData = () => {
//     const statusCount = orders.reduce((acc, order) => {
//       acc[order.status] = (acc[order.status] || 0) + 1;
//       return acc;
//     }, {});

//     return Object.entries(statusCount).map(([status, count]) => ({
//       status,
//       count
//     }));
//   };

//   const data = getStatusData();

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//     >
//       <Card>
//         <CardHeader>
//           <CardTitle>Order Status Distribution</CardTitle>
//           <CardDescription>Breakdown of orders by status</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="status" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#8884d8" name="Number of Orders" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }