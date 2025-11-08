import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Portfolio from "@/pages/Portfolio";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Protected route component
function ProtectedRoute({ component: Component }: { component: any }) {
  const [, setLocation] = useLocation();
  const { data: authStatus, isLoading, error } = useQuery<{authenticated: boolean; user?: any}>({
    queryKey: ["/api/auth/status"],
    retry: 1,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    // Only redirect to login if we've finished loading and user is not authenticated
    if (!isLoading && !error && !authStatus?.authenticated) {
      setLocation("/login");
    }
  }, [authStatus, isLoading, error, setLocation]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">Loading...</div>
      </div>
    </div>;
  }

  if (error || !authStatus?.authenticated) {
    // This shouldn't be shown as we redirect in useEffect, but just in case
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin">
        {() => <ProtectedRoute component={Admin} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
