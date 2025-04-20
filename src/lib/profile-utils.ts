// lib/profile-utils.ts
import { User } from "./auth-dummy";

export interface Profile {
  username: string;
  name: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  profileImage: string;
  coverImage: string;
}

const PROFILE_STORAGE_KEY = "user-profiles";

// Get default profile for a user
export const getDefaultProfile = (user: User): Profile => {
  return {
    username: user.username,
    name: user.username,
    bio: "This is my bio. I love coding and building things!",
    location: "San Francisco, CA",
    website: "example.com",
    joinDate: `Joined ${new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    })}`,
    profileImage: "/api/placeholder/200/200",
    coverImage: "/api/placeholder/600/200",
  };
};

// Get profile for a specific user
export const getUserProfile = (username: string): Profile | null => {
  try {
    const profilesStr = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!profilesStr) return null;

    const profiles = JSON.parse(profilesStr) as Record<string, Profile>;
    return profiles[username] || null;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return null;
  }
};

// Save profile data
export const saveUserProfile = (profile: Profile): void => {
  try {
    const profilesStr = localStorage.getItem(PROFILE_STORAGE_KEY);
    const profiles = profilesStr ? JSON.parse(profilesStr) : {};

    profiles[profile.username] = profile;
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error("Failed to save user profile:", error);
  }
};

// Update or initialize profile from user data
export const initializeUserProfile = (user: User): Profile => {
  const existingProfile = getUserProfile(user.username);

  if (existingProfile) {
    return existingProfile;
  }

  const newProfile = getDefaultProfile(user);
  saveUserProfile(newProfile);
  return newProfile;
};
