"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { loginUser } from "@/lib/api/auth";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const { login, authState } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (authState.isAuthenticated) {
      router.push("/");
    }
  }, [authState.isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await loginUser({ email, password });

      // Update auth context
      login(response.token, response.user);

      toast.success(`Welcome back, ${response.user.username}!`);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - Twitter logo and branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#1DA1F2] items-center justify-center">
        <div className="text-white p-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-32 h-32 mx-auto mb-8 text-white fill-current"
          >
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
          </svg>

          <h1 className="text-4xl font-bold mb-6">Welcome to Twitter Ambatu</h1>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col p-6 md:p-12 justify-center">
        <div className="max-w-md w-full mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-12 h-12 mb-8 text-[#1DA1F2] fill-current"
          >
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
          </svg>

          <h2 className="text-3xl font-bold text-white mb-2">
            Sign in to Ambatu
          </h2>
          <p className="text-gray-500 mb-8">
            Gunakan Akun yang pernah di daftarkan
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:border-transparent"
                placeholder="Email address"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:border-transparent"
                placeholder="Password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DA1F2] disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 hover:text-[#1DA1F2] cursor-pointer">
                Forgot password?
              </span>
              <span className="text-sm text-gray-500 hover:text-[#1DA1F2] cursor-pointer">
                Sign up for Twitter
              </span>
            </div>
          </form>

          <div className="mt-8 p-4 border border-gray-800 rounded-lg bg-gray-900">
            <h3 className="text-white font-medium mb-2">Demo Accounts</h3>
            <p className="text-gray-400 text-sm mb-2">Akun Coba-coba:</p>
            <ul className="space-y-1 text-sm text-gray-400">
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white mr-2">
                  A
                </span>
                <span>ambatuDie@example.com</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-900 text-blue-300 rounded-full">
                  admin
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs text-white mr-2">
                  U
                </span>
                <span>user1@example.com</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-900 text-green-300 rounded-full">
                  user
                </span>
              </li>
            </ul>
            <p className="text-gray-500 text-xs mt-2">
              Password for all accounts: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
