"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  BsTwitter,
  BsThreeDots,
  BsCalendar,
  BsPinMap,
  BsCamera,
} from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import LeftSidebar from "@/component/leftsidebar";
import RightComponent from "@/component/rightcomponent";
import { useAuth } from "@/context/auth-context";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { authState, updateUserProfile, getUserProfile } = useAuth();
  const router = useRouter();
  const profileImageRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("Tweets");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "Bio Ambatu si admin twitter gacor",
    location: "San Francisco, CA",
    website: "example.com",
    joinDate: "Joined June 2015",
    profileImage: "/api/placeholder/200/200",
    coverImage: "/api/placeholder/600/200",
  });

  const tweets = [
    {
      id: 1,
      content: "MATERI 2 GILAA ",
      time: "2h",
      likes: 120,
      retweets: 45,
    },
    {
      id: 2,
      content: "saya sudah berusaha semaksimal mungkin",
      time: "1d",
      likes: 89,
      retweets: 12,
    },
  ];

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (authState.user) {
      const userProfile = getUserProfile();

      setProfile((prev) => ({
        ...prev,
        name: authState.user?.username || "User",
        username: authState.user?.username || "",
        profileImage: authState.user?.avatar || "/api/placeholder/200/200",
        ...(userProfile
          ? {
              bio: userProfile.bio,
              location: userProfile.location,
              website: userProfile.website,
              joinDate: userProfile.joinDate,
              coverImage: userProfile.coverImage,
            }
          : {}),
      }));
    }
  }, [authState, router, getUserProfile]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = event.target?.result as string;
        setProfile((prev) => ({
          ...prev,
          profileImage: newImage,
        }));
        if (authState.user?.username) {
          updateUserProfile({ profileImage: newImage });
        }
        toast.success("Profile image updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = event.target?.result as string;
        setProfile((prev) => ({
          ...prev,
          coverImage: newImage,
        }));
        if (authState.user?.username) {
          updateUserProfile({ coverImage: newImage });
        }
        toast.success("Cover image updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    if (!authState.user?.username) return;

    updateUserProfile({
      name: profile.name,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
    });

    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  if (!authState.user) {
    return null;
  }

  return (
    <div className="w-full h-full flex justify-center items-center relative bg-black">
      <div className="max-w-[70vw] w-full h-full flex relative">
        <LeftSidebar />
        <main className="flex h-full min-h-screen w-[60%] flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="sticky top-0 z-10 bg-black/10 p-4 backdrop-blur">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-xl font-bold">{profile.name}</h1>
                <p className="text-sm text-gray-500">3,245 Tweets</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="h-48 w-full bg-gray-600 relative overflow-hidden"
              style={{
                backgroundImage: `url(${profile.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <button
                onClick={() => coverImageRef.current?.click()}
                className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
              >
                <BsCamera size={20} />
              </button>
              <input
                type="file"
                ref={coverImageRef}
                onChange={handleCoverImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="absolute left-4 top-36 h-24 w-24 rounded-full border-4 border-black bg-gray-400 overflow-hidden">
              {profile.profileImage && (
                <div className="w-full h-full relative">
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => profileImageRef.current?.click()}
                    className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <BsCamera size={20} />
                  </button>
                </div>
              )}
              <input
                type="file"
                ref={profileImageRef}
                onChange={handleProfileImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-16 px-4">
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 rounded-full border border-gray-600 px-4 py-1.5 font-bold hover:bg-gray-800"
              >
                <FiEdit />
                <span>Edit profile</span>
              </button>
            </div>

            {isEditing ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="mt-1 w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    className="mt-1 w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    className="mt-1 w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Website
                  </label>
                  <input
                    type="text"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    className="mt-1 w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-full px-4 py-1.5 font-bold text-white hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="rounded-full bg-white px-4 py-1.5 font-bold text-black hover:bg-gray-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-gray-500">@{profile.username}</p>
                <p className="mt-3">{profile.bio}</p>
                <div className="mt-3 flex space-x-4 text-gray-500">
                  <div className="flex items-center space-x-1">
                    <BsPinMap />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BsCalendar />
                    <span>{profile.joinDate}</span>
                  </div>
                </div>
                <div className="mt-3 flex space-x-5">
                  <div>
                    <span className="font-bold">1,234</span>{" "}
                    <span className="text-gray-500">Following</span>
                  </div>
                  <div>
                    <span className="font-bold">5,678</span>{" "}
                    <span className="text-gray-500">Followers</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex border-b border-gray-600">
            {["Tweets", "Replies", "Media", "Likes"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 font-medium ${
                  activeTab === tab
                    ? "text-white border-b-4 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col">
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="flex items-start space-x-3 border-b border-gray-600 p-4"
              >
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold">{profile.name}</span>
                      <span className="text-gray-500">@{profile.username}</span>
                      <span className="text-gray-500">· {tweet.time}</span>
                    </div>
                    <button className="rounded-full p-1 hover:bg-gray-800">
                      <BsThreeDots />
                    </button>
                  </div>
                  <div className="mt-1 text-white">{tweet.content}</div>
                  <div className="mt-2 flex space-x-4 text-gray-500">
                    <span>{tweet.likes} Likes</span>
                    <span>{tweet.retweets} Retweets</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <RightComponent />
      </div>
    </div>
  );
};

export default ProfilePage;
