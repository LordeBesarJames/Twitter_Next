// app/bookmarks/page.tsx
"use client";
import React from "react";
import { BsTwitter, BsThreeDots } from "react-icons/bs";
import LeftSidebar from "../../component/leftsidebar";
import RightComponent from "../../component/rightcomponent";

const BookmarksPage = () => {
  const bookmarkedTweets = [
    {
      id: 1,
      user: "React Official",
      username: "reactjs",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. !",
      time: "2h",
      likes: 1200,
      retweets: 450,
    },
    {
      id: 2,
      user: "Next.js",
      username: "nextjs",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
      time: "4h",
      likes: 980,
      retweets: 320,
    },
  ];

  return (
    <div className="w-full h-full flex justify-center items-center relative bg-black">
      <div className="max-w-[70vw] w-full h-full flex relative">
        <LeftSidebar />
        <main className="flex h-full min-h-screen w-[50%] flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <h1 className="sticky top-0 bg-black/50 p-6 text-xl font-bold backdrop-blur">
            Bookmarks <p className="text-sm text-gray-500">@AmbatuRPL</p>
          </h1>

          <div className="flex flex-col">
            {bookmarkedTweets.map((tweet) => (
              <div
                key={tweet.id}
                className="flex items-start space-x-3 border-b border-gray-600 p-4"
              >
                <div className="h-12 w-12 rounded-full bg-gray-400"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold">{tweet.user}</span>
                      <span className="text-gray-500">@{tweet.username}</span>
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

export default BookmarksPage;
