"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { dummyGetCurrentUser } from "@/lib/auth-dummy";
import {
  initializeUserProfile,
  getUserProfile,
  saveUserProfile,
  Profile,
} from "@/lib/profile-utils";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (profileData: Partial<Profile>) => void;
  getUserProfile: () => Profile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from storage and check dummy auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check localStorage first (standard auth)
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          const user = JSON.parse(userStr);
          setAuthState({
            isAuthenticated: true,
            token,
            user,
          });

          // Initialize user profile if it doesn't exist
          if (user) {
            initializeUserProfile(user);
          }
        } else {
          // Try loading from dummy auth if standard auth failed
          const dummyUser = await dummyGetCurrentUser();
          if (dummyUser) {
            const dummyToken =
              localStorage.getItem("AUTH_KEY") || "dummy-token";
            setAuthState({
              isAuthenticated: true,
              user: dummyUser,
              token: dummyToken,
            });

            // Initialize profile for dummy user
            initializeUserProfile(dummyUser);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setAuthState({
      isAuthenticated: true,
      token,
      user,
    });

    // Initialize or get existing profile
    initializeUserProfile(user);

    toast.success(`Welcome back, ${user.username}!`);
  };

  const logout = () => {
    // Clear all auth-related storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("dummy-auth"); // Also clear dummy auth
    document.cookie = "token=; path=/;   expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
    });

    router.push("/auth/login");
    toast.info("You have been logged out");
  };

  // Get current user's profile
  const getCurrentUserProfile = () => {
    if (!authState.user) return null;
    return getUserProfile(authState.user.username);
  };

  // Update user profile
  const updateUserProfile = (profileData: Partial<Profile>) => {
    if (!authState.user) return;

    const currentProfile = getUserProfile(authState.user.username);
    if (!currentProfile) return;

    const updatedProfile = { ...currentProfile, ...profileData };
    saveUserProfile(updatedProfile);

    // If profile image is updated, also update user avatar in auth state
    if (profileData.profileImage && authState.user) {
      const updatedUser = {
        ...authState.user,
        avatar: profileData.profileImage,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAuthState((prev) => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        isLoading,
        updateUserProfile,
        getUserProfile: getCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
