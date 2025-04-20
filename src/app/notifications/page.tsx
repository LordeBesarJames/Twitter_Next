// app/notifications/page.tsx
"use client";
import React, { useState } from "react";
import { BsTwitter, BsCheck2, BsThreeDots } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import LeftSidebar from "../../component/leftsidebar";
import RightComponent from "../../component/rightcomponent";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "follow",
      user: "React Official",
      username: "reactjs",
      time: "2h",
      read: false,
    },
    {
      id: 2,
      type: "like",
      user: "Next.js",
      username: "nextjs",
      time: "4h",
      read: true,
    },
    {
      id: 3,
      type: "retweet",
      user: "TypeScript",
      username: "typescript",
      time: "6h",
      read: true,
    },
  ]);

  return (
    <div className="w-full h-full flex justify-center items-center relative bg-black">
      <div className="max-w-[70vw] w-full h-full flex relative">
        <LeftSidebar />
        <main className="flex h-full min-h-screen w-[60%] flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-black/10 p-4 backdrop-blur">
            <div>
              <h1 className="text-xl font-bold">Notifications</h1>
            </div>
            <button className="rounded-full p-2 hover:bg-gray-800">
              <HiOutlineSparkles className="h-5 w-5" />
            </button>
          </div>

          <div className="flex border-b border-gray-600">
            {["All", "Verified", "Mentions"].map((tab) => (
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
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 border-b border-gray-600 p-4 ${
                  !notification.read ? "bg-blue-900/10" : ""
                }`}
              >
                <div className="h-12 w-12 rounded-full bg-gray-400"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">{notification.user}</span>
                    <span className="text-gray-500">
                      @{notification.username}
                    </span>
                    <span className="text-gray-500">· {notification.time}</span>
                  </div>
                  <div className="mt-1">
                    {notification.type === "follow" && "followed you"}
                    {notification.type === "like" && "liked your tweet"}
                    {notification.type === "retweet" && "retweeted your tweet"}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {notification.type === "follow" && (
                    <button className="rounded-full border border-gray-600 px-4 py-1 font-bold hover:bg-gray-800">
                      Follow
                    </button>
                  )}
                  <button className="rounded-full p-1 hover:bg-gray-800">
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

export default NotificationsPage;
