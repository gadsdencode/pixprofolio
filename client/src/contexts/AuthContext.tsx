import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  provider?: string;
  profilePicture?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refetchAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: authStatus, isLoading, refetch } = useQuery<{
    authenticated: boolean;
    user?: User;
  }>({
    queryKey: ["/api/auth/status"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const user = authStatus?.authenticated ? authStatus.user ?? null : null;
  const isAuthenticated = !!user;

  // Set initialized once the initial auth check is done
  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        await refetch();
        setLocation("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refetchAuth = async () => {
    await refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: !isInitialized || isLoading,
        isAuthenticated,
        logout,
        refetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}