import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface ExtendedError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  status?: number;
}

export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful! Please login.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      router.push("auth/login");
    },
    onError: (error: ExtendedError) => {
      console.error("Registration error:", error);

      // Handle field-specific errors
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach((err) => {
          toast.error(`${err.field}: ${err.message}`, {
            position: "top-center",
            autoClose: 7000,
          });
        });
        return;
      }

      // Handle HTTP errors
      switch (error.status) {
        case 400:
          toast.error("Invalid request data. Please check your input.", {
            position: "top-center",
          });
          break;
        case 409:
          toast.error("User already exists with this email or username.", {
            position: "top-center",
          });
          break;
        case 404:
          toast.error(
            "Registration service unavailable. Please try again later.",
            {
              position: "top-center",
            }
          );
          break;
        case 500:
          toast.error("Server error. Please try again later.", {
            position: "top-center",
          });
          break;
        default:
          toast.error(
            error.message || "Registration failed. Please try again.",
            {
              position: "top-center",
            }
          );
      }
    },
    retry: (failureCount, error: ExtendedError) => {
      // Don't retry on 4xx errors (except 429)
      if (
        error.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 429
      ) {
        return false;
      }
      // Retry max 3 times
      return failureCount < 3;
    },
  });
};
