// lib/auth-dummy.ts
export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  avatar?: string;
}

const DUMMY_USERS: User[] = [
  {
    id: "1",
    username: "Ambatu",
    email: "ambatuDie@example.com",
    role: "admin",
    avatar: "/default-profile.png",
  },
  {
    id: "2",
    username: "user1",
    email: "user1@example.com",
    avatar: "/default-profile.png",
  },
];

const AUTH_KEY = "dummy-auth";

export const dummyLogin = (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = DUMMY_USERS.find((u) => u.email === email);

      if (user && password === "password123") {
        const token = Math.random().toString(36).substring(2);
        localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
        resolve({ user, token });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 500);
  });
};

export const dummyGetCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const authData = localStorage.getItem(AUTH_KEY);
    resolve(authData ? JSON.parse(authData).user : null);
  });
};

export const dummyLogout = (): Promise<void> => {
  localStorage.removeItem(AUTH_KEY);
  return Promise.resolve();
};
