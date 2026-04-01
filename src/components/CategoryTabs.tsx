"use client";

import { useState } from "react";

const categories = ["推荐", "穿搭", "美食", "彩妆", "影视", "职场", "旅行", "健身"];

export default function CategoryTabs() {
  const [activeIndex, setActiveIndex] = useState(3); // 彩妆 is active by default

  return (
    <div className="sticky top-12 z-40 bg-white/95 backdrop-blur-md">
      <div className="flex items-center gap-1 px-3 py-2.5 overflow-x-auto scrollbar-hide">
        {categories.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => setActiveIndex(idx)}
            className={`
              relative px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
              transition-all duration-300 ease-out
              ${
                idx === activeIndex
                  ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            {cat}
            {idx === activeIndex && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-xhs-red rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
