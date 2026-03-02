
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DownloadCloud, FileText, Plus, Search, UserRound, IndianRupee } from "lucide-react";
import { mockBills } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Bill } from "@/types/bill";

const BillingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter bills based on search term and status
  const filteredBills = mockBills.filter(
    (bill) =>
      (bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || bill.paymentStatus === statusFilter)
  );

  const handleCreateNewBill = () => {
    navigate("/billing/new");
  };

  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const handleDownloadPDF = (bill: Bill) => {
    toast.success(`Downloading PDF for Bill #${bill.id}`, {
      description: `Invoice for ${bill.patientName} — ₹${bill.total.toFixed(2)}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-semibold">Billing & Invoices</h1>
        <Button onClick={handleCreateNewBill}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Bill
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
          <CardDescription>View and manage patient bills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bills..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="partial">Partial Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No bills found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No bills match your search criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm font-medium text-muted-foreground">
                    <th className="pb-3 text-left font-medium">Bill #</th>
                    <th className="pb-3 text-left font-medium">Patient</th>
                    <th className="pb-3 text-left font-medium">Date</th>
                    <th className="pb-3 text-right font-medium">Amount</th>
                    <th className="pb-3 text-center font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBills.map((bill) => (
                    <tr key={bill.id} className="text-sm">
                      <td className="py-3 font-medium">{bill.id}</td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <UserRound className="h-4 w-4 text-primary" />
                          </div>
                          <span className="ml-2">{bill.patientName}</span>
                        </div>
                      </td>
                      <td className="py-3">{bill.date}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end">
                          <IndianRupee className="h-3.5 w-3.5 mr-1" />
                          {bill.total.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            getStatusColor(bill.paymentStatus)
                          )}
                        >
                          {bill.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBill(bill)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPDF(bill)}
                          >
                            <DownloadCloud className="mr-1 h-3.5 w-3.5" />
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {filteredBills.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredBills.length} of {mockBills.length} bills
            </div>
            <div className="text-sm font-medium flex items-center">
              Total: <IndianRupee className="h-3.5 w-3.5 mx-1" />{filteredBills.reduce((sum, bill) => sum + bill.total, 0).toFixed(2)}
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Bill Detail Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-lg">
          {selectedBill && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Bill #{selectedBill.id}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">Patient</p><p className="font-medium">{selectedBill.patientName}</p></div>
                  <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{selectedBill.date}</p></div>
                  <div><p className="text-xs text-muted-foreground">Status</p><Badge variant="outline" className={cn("capitalize", getStatusColor(selectedBill.paymentStatus))}>{selectedBill.paymentStatus}</Badge></div>
                  {selectedBill.paymentMethod && <div><p className="text-xs text-muted-foreground">Payment Method</p><p className="font-medium capitalize">{selectedBill.paymentMethod}</p></div>}
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedBill.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm rounded-md border p-2">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-xs text-muted-foreground capitalize">{item.category} · Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium flex items-center"><IndianRupee className="h-3 w-3" />{item.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="flex items-center"><IndianRupee className="h-3 w-3" />{selectedBill.subtotal.toFixed(2)}</span></div>
                  {selectedBill.discount && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="flex items-center text-green-600">-<IndianRupee className="h-3 w-3" />{selectedBill.discount.toFixed(2)}</span></div>}
                  {selectedBill.tax && <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="flex items-center"><IndianRupee className="h-3 w-3" />{selectedBill.tax.toFixed(2)}</span></div>}
                  <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Total</span><span className="flex items-center"><IndianRupee className="h-3.5 w-3.5" />{selectedBill.total.toFixed(2)}</span></div>
                </div>

                {selectedBill.notes && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{selectedBill.notes}</p>
                  </div>
                )}

                <Button className="w-full gap-1" onClick={() => { handleDownloadPDF(selectedBill); setSelectedBill(null); }}>
                  <DownloadCloud className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingPage;
