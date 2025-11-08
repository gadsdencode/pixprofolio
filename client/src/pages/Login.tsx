import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Mail, Lock } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("LOGIN: Starting login process...");
    setIsLoading(true);
    
    try {
      console.log("LOGIN: Sending request to /api/login");
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // CRITICAL: Include cookies in request
        body: JSON.stringify(data),
      });

      console.log("LOGIN: Response received", { ok: response.ok, status: response.status });
      const result = await response.json();
      console.log("LOGIN: Response JSON", result);

      if (response.ok && result.success) {
        console.log("LOGIN: Success! Showing toast...");
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        console.log("LOGIN: Invalidating auth queries...");
        // Force refresh auth status and wait for it to complete
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/status"] });
        await queryClient.refetchQueries({ queryKey: ["/api/auth/status"] });
        
        console.log("LOGIN: Setting timeout for redirect...");
        // Small delay to ensure state updates
        setTimeout(() => {
          console.log("LOGIN: ATTEMPTING REDIRECT TO /admin");
          window.location.href = "/admin"; // Use hard navigation to ensure clean state
          console.log("LOGIN: window.location.href = '/admin' executed");
        }, 100);
      } else {
        console.log("LOGIN: Failed", { responseOk: response.ok, resultSuccess: result.success });
        toast({
          title: "Login failed",
          description: result.error || "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("LOGIN: Error during login:", error);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("LOGIN: Setting isLoading to false");
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16">
        <Card className="w-full max-w-md mx-4 border-accent/20 bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="pl-10 bg-background/50" 
                            {...field} 
                            data-testid="input-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            className="pl-10 bg-background/50" 
                            {...field} 
                            data-testid="input-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground text-center w-full">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Create one here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}