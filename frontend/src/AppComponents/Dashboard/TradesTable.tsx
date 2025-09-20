import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderAlert } from "../Order/OrderAlert";
import { Trash2, Eye, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Trade {
  id: number;
  price: number;
  volume: number;
  createdAt: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  seller: any;
  buyer: any;
  product:any;
}

interface TradesTableProps {
  trades: Trade[];
  onRefresh?: () => void;
}

export default function TradesTable({ trades, onRefresh }: TradesTableProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const userId = useSelector((state: any) => state.user.userId);

  const handleDelete = (trade: Trade) => {
    setSelectedTrade(trade);
    setAlertOpen(true);
  };
  console.log(trades);

  const handleConfirmDelete = async () => {
    if (!selectedTrade) return;

    try {
      // Implement API call for delete trade here
      console.log("Deleting trade:", selectedTrade.id);
      onRefresh?.();
    } catch (error) {
      console.error("Failed to delete trade:", error);
    } finally {
      setAlertOpen(false);
      setSelectedTrade(null);
    }
  };

  const getTotalValue = (trade: Trade) => trade.price * trade.volume;
  const getRole = (trade: Trade) =>
    trade.buyerId === userId ? "Buyer" : "Seller";
  const getCounterPartEmail = (trade: Trade) =>
    trade.buyerId === userId ? trade.seller.email : trade.buyer.email;
  const getRoleColor = (role: string) =>
    role === "Buyer"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate totals for summary
  const totalTrades = trades.length;
  const totalVolume = trades.reduce((sum, trade) => sum + trade.volume, 0);
  const totalValue = trades.reduce(
    (sum, trade) => sum + getTotalValue(trade),
    0
  );

  if (trades.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <div className="text-center text-muted-foreground">
            <p>No trades found</p>
            <p className="text-sm">Your trade history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalTrades}</div>
              <div className="text-sm text-muted-foreground">Total Trades</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalVolume}</div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {formatCurrency(totalValue)}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </CardContent>
          </Card>
        </div>

        {/* Trades Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                {/* <CardTitle>Trade History</CardTitle> */}
                <CardDescription>Your complete trade activity</CardDescription>
              </div>
              {/* <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button> */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Date & Time</TableHead>
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Volume</TableHead>
                    <TableHead className="font-semibold">Total Value</TableHead>
                    <TableHead className="font-semibold">My Role</TableHead>
                    <TableHead className="font-semibold">
                      CounterPart Email
                    </TableHead>
                    {/* <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade, index) => {
                    const role = getRole(trade);
                    const counterPart = getCounterPartEmail(trade);
                    const roleColor = getRoleColor(role);

                    return (
                      <motion.tr
                        key={trade.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(trade.createdAt)}
                        </TableCell>
                        <TableCell className="font-semibold text-yellow-600">
                            {trade.product.name}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(trade.price)}
                        </TableCell>
                        <TableCell>{trade.volume.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(getTotalValue(trade))}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className={roleColor}>
                            {role}
                          </Badge>
                        </TableCell>
                        <TableCell>{counterPart}</TableCell>
                        {/* <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete Trade"
                              className="h-8 w-8 text-destructive hover:text-destructive/90"
                              onClick={() => handleDelete(trade)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell> */}
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <OrderAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Delete Trade"
        description="Are you sure you want to delete this trade record? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
