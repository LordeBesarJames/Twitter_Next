// Modifikasi untuk LeftSidebar.tsx
"use client";
import React, { useState, useRef, useContext } from "react";
import { IoHome, IoHomeOutline } from "react-icons/io5";
import { HiHashtag, HiOutlineHashtag } from "react-icons/hi";
import {
  BsBell,
  BsBellFill,
  BsBookmark,
  BsBookmarkFill,
  BsEnvelope,
  BsEnvelopeFill,
  BsThreeDots,
  BsTwitter,
  BsX,
} from "react-icons/bs";
import { BiUser, BiSolidUser } from "react-icons/bi";
import { CgMoreO } from "react-icons/cg";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { AiOutlinePicture } from "react-icons/ai";
import { HiOutlineGif } from "react-icons/hi2";
import { MdOutlinePoll, MdOutlineEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { TweetContext } from "@/context/tweet-content";

const NAVIGATION_ITEMS = [
  {
    title: "Twitter",
    icon: BsTwitter,
    activeIcon: BsTwitter,
  },
  {
    title: "Home",
    icon: IoHomeOutline,
    activeIcon: IoHome,
  },
  {
    title: "Explore",
    icon: HiOutlineHashtag,
    activeIcon: HiHashtag,
  },
  {
    title: "Notifications",
    icon: BsBell,
    activeIcon: BsBellFill,
  },
  {
    title: "Messages",
    icon: BsEnvelope,
    activeIcon: BsEnvelopeFill,
  },
  {
    title: "Bookmarks",
    icon: BsBookmark,
    activeIcon: BsBookmarkFill,
  },
  {
    title: "Profile",
    icon: BiUser,
    activeIcon: BiSolidUser,
  },
  {
    title: "More",
    icon: CgMoreO,
    activeIcon: CgMoreO,
  },
];

const LeftSidebar = () => {
  const { authState, logout } = useAuth();
  const { addTweet } = useContext(TweetContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPollForm, setShowPollForm] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const currentPath = pathname?.split("/")[1] || "home";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
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

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !selectedImage && !pollQuestion) return;

    interface Tweet {
      id: string;
      username: string;
      name: string;
      content: string;
      timestamp: string;
      likes: number;
      retweets: number;
      views: number;
      isLiked: boolean;
      imageUrl?: string;
      poll?: {
        question: string;
        options: string[];
        votes: number[];
      };
    }

    // Buat objek tweet baru
    const newTweet: Tweet = {
      id: Date.now().toString(),
      username: authState.user?.username || "user",
      name: authState.user?.username || "User",
      content: postContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      views: Math.floor(Math.random() * 100),
      isLiked: false,
      imageUrl: selectedImage || undefined,
    };

    // Tambahkan poll jika ada
    if (pollQuestion && pollOptions.some((opt) => opt.trim())) {
      newTweet.poll = {
        question: pollQuestion,
        options: pollOptions.filter((opt) => opt.trim()),
        votes: new Array(pollOptions.filter((opt) => opt.trim()).length).fill(
          0
        ),
      };
    }

    // Tambahkan tweet baru ke context
    addTweet(newTweet);

    // Reset form dan tutup modal
    setPostContent("");
    setSelectedImage(null);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowPollForm(false);
    setShowPostModal(false);
  };
  return (
    <>
      <section className="sticky top-0 flex h-screen w-[23%] flex-col items-stretch">
        {/* Kode navigasi yang sama... */}
        <div className="mt-4 flex h-full flex-col items-stretch space-y-4">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = currentPath === item.title.toLowerCase();
            return (
              <Link
                className={`flex w-fit items-center justify-start space-x-4 rounded-3xl px-6 py-2 text-2xl transition duration-200 hover:bg-white/10 ${
                  isActive ? "font-bold" : ""
                }`}
                href={`/${item.title.toLowerCase()}`}
                key={item.title}
              >
                <div>
                  {isActive ? (
                    <item.activeIcon
                      className={item.title !== "Twitter" ? "text-white" : ""}
                    />
                  ) : (
                    <item.icon />
                  )}
                </div>
                {item.title !== "Twitter" && (
                  <div className={isActive ? "font-bold" : ""}>
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
          <button
            onClick={() => setShowPostModal(true)}
            className="m-4 cursor-pointer rounded-full bg-blue-500 p-3 text-center text-2xl font-semibold transition duration-200 hover:bg-blue-600"
          >
            Post
          </button>
        </div>

        <button
          className="flex w-full items-center justify-between space-x-2 rounded-full bg-transparent p-4 text-center transition duration-200 hover:bg-white/20"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gray-400"></div>
            <div className="text-left text-sm">
              <div className="font-semibold">
                {authState.user?.username || "User"}
              </div>
              <div className="text-gray-500">
                @{authState.user?.username || "user"}
              </div>
            </div>
          </div>
          <BsThreeDots />
        </button>

        {showDropdown && (
          <div className="absolute bottom-16 left-0 w-64 rounded-lg bg-gray-900 shadow-lg">
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-800"
            >
              Log out @{authState.user?.username || "user"}
            </button>
          </div>
        )}
      </section>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-black border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <button
                onClick={() => {
                  setShowPostModal(false);
                  setPostContent("");
                  setSelectedImage(null);
                  setPollQuestion("");
                  setPollOptions(["", ""]);
                  setShowPollForm(false);
                }}
                className="rounded-full p-2 hover:bg-gray-800"
              >
                <BsX className="text-xl" />
              </button>
            </div>
            <form onSubmit={handlePostSubmit} className="p-4">
              <div className="flex space-x-3">
                <div className="h-12 w-12 rounded-full bg-slate-400"></div>
                <div className="flex-1">
                  <textarea
                    className="w-full bg-transparent text-xl outline-none resize-none"
                    placeholder="What's happening?"
                    rows={4}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    autoFocus
                  />
                  {selectedImage && (
                    <div className="relative mt-2">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-h-80 w-full rounded-xl object-cover"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white"
                      >
                        <BsX />
                      </button>
                    </div>
                  )}
                  {showPollForm && (
                    <div className="mt-4 rounded-lg bg-gray-800 p-4">
                      <input
                        type="text"
                        placeholder="Ask a question..."
                        className="w-full bg-transparent p-2 text-white outline-none border-b border-gray-700 mb-4"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                      />
                      {pollOptions.map((option, index) => (
                        <div key={index} className="my-2">
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            className="w-full bg-gray-700 p-2 text-white outline-none rounded"
                            value={option}
                            onChange={(e) =>
                              handlePollOptionChange(index, e.target.value)
                            }
                          />
                        </div>
                      ))}
                      {pollOptions.length < 4 && (
                        <button
                          onClick={addPollOption}
                          className="mt-2 text-blue-500 text-sm"
                        >
                          Add option
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-500 p-2 rounded-full hover:bg-blue-500/10"
                      >
                        <AiOutlinePicture className="text-xl" />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </button>
                      <button
                        type="button"
                        className="text-blue-500 p-2 rounded-full hover:bg-blue-500/10"
                      >
                        <HiOutlineGif className="text-xl" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPollForm(!showPollForm)}
                        className="text-blue-500 p-2 rounded-full hover:bg-blue-500/10"
                      >
                        <MdOutlinePoll className="text-xl" />
                      </button>
                      <button
                        type="button"
                        className="text-blue-500 p-2 rounded-full hover:bg-blue-500/10"
                      >
                        <MdOutlineEmojiEmotions className="text-xl" />
                      </button>
                      <button
                        type="button"
                        className="text-blue-500 p-2 rounded-full hover:bg-blue-500/10"
                      >
                        <RiCalendarScheduleLine className="text-xl" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={
                        !postContent.trim() && !selectedImage && !pollQuestion
                      }
                      className={`rounded-full px-4 py-2 font-bold ${
                        postContent.trim() || selectedImage || pollQuestion
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-blue-500/50 cursor-not-allowed"
                      }`}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
