"use client";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useAuth } from "@/context/auth-context";

interface TrendingTopic {
  id: number;
  title: string;
  tweets: number;
  category?: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  isFollowing: boolean;
}

const RightComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  const { authState } = useAuth();

  const trendingTopics: TrendingTopic[] = [
    { id: 1, title: "#TwitterClone", tweets: 35400, category: "Technology" },
    { id: 2, title: "#ReactJS", tweets: 28400, category: "Programming" },
    { id: 3, title: "#NextJS", tweets: 19800, category: "Web Development" },
    { id: 4, title: "#TypeScript", tweets: 15600 },
    { id: 5, title: "#WebDev", tweets: 12300, category: "Technology" },
  ];

  const usersToFollow: User[] = [
    { id: 1, name: "React Official", username: "reactjs", isFollowing: false },
    { id: 2, name: "Next.js", username: "nextjs", isFollowing: false },
    { id: 3, name: "TypeScript", username: "typescript", isFollowing: false },
    { id: 4, name: "Vercel", username: "vercel", isFollowing: false },
    {
      id: 5,
      name: "Tailwind CSS",
      username: "tailwindcss",
      isFollowing: false,
    },
  ];

  const handleFollow = (userId: number) => {
    setFollowedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleTopicClick = (topic: string) => {
    // In a real app, this would navigate to the topic page
    console.log(`Navigating to topic: ${topic}`);
  };

  return (
    <section className="sticky top-2 mt-2 flex h-screen w-[30%] flex-col items-stretch overflow-y-scroll px-6">
      <div>
        <div className="group relative h-full w-full">
          <input
            id="searchbox"
            type="text"
            placeholder="Search Twitter"
            className="peer h-full w-full rounded-full border-2 bg-neutral-900/90 py-4 pl-14 pr-4 outline-none focus:border-[rgb(29,155,240)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <label
            htmlFor="searchbox"
            className="absolute left-0 top-0 flex h-full items-center justify-center p-4 peer-focus:text-[rgb(29,155,240)]"
          >
            <BsSearch className="h-5 w-5" />
          </label>
        </div>
      </div>
      <div className="my-4 flex flex-col rounded-xl bg-neutral-900">
        <h3 className="my-2 px-4 text-xl font-bold">What's Happening</h3>
        <div>
          {trendingTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic.title)}
              className="cursor-pointer p-4 transition duration-200 last:rounded-b-xl hover:bg-white/10"
            >
              <div className="text-xs text-neutral-400">
                {topic.category || "Trending"}
              </div>
              <div className="text-lg font-bold">{topic.title}</div>
              <div className="text-xs text-neutral-400">
                {topic.tweets.toLocaleString()} Tweets
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="my-4 flex flex-col rounded-xl bg-neutral-900">
        <h3 className="my-2 px-4 text-xl font-bold">Who to Follow</h3>
        <div>
          {usersToFollow.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 transition duration-200 last:rounded-b-xl hover:bg-white/10"
            >
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 flex-none rounded-full bg-neutral-600"></div>
                <div className="flex flex-col">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-gray-500">@{user.username}</div>
                </div>
              </div>

              <button
                onClick={() => handleFollow(user.id)}
                className={`rounded-full px-6 py-2 ${
                  followedUsers.includes(user.id)
                    ? "bg-transparent border border-gray-600 text-white"
                    : "bg-white text-neutral-950"
                }`}
              >
                {followedUsers.includes(user.id) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightComponent;
