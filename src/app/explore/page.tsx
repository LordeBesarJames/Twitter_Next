// app/explore/page.tsx
"use client";
import React, { useState } from "react";
import { BsSearch, BsThreeDots, BsTwitter } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import LeftSidebar from "../../component/leftsidebar";
import RightComponent from "../../component/rightcomponent";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ForYou");

  const trendingTopics = [
    {
      id: 1,
      category: "Technology",
      title: "#TwitterClone",
      tweets: "35.4K Tweets",
    },
    {
      id: 2,
      category: "Programming",
      title: "#ReactJS",
      tweets: "28.4K Tweets",
    },
    { id: 3, category: "Web Dev", title: "#NextJS", tweets: "18.8K Tweets" },
    {
      id: 4,
      category: "Trending",
      title: "#TypeScript",
      tweets: "15.9K Tweets",
    },
    { id: 5, category: "Technology", title: "#WebDev", tweets: "12.3K Tweets" },
  ];

  return (
    <div className="w-full h-full flex justify-center items-center relative bg-black">
      <div className="max-w-[70vw] w-full h-full flex relative">
        <LeftSidebar />
        <main className="flex h-full min-h-screen w-[60%] flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="sticky top-0 z-10 bg-black/10 p-4 backdrop-blur">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <BsSearch className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search Twitter"
                className="w-full rounded-full border-none bg-gray-800 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-4 flex border-b border-gray-600">
              {["ForYou", "Trending", "News", "Sports", "Entertainment"].map(
                (tab) => (
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
                )
              )}
            </div>
          </div>

          <div className="flex flex-col">
            {trendingTopics.map((topic) => (
              <div
                key={topic.id}
                className="cursor-pointer border-b border-gray-600 p-4 hover:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500">
                      {topic.category}
                    </div>
                    <div className="mt-1 font-bold">{topic.title}</div>
                    <div className="text-xs text-gray-500">{topic.tweets}</div>
                  </div>
                  <button className="text-gray-500 hover:text-blue-500">
                    <BsThreeDots />
                  </button>
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

export default ExplorePage;
