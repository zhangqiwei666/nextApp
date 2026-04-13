import React from 'react';

export default function WaterfallSkeleton() {
  return (
    <div className="flex gap-2 w-full animate-pulse">
      {/* 模拟左/右两列 */}
      {[0, 1].map((col) => (
        <div key={col} className="flex-1 flex flex-col gap-2.5">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl overflow-hidden shadow-sm">
              {/* 随机高度的图片占位 */}
              <div 
                className="w-full bg-gray-200 animate-shimmer" 
                style={{ 
                  aspectRatio: col === 0 
                    ? (item % 2 === 0 ? '3/4' : '1/1') 
                    : (item % 2 === 0 ? '1/1' : '4/5') 
                }}
              />
              <div className="p-2.5 space-y-2">
                {/* 标题 */}
                <div className="h-3 bg-gray-200 rounded-full w-full" />
                <div className="h-3 bg-gray-200 rounded-full w-2/3" />
                {/* 作者 */}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-gray-200" />
                    <div className="h-2.5 bg-gray-200 rounded-full w-12" />
                  </div>
                  <div className="w-10 h-2.5 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
