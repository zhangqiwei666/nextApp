"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-xhs-border">
      <div className="flex items-center justify-between px-4 h-12">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <div className="bg-xhs-red rounded-md px-2.5 py-0.5 flex items-center">
            <span className="text-white font-bold text-sm tracking-tight">小红书</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Search icon */}
          <button className="p-1.5 rounded-full hover:bg-xhs-gray-light transition-colors duration-200 active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Menu icon */}
          <button className="p-1.5 rounded-full hover:bg-xhs-gray-light transition-colors duration-200 active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
