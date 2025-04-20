"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { BsTwitter } from "react-icons/bs";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authState, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authState.isAuthenticated) {
      router.push("/auth/login");
    }
  }, [authState.isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center">
          <BsTwitter className="w-12 h-12 text-blue-500 mb-4 animate-pulse" />
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
