import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Calendar, DollarSign, Users, Camera, CheckCircle, Clock, AlertCircle, MessageSquare } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OwnerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not owner
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "owner")) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  // Fetch dashboard summary (aggregated stats)
  const { data: dashboardSummary, isLoading: summaryLoading } = useQuery<{
    newInquiries: number;
    activeProjects: number;
    totalRevenue: number;
    pendingRevenue: number;
  }>({
    queryKey: ["/api/owner/dashboard-summary"],
    enabled: !!user && user.role === "owner",
    queryFn: () => fetch("/api/owner/dashboard-summary").then((res) => res.json()),
  });

  // Fetch contact inquiries (project requests) - still needed for tabs
  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery<any[]>({
    queryKey: ["/api/contact-inquiries"],
    enabled: !!user && user.role === "owner",
  });

  // Fetch invoices - still needed for tabs
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<any[]>({
    queryKey: ["/api/invoices"],
    enabled: !!user && user.role === "owner",
  });

  if (authLoading || summaryLoading || inquiriesLoading || invoicesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== "owner") {
    return null;
  }

  // Categorize inquiries by status (still needed for tabs display)
  const newInquiries = inquiries?.filter((i: any) => i.status === "new") || [];
  const contactedInquiries = inquiries?.filter((i: any) => i.status === "contacted") || [];
  const convertedInquiries = inquiries?.filter((i: any) => i.status === "converted") || [];
  const closedInquiries = inquiries?.filter((i: any) => i.status === "closed") || [];

  // Use dashboard summary for stats (aggregated on backend)
  const stats = dashboardSummary || {
    newInquiries: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
  };

  const getProjectTypeBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "wedding": return "default";
      case "portrait": return "secondary";
      case "event": return "outline";
      case "commercial": return "default";
      case "realtor": return "secondary";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your photography business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newInquiries}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.pendingRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Outstanding invoices</p>
            </CardContent>
          </Card>
        </div>

        {/* Project Management Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" data-testid="tab-pending">
              Pending ({newInquiries.length})
            </TabsTrigger>
            <TabsTrigger value="ongoing" data-testid="tab-ongoing">
              Ongoing ({contactedInquiries.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed ({convertedInquiries.length})
            </TabsTrigger>
            <TabsTrigger value="invoices" data-testid="tab-invoices">
              Invoices ({invoices?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Project Requests</CardTitle>
                <CardDescription>New inquiries that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {newInquiries.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No pending requests</p>
                  ) : (
                    <div className="space-y-4">
                      {newInquiries.map((inquiry: any) => (
                        <div key={inquiry.id} className="border rounded-lg p-4" data-testid={`inquiry-${inquiry.id}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{inquiry.fullName}</h3>
                              <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                            </div>
                            <Badge variant={getProjectTypeBadgeVariant(inquiry.projectType)}>
                              {inquiry.projectType}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{inquiry.message}</p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              Desired: {inquiry.desiredDate}
                            </span>
                            <Button size="sm" data-testid={`button-contact-${inquiry.id}`}>
                              Contact Client
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ongoing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ongoing Projects</CardTitle>
                <CardDescription>Projects currently in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {contactedInquiries.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No ongoing projects</p>
                  ) : (
                    <div className="space-y-4">
                      {contactedInquiries.map((inquiry: any) => (
                        <div key={inquiry.id} className="border rounded-lg p-4" data-testid={`ongoing-${inquiry.id}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{inquiry.fullName}</h3>
                              <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                            </div>
                            <Badge variant="default">In Progress</Badge>
                          </div>
                          <p className="text-sm mb-2">
                            <Badge variant={getProjectTypeBadgeVariant(inquiry.projectType)} className="mr-2">
                              {inquiry.projectType}
                            </Badge>
                            Scheduled: {inquiry.desiredDate}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" data-testid={`button-complete-${inquiry.id}`}>
                              Mark Complete
                            </Button>
                            <Button size="sm" data-testid={`button-invoice-${inquiry.id}`}>
                              Create Invoice
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Projects</CardTitle>
                <CardDescription>Successfully delivered projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {convertedInquiries.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No completed projects yet</p>
                  ) : (
                    <div className="space-y-4">
                      {convertedInquiries.map((inquiry: any) => (
                        <div key={inquiry.id} className="border rounded-lg p-4 opacity-75" data-testid={`completed-${inquiry.id}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{inquiry.fullName}</h3>
                              <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                            </div>
                            <Badge variant="secondary">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {inquiry.projectType} • Delivered on {formatDate(inquiry.createdAt)}
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
                <CardTitle>All Invoices</CardTitle>
                <CardDescription>Track payments and invoice history</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {!invoices || invoices.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No invoices created yet</p>
                  ) : (
                    <div className="space-y-4">
                      {invoices.map((invoice: any) => (
                        <div key={invoice.id} className="border rounded-lg p-4" data-testid={`invoice-${invoice.id}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{invoice.client?.name || "Unknown Client"}</h3>
                              <p className="text-sm text-muted-foreground">{invoice.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${parseFloat(invoice.amount).toFixed(2)}</div>
                              <Badge variant={invoice.status === "paid" ? "secondary" : "default"}>
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>
                          {invoice.hostedInvoiceUrl && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(invoice.hostedInvoiceUrl, "_blank")}
                              data-testid={`button-view-invoice-${invoice.id}`}
                            >
                              View Invoice
                            </Button>
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