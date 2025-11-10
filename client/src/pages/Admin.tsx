import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, LogOut, User } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const invoiceFormSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientEmail: z.string().email("Please enter a valid email address"),
  serviceDescription: z.string().min(10, "Description must be at least 10 characters"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceData {
  id: number;
  stripeInvoiceId: string;
  amount: string;
  status: string;
  description: string;
  createdAt: string;
  client?: {
    name: string;
  };
}

export default function Admin() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState("");

  const { data: invoices } = useQuery<InvoiceData[]>({
    queryKey: ["/api/invoices"],
  });

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      serviceDescription: "",
      amount: "",
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: InvoiceFormValues) => {
      const response = await apiRequest("POST", "/api/create-invoice", {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        serviceDescription: data.serviceDescription,
        amount: parseFloat(data.amount),
      });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success && result.invoiceUrl) {
        setInvoiceUrl(result.invoiceUrl);
        setDialogOpen(true);
        form.reset();
        // Invalidate and refetch invoices list
        queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create invoice. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InvoiceFormValues) => {
    createInvoiceMutation.mutate(data);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Paid":
        return "default";
      case "Sent":
        return "secondary";
      case "Draft":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Layout>
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            {/* User Profile Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4" data-testid="text-admin-title">
                  Invoice Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Create and manage invoices for your photography projects.
                </p>
              </div>
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profilePicture || undefined} alt={user?.name} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    {user?.provider === "google" && (
                      <Badge variant="secondary" className="w-fit mt-1">
                        Google
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={logout}
                    data-testid="button-logout"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Create New Invoice</CardTitle>
                <CardDescription>Generate a Stripe invoice for your client</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} data-testid="input-client-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clientEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} data-testid="input-client-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="serviceDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Wedding photography package including 8 hours of coverage, edited photos, and album..."
                              className="min-h-[100px]"
                              {...field}
                              data-testid="textarea-service-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (USD)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2500" {...field} data-testid="input-amount" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={createInvoiceMutation.isPending} 
                      data-testid="button-generate-invoice"
                    >
                      {createInvoiceMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Invoice...
                        </>
                      ) : (
                        "Generate Stripe Invoice"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>View and manage your invoice history</CardDescription>
              </CardHeader>
              <CardContent>
                {invoices && invoices.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                          <TableCell className="font-mono text-sm">{invoice.stripeInvoiceId.substring(0, 20)}...</TableCell>
                          <TableCell>{invoice.description.substring(0, 50)}...</TableCell>
                          <TableCell className="font-semibold">${invoice.amount}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No invoices yet. Create your first invoice above.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-invoice-success">
          <DialogHeader>
            <DialogTitle>Invoice Generated Successfully</DialogTitle>
            <DialogDescription>
              Your Stripe invoice has been created and sent to the client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Invoice URL:</p>
              <div className="p-3 bg-muted rounded-md">
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary break-all hover:underline"
                  data-testid="link-invoice-url"
                >
                  {invoiceUrl}
                </a>
              </div>
            </div>
            <Button onClick={() => setDialogOpen(false)} className="w-full" data-testid="button-close-dialog">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
