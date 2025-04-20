"use client";

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useAuth } from "@/context/auth-context";

interface ErrorResponse {
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

interface LoginSuccessResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const useLoginMutation = () => {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation<
    LoginSuccessResponse,
    AxiosError<ErrorResponse>,
    { email: string; password: string }
  >({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Panggil fungsi login dari context
      login(data.token, data.user);

      // Tampilkan notifikasi sukses
      toast.success(`Welcome back, ${data.user.username}!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });

      // Redirect ke home page setelah delay
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
        const errorData = error.response.data;

        // Handle validation errors
        if (errorData?.errors) {
          errorData.errors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
          return;
        }

        // Handle specific status codes
        const errorMessage = errorData?.message || "Login failed";
        switch (error.response.status) {
          case 401:
            toast.error("Invalid email or password");
            break;
          case 404:
            toast.error("User not found");
            break;
          default:
            toast.error(errorMessage);
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    },
    retry: (failureCount, error) => {
      if (error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
