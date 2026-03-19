"use client";

import { useState } from "react";

interface CardData {
  id: number;
  image: string;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  isVideo?: boolean;
  overlay?: string;
  tags?: string[];
  aspectRatio: number;
}

interface WaterfallCardProps {
  data: CardData;
  index: number;
}

export default function WaterfallCard({ data, index }: WaterfallCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLikeCount((c) => c - 1);
    } else {
      setLikeCount((c) => c + 1);
    }
    setLiked(!liked);
  };

  const formatLikes = (n: number) => {
    if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  return (
    <div
      className="break-inside-avoid mb-2.5"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.06}s both`,
      }}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-pointer">
        {/* Image Container */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: `1 / ${data.aspectRatio}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Video play button */}
          {data.isVideo && (
            <div className="absolute top-2.5 right-2.5 bg-black/40 rounded-full p-1.5 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          {/* Overlay text */}
          {data.overlay && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <p className="text-white text-[11px] font-bold leading-snug drop-shadow-lg whitespace-pre-line">
                {data.overlay}
              </p>
            </div>
          )}

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/80 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-full text-gray-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2.5 pt-2">
          <h3 className="text-[13px] font-medium text-gray-900 leading-[1.4] line-clamp-2 mb-2">
            {data.title}
          </h3>

          {/* Author & Likes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <div className="w-[18px] h-[18px] rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.avatar}
                  alt={data.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] text-gray-400 truncate">{data.author}</span>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center gap-0.5 transition-all duration-200 active:scale-90 flex-shrink-0 ml-1 ${
                liked ? "text-xhs-red" : "text-gray-400"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3.5 h-3.5 ${liked ? "animate-heart" : ""}`}
                fill={liked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={liked ? 0 : 1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span className="text-[11px]">{formatLikes(likeCount)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { CardData };
