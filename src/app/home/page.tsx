"use client";

import LeftSidebar from "@/component/leftsidebar";
import MainComponent from "@/component/maincomponent";
import RightComponent from "@/component/rightcomponent";
import ProtectedRoute from "@/component/protected-route";
import { TweetProvider } from "@/context/tweet-content";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <TweetProvider>
        <div className="w-full h-full flex justify-center items-center relative bg-black">
          <div className="max-w-[70vw] w-full h-full flex relative">
            <LeftSidebar />
            <MainComponent />
            <RightComponent />
          </div>
        </div>
      </TweetProvider>
    </ProtectedRoute>
  );
}
