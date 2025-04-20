// File: hooks/useDummyAuth.ts
"use client";

import { useEffect, useState } from "react";
import {
  dummyGetCurrentUser,
  dummyLogin,
  dummyLogout,
  User,
} from "@/lib/auth-dummy";

export default function useDummyAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await dummyGetCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await dummyLogin(email, password);
      setUser(user);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await dummyLogout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
