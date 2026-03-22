import type { LoginData } from "@/components/login-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

const baseUrl = "https://dummyjson.com";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image: string;
  role: string;
  company?: {
    name: string;
    title: string;
  };
}

interface AuthResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export const checkAuth = () => {
  return document.cookie.includes("@pitang/accessToken=");
};

export function useAuth() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const navigate = useNavigate();
  
  const isRefreshing = useRef(false);
  
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCookie = useCallback((name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  }, []);

  const handleLogout = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    
    document.cookie = "@pitang/accessToken=; path=/; Max-Age=0";
    document.cookie = "@pitang/refreshToken=; path=/; Max-Age=0";
    setLoggedUser(null);
    setShowRefreshModal(false);
    navigate({ to: "/login" });
  }, [navigate]);

  const startExpirationCheck = useCallback((expiresInMins: number) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const warningTime = (expiresInMins - 5) * 60 * 1000; 

    if (warningTime > 0) {
      refreshTimerRef.current = setTimeout(() => {
        if (checkAuth()) {
          setShowRefreshModal(true);
        }
      }, warningTime);
    }
  }, []);

  const performRefresh = useCallback(async () => {
    const refreshToken = getCookie("@pitang/refreshToken");
    if (!refreshToken || isRefreshing.current) return null;

    isRefreshing.current = true;
    try {
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: refreshToken,
          expiresInMins: 30, 
        }),
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data: AuthResponse = await response.json();

      document.cookie = `@pitang/accessToken=${data.accessToken}; path=/; Max-Age=86400; SameSite=Lax`;
      document.cookie = `@pitang/refreshToken=${data.refreshToken}; path=/; Max-Age=86400; SameSite=Lax`;
      
      setShowRefreshModal(false); 
      startExpirationCheck(30);   
      
      return data.accessToken;
    } catch (error) {
      handleLogout();
      return null;
    } finally {
      isRefreshing.current = false;
    }
  }, [getCookie, handleLogout, startExpirationCheck]);

  const fetchUserData = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        const newToken = await performRefresh();
        if (newToken) await fetchUserData(newToken); 
        return;
      }

      const data = await response.json();
      setLoggedUser(data);
      startExpirationCheck(30); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [performRefresh, startExpirationCheck]);

  useEffect(() => {
    const token = getCookie("@pitang/accessToken");
    if (token) {
      fetchUserData(token);
    } else {
      performRefresh().then((newToken) => {
        if (newToken) fetchUserData(newToken);
        else setIsLoading(false);
      });
    }
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [fetchUserData, getCookie, performRefresh]);

  async function handleLogin(e: React.FormEvent, data: LoginData) {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          expiresInMins: 30,
        }),
      });

      const json = await response.json();
      if (!response.ok) return toast.error(json.message);

      document.cookie = `@pitang/accessToken=${json.accessToken}; path=/; Max-Age=86400; SameSite=Lax`;
      document.cookie = `@pitang/refreshToken=${json.refreshToken}; path=/; Max-Age=86400; SameSite=Lax`;
      
      setLoggedUser(json);
      startExpirationCheck(30); 
      navigate({ to: "/dashboard" });
      toast.success("Welcome!");
    } catch (error) {
      toast.error("Login failed");
    }
  }

  return { 
    handleLogin, 
    handleLogout, 
    loggedUser, 
    isLoading,
    showRefreshModal,
    setShowRefreshModal,
    performRefresh
  };
}