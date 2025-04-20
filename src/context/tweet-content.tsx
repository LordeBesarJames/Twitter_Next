"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface Tweet {
  id: string;
  username: string;
  name: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  views: number;
  isLiked: boolean;
  imageUrl?: string | null;
  poll?: {
    question: string;
    options: string[];
    votes?: number[];
  } | null;
  replies?: Tweet[];
}

interface TweetContextType {
  tweets: Tweet[];
  addTweet: (tweet: Tweet) => void;
  likeTweet: (tweetId: string) => void;
  retweetTweet: (tweetId: string) => void;
  deleteTweet: (tweetId: string) => void;
  updateTweet: (updatedTweet: {
    id: string;
    content: string;
    imageUrl?: string | null;
  }) => void;
  getUserTweets: (username: string) => Tweet[];
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>;
}

export const TweetContext = createContext<TweetContextType>({
  tweets: [],
  addTweet: () => {},
  likeTweet: () => {},
  retweetTweet: () => {},
  deleteTweet: () => {},
  updateTweet: () => {},
  getUserTweets: () => [],
  setTweets: () => {},
});

interface TweetProviderProps {
  children: ReactNode;
}

export const TweetProvider: React.FC<TweetProviderProps> = ({ children }) => {
  const [tweets, setTweets] = useState<Tweet[]>(() => {
    if (typeof window !== "undefined") {
      const savedTweets = localStorage.getItem("tweets");
      return savedTweets
        ? JSON.parse(savedTweets)
        : [
            {
              id: "1",
              username: "CrocodiloBombardilo",
              name: "Minta maaf yang banyak, tapi materi gacor",
              content: "Maaf Kurang Maksimal Lord Materi 2",
              timestamp: new Date().toISOString(),
              likes: 42,
              retweets: 12,
              views: 1024,
              isLiked: false,
            },
            {
              id: "2",
              username: "twitter",
              name: "Twitter",
              content: "Selamat datang di Ambatu Twitter",
              timestamp: new Date(
                Date.now() - 24 * 60 * 60 * 1000
              ).toISOString(),
              likes: 320,
              retweets: 87,
              views: 5230,
              isLiked: false,
            },
          ];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tweets", JSON.stringify(tweets));
    }
  }, [tweets]);

  const addTweet = (tweet: Tweet) => {
    setTweets((prevTweets) => [tweet, ...prevTweets]);
  };

  const likeTweet = (tweetId: string) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1,
              isLiked: !tweet.isLiked,
            }
          : tweet
      )
    );
  };

  const retweetTweet = (tweetId: string) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId
          ? { ...tweet, retweets: tweet.retweets + 1 }
          : tweet
      )
    );
  };

  const deleteTweet = (tweetId: string) => {
    setTweets((prevTweets) =>
      prevTweets.filter((tweet) => tweet.id !== tweetId)
    );
  };

  const updateTweet = (updatedTweet: {
    id: string;
    content: string;
    imageUrl?: string | null;
  }) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === updatedTweet.id
          ? {
              ...tweet,
              content: updatedTweet.content,
              imageUrl: updatedTweet.imageUrl,
            }
          : tweet
      )
    );
  };

  const getUserTweets = (username: string) => {
    return tweets.filter(
      (tweet) => tweet.username.toLowerCase() === username.toLowerCase()
    );
  };

  return (
    <TweetContext.Provider
      value={{
        tweets,
        addTweet,
        likeTweet,
        retweetTweet,
        deleteTweet,
        updateTweet,
        getUserTweets,
        setTweets,
      }}
    >
      {children}
    </TweetContext.Provider>
  );
};
