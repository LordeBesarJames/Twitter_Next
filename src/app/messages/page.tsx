// app/messages/page.tsx
"use client";
import React, { useState } from "react";
import { BsTwitter, BsSearch, BsThreeDots } from "react-icons/bs";
import LeftSidebar from "../../component/leftsidebar";
import RightComponent from "../../component/rightcomponent";

const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState("Primary");
  const [conversations, setConversations] = useState([
    {
      id: 1,
      user: "React Official",
      username: "reactjs",
      lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.!",
      time: "2h",
      unread: true,
    },
    {
      id: 2,
      user: "Next.js",
      username: "nextjs",
      lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "4h",
      unread: false,
    },
  ]);

  return (
    <div className="w-full h-full flex justify-center items-center relative bg-black">
      <div className="max-w-[70vw] w-full h-full flex relative">
        <LeftSidebar />
        <main className="flex h-full min-h-screen w-[60%] flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="sticky top-0 z-10 bg-black/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Messages</h1>
              <div className="flex space-x-4">
                <button className="rounded-full p-2 hover:bg-gray-800">
                  <BsSearch className="h-5 w-5" />
                </button>
                <button className="rounded-full p-2 hover:bg-gray-800">
                  <BsThreeDots className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex border-b border-gray-600">
              {["Primary", "General", "Requests"].map((tab) => (
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
          </div>

          <div className="flex flex-col">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-start space-x-3 border-b border-gray-600 p-4 ${
                  conversation.unread ? "bg-blue-900/10" : ""
                }`}
              >
                <div className="h-12 w-12 rounded-full bg-gray-400"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold">{conversation.user}</span>
                      <span className="text-gray-500">
                        @{conversation.username}
                      </span>
                    </div>
                    <span className="text-gray-500">{conversation.time}</span>
                  </div>
                  <div className="mt-1 text-gray-300">
                    {conversation.lastMessage}
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

export default MessagesPage;
