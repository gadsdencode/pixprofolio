import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Calendar, Camera, Send, CheckCircle, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

const projectRequestSchema = z.object({
  projectType: z.string().min(1, "Please select a project type"),
  desiredDate: z.string().min(1, "Please select a desired date"),
  message: z.string().min(20, "Please provide more details about your project (at least 20 characters)"),
});

type ProjectRequestFormValues = z.infer<typeof projectRequestSchema>;

export default function ClientDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if not client
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "client")) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  // Fetch client's portfolio items
  const { data: portfolioItems = [], isLoading: portfolioLoading } = useQuery<any[]>({
    queryKey: ["/api/client/portfolio"],
    enabled: !!user && user.role === "client",
  });

  // Fetch client's project requests
  const { data: projectRequests = [], isLoading: requestsLoading } = useQuery<any[]>({
    queryKey: ["/api/client/requests"],
    enabled: !!user && user.role === "client",
  });

  // Fetch client's invoices
  const { data: clientInvoices = [], isLoading: invoicesLoading } = useQuery<any[]>({
    queryKey: ["/api/client/invoices"],
    enabled: !!user && user.role === "client",
  });

  // Form for new project request
  const form = useForm<ProjectRequestFormValues>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      projectType: "",
      desiredDate: "",
      message: "",
    },
  });

  // Mutation for creating project request
  const createRequestMutation = useMutation({
    mutationFn: async (data: ProjectRequestFormValues) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          fullName: user?.name || "",
          email: user?.email || "",
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit request");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your project request has been sent to the photographer.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/client/requests"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectRequestFormValues) => {
    createRequestMutation.mutate(data);
  };

  if (authLoading || portfolioLoading || requestsLoading || invoicesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== "client") {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new": return "default";
      case "contacted": return "secondary";
      case "converted": return "outline";
      case "paid": return "secondary";
      case "sent": return "default";
      default: return "outline";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Access your portfolio and manage photography projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Portfolio</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolioItems?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Photos delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Project Requests</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectRequests?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Submitted requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clientInvoices.filter((i: any) => i.status === "sent").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList>
            <TabsTrigger value="portfolio" data-testid="tab-portfolio">
              My Portfolio
            </TabsTrigger>
            <TabsTrigger value="new-request" data-testid="tab-new-request">
              New Request
            </TabsTrigger>
            <TabsTrigger value="requests" data-testid="tab-requests">
              My Requests ({projectRequests?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="invoices" data-testid="tab-invoices">
              Invoices ({clientInvoices?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Photography Portfolio</CardTitle>
                <CardDescription>Photos from your completed sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {!portfolioItems || portfolioItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No photos in your portfolio yet</p>
                    <p className="text-sm text-muted-foreground">
                      Once your photoshoot is complete, your photos will appear here
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolioItems.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden" data-testid={`portfolio-item-${item.id}`}>
                        <div className="aspect-video bg-muted relative">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <Badge variant="secondary">{item.category}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new-request" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Request a New Photography Session</CardTitle>
                <CardDescription>Tell us about your photography needs</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Photography</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-project-type">
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="portrait">Portrait</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="realtor">Real Estate</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="desiredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              min={new Date().toISOString().split("T")[0]}
                              data-testid="input-desired-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please describe your photography needs, location preferences, and any specific requirements..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createRequestMutation.isPending}
                      data-testid="button-submit-request"
                    >
                      {createRequestMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Project Requests</CardTitle>
                <CardDescription>Track the status of your photography requests</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {!projectRequests || projectRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No project requests yet</p>
                  ) : (
                    <div className="space-y-4">
                      {projectRequests.map((request: any) => (
                        <div key={request.id} className="border rounded-lg p-4" data-testid={`request-${request.id}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{request.projectType}</h3>
                              <p className="text-sm text-muted-foreground">
                                Requested on {formatDate(request.createdAt)}
                              </p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(request.status)}>
                              {request.status === "new" && "Pending Review"}
                              {request.status === "contacted" && "In Discussion"}
                              {request.status === "converted" && "Confirmed"}
                              {request.status === "closed" && "Completed"}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{request.message}</p>
                          <p className="text-sm text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            Desired date: {request.desiredDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Invoices</CardTitle>
                <CardDescription>View and pay for your photography services</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {!clientInvoices || clientInvoices.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No invoices yet</p>
                  ) : (
                    <div className="space-y-4">
                      {clientInvoices.map((invoice: any) => (
                        <div key={invoice.id} className="border rounded-lg p-4" data-testid={`invoice-${invoice.id}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{invoice.description}</h3>
                              <p className="text-sm text-muted-foreground">
                                Created on {formatDate(invoice.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">${parseFloat(invoice.amount).toFixed(2)}</div>
                              <Badge variant={getStatusBadgeVariant(invoice.status)}>
                                {invoice.status === "paid" && (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Paid
                                  </>
                                )}
                                {invoice.status === "sent" && "Pending Payment"}
                                {invoice.status === "draft" && "Draft"}
                              </Badge>
                            </div>
                          </div>
                          {invoice.dueDate && (
                            <p className="text-sm text-muted-foreground mb-3">
                              Due by {formatDate(invoice.dueDate)}
                            </p>
                          )}
                          {invoice.hostedInvoiceUrl && invoice.status === "sent" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => window.open(invoice.hostedInvoiceUrl, "_blank")}
                              data-testid={`button-pay-invoice-${invoice.id}`}
                            >
                              Pay Invoice
                            </Button>
                          )}
                          {invoice.status === "paid" && (
                            <p className="text-sm text-green-600">
                              <CheckCircle className="inline h-3 w-3 mr-1" />
                              Thank you for your payment!
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}