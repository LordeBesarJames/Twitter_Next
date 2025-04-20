"use client";
import React, { useState, useRef, useContext } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineRetweet,
  AiOutlinePicture,
} from "react-icons/ai";
import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";
import { IoShareOutline, IoStatsChartOutline } from "react-icons/io5";
import { HiOutlineGif } from "react-icons/hi2";
import { MdOutlinePoll, MdOutlineEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useAuth } from "@/context/auth-context";
import { TweetContext, Tweet } from "@/context/tweet-content";

const MainComponent = () => {
  const { authState } = useAuth();
  const {
    tweets,
    addTweet,
    likeTweet: likeTweetContext,
    retweetTweet,
    deleteTweet,
    updateTweet,
  } = useContext(TweetContext);
  const [tweetContent, setTweetContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [scheduledTime, setScheduledTime] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingTweetId, setEditingTweetId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingTweetId) {
          setEditImageUrl(reader.result as string);
        } else {
          setSelectedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const postTweet = () => {
    if (!tweetContent.trim() && !selectedImage && !pollQuestion) return;

    const newTweet: Tweet = {
      id: Date.now().toString(),
      content: tweetContent,
      name: authState.user?.username || "User",
      username: authState.user?.username.toLowerCase() || "user",
      timestamp: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      views: Math.floor(Math.random() * 100),
      isLiked: false,
    };

    if (selectedImage) {
      newTweet.imageUrl = selectedImage;
    }

    if (pollQuestion && pollOptions.some((opt) => opt.trim())) {
      newTweet.poll = {
        question: pollQuestion,
        options: pollOptions.filter((opt) => opt.trim()),
        votes: new Array(pollOptions.length).fill(0),
      };
    }

    addTweet(newTweet);
    setTweetContent("");
    setSelectedImage(null);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowPollForm(false);
    setScheduledTime("");
  };

  const handleLikeTweet = (id: string) => {
    likeTweetContext(id);
  };

  const handleRetweet = (id: string) => {
    retweetTweet(id);
  };

  const startReply = (id: string) => {
    setReplyingTo(id);
  };

  const postReply = () => {
    if (!replyContent.trim()) return;
    const newReply: Tweet = {
      id: Date.now().toString(),
      content: replyContent,
      name: authState.user?.username || "User",
      username: authState.user?.username.toLowerCase() || "user",
      timestamp: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      views: 0,
      isLiked: false,
    };

    addTweet(newReply);
    setReplyingTo(null);
    setReplyContent("");
  };

  const startEdit = (tweet: Tweet) => {
    setEditingTweetId(tweet.id);
    setEditContent(tweet.content);
    setEditImageUrl(tweet.imageUrl || null);
    setShowDropdown(null);
  };

  const cancelEdit = () => {
    setEditingTweetId(null);
    setEditContent("");
    setEditImageUrl(null);
  };

  const saveEdit = () => {
    if (!editContent.trim() && !editImageUrl) return;

    const updatedTweet = {
      id: editingTweetId!,
      content: editContent,
      imageUrl: editImageUrl,
    };

    updateTweet(updatedTweet);
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this tweet?")) {
      deleteTweet(id);
      setShowDropdown(null);
    }
  };

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  return (
    <main className="flex h-full min-h-screen w-[60%] flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
      <h1 className="sticky top-0 bg-black/10 p-6 text-xl font-bold backdrop-blur">
        Home
      </h1>
      <div className="relative flex items-stretch space-x-2 border-b-[0.5px] border-t-[0.5px] border-gray-600 px-4 py-6">
        <div className="h-10 w-10 flex-none rounded-full bg-slate-400"></div>
        <div className="flex h-full w-full flex-col">
          <input
            type="text"
            className="h-full w-full border-b-[0.5px] border-none border-gray-600 bg-transparent p-4 text-2xl outline-none placeholder:text-gray-600"
            placeholder="what's happening?"
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
          />
          {selectedImage && (
            <div className="relative my-2">
              <img
                src={selectedImage}
                alt="Tweet content"
                className="max-h-80 rounded-xl object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white"
              >
                ×
              </button>
            </div>
          )}
          {showPollForm && (
            <div className="my-4 rounded-lg bg-gray-800 p-4">
              <input
                type="text"
                placeholder="Ask a question..."
                className="w-full bg-transparent p-2 text-white outline-none"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
              />
              {pollOptions.map((option, index) => (
                <div key={index} className="my-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className="w-full bg-gray-700 p-2 text-white outline-none"
                    value={option}
                    onChange={(e) =>
                      handlePollOptionChange(index, e.target.value)
                    }
                  />
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button onClick={addPollOption} className="mt-2 text-blue-500">
                  Add option
                </button>
              )}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setShowPollForm(false)}
                  className="rounded-full px-4 py-1 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPollForm(false)}
                  className="rounded-full bg-blue-500 px-4 py-1 text-white"
                >
                  Done
                </button>
              </div>
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-0 py-2 ml-1 justify-between">
              {/* Photo Icon */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group rounded-full p-2 transition-colors duration-200 hover:bg-blue-100/10"
                style={{ color: "rgb(29,155,240)" }}
              >
                <AiOutlinePicture className="h-5 w-5 group-hover:opacity-80" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </button>

              {/* GIF Icon */}
              <button
                onClick={() => setShowGifPicker(!showGifPicker)}
                className="group rounded-full p-2 transition-colors duration-200 hover:bg-blue-100/10"
                style={{ color: "rgb(29,155,240)" }}
              >
                <HiOutlineGif className="h-5 w-5 group-hover:opacity-80" />
              </button>

              {/* Poll Icon */}
              <button
                onClick={() => setShowPollForm(!showPollForm)}
                className="group rounded-full p-2 transition-colors duration-200 hover:bg-blue-100/10"
                style={{ color: "rgb(29,155,240)" }}
              >
                <MdOutlinePoll className="h-5 w-5 group-hover:opacity-80" />
              </button>

              {/* Schedule Icon */}
              <button
                className="group rounded-full p-2 transition-colors duration-200 hover:bg-blue-100/10"
                style={{ color: "rgb(29,155,240)" }}
              >
                <RiCalendarScheduleLine className="h-5 w-5 group-hover:opacity-80" />
              </button>
            </div>
            <div className="w-full max-w-[100px]">
              <button
                onClick={postTweet}
                className="w-full cursor-pointer rounded-full px-4 py-2 text-center text-lg font-bold transition duration-200 hover:opacity-70"
                style={{ backgroundColor: "rgb(29,155,240)" }}
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {tweets.map((tweet) => (
          <div
            key={tweet.id}
            className="flex space-x-4 border-b-[0.5px] border-gray-600 p-2 py-4"
          >
            <div className="h-10 w-10 flex-none rounded-full bg-slate-200"></div>
            <div className="flex flex-col w-full">
              <div className="flex w-full items-center justify-between">
                <div className="flex w-full items-center space-x-1">
                  <div className="font-semibold">{tweet.name}</div>
                  <div className="text-gray-500">@{tweet.username}</div>
                  <div className="text-gray-500">
                    <BsDot />
                  </div>
                  <div className="text-gray-500">
                    {new Date(tweet.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(tweet.id)}
                    className="rounded-full p-2 hover:bg-gray-600/50"
                  >
                    <BsThreeDots />
                  </button>
                  {showDropdown === tweet.id && (
                    <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-gray-800 shadow-lg">
                      {tweet.username ===
                        authState.user?.username.toLowerCase() && (
                        <>
                          <button
                            onClick={() => startEdit(tweet)}
                            className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tweet.id)}
                            className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      <button className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700">
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {editingTweetId === tweet.id ? (
                <div className="mt-2">
                  <textarea
                    className="w-full bg-transparent text-white outline-none"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  {editImageUrl && (
                    <div className="relative my-2">
                      <img
                        src={editImageUrl}
                        alt="Edit content"
                        className="max-h-80 rounded-xl object-contain"
                      />
                      <button
                        onClick={() => setEditImageUrl(null)}
                        className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={cancelEdit}
                      className="rounded-full px-4 py-1 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      disabled={!editContent.trim() && !editImageUrl}
                      className="rounded-full bg-blue-500 px-4 py-1 text-white disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full p-1 text-blue-500"
                    >
                      <AiOutlinePicture className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-base text-white">{tweet.content}</div>

                  {tweet.imageUrl && (
                    <div className="mt-2 aspect-square w-full rounded-xl overflow-hidden">
                      <img
                        src={tweet.imageUrl}
                        alt="Tweet content"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {tweet.poll && (
                    <div className="mt-2 rounded-lg bg-gray-800 p-4">
                      <div className="font-bold mb-2">
                        {tweet.poll.question}
                      </div>
                      {tweet.poll.options.map((option, index) => (
                        <div key={index} className="my-1">
                          <button className="w-full text-left p-2 rounded-full border border-gray-600 hover:bg-gray-700">
                            {option}
                          </button>
                        </div>
                      ))}
                      <div className="text-sm text-gray-400 mt-2">
                        {tweet.poll.votes
                          ? tweet.poll.votes.reduce((a, b) => a + b, 0)
                          : 0}{" "}
                        votes
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex w-full items-center justify-around space-x-20">
                    <button
                      onClick={() => startReply(tweet.id)}
                      className="cursor-pointer rounded-full p-3 transition duration-200 hover:bg-white/10"
                    >
                      <BsChat />
                    </button>
                    <button
                      onClick={() => handleRetweet(tweet.id)}
                      className="cursor-pointer rounded-full p-3 transition duration-200 hover:bg-white/10"
                    >
                      <AiOutlineRetweet />
                      {tweet.retweets > 0 && (
                        <span className="ml-1 text-xs">{tweet.retweets}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleLikeTweet(tweet.id)}
                      className="cursor-pointer rounded-full p-3 transition duration-200 hover:bg-white/10"
                    >
                      {tweet.isLiked ? (
                        <AiFillHeart className="text-red-500" />
                      ) : (
                        <AiOutlineHeart />
                      )}
                      {tweet.likes > 0 && (
                        <span className="ml-1 text-xs">{tweet.likes}</span>
                      )}
                    </button>
                    <button className="cursor-pointer rounded-full p-3 transition duration-200 hover:bg-white/10">
                      <IoStatsChartOutline />
                      {tweet.views > 0 && (
                        <span className="ml-1 text-xs">{tweet.views}</span>
                      )}
                    </button>
                    <button className="cursor-pointer rounded-full p-3 transition duration-200 hover:bg-white/10">
                      <IoShareOutline />
                    </button>
                  </div>
                </>
              )}

              {replyingTo === tweet.id && (
                <div className="mt-4 flex space-x-2">
                  <div className="h-8 w-8 flex-none rounded-full bg-slate-200"></div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Tweet your reply"
                      className="w-full bg-transparent p-2 text-white outline-none"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={postReply}
                        disabled={!replyContent.trim()}
                        className="rounded-full bg-blue-500 px-4 py-1 text-white disabled:opacity-50"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MainComponent;
