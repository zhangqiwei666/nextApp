"use client";
import BottomNav from "@/components/BottomNav";
import { userInfoStore } from '@/store/user';

export default function MePage() {

  // 获取 setInfo 方法
  const {info} = userInfoStore(); 
  const handleLogout = () => {
    // 移除客户端 token
    localStorage.removeItem("token");
    // 移除 cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部简单的 Banner 或空白占位 */}
      <div className="bg-linear-to-r from-violet-500 to-blue-500 h-40"></div>

      {/* 个人信息卡片区 */}
      <div className="px-4 -mt-10 relative">
        <div className="w-full bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 ring-4 ring-white shadow-sm mb-4">
            <img
              src={info?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Felix"}
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <p className="text-gray-500 text-sm mt-1">
            ID: {info?.username || "未知"}
          </p>
        </div>
      </div>

      {/* 底部操作区 */}
      <div className="px-4 mt-8 flex flex-col gap-4">
        {/* 这里可以放一些其他功能列表比如设置之类的 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-gray-700">我的发布</span>
            <span className="text-gray-400 text-xl font-light">›</span>
          </div>
          <div className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-gray-700">设置</span>
            <span className="text-gray-400 text-xl font-light">›</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-500 font-medium py-3 rounded-xl shadow-sm mt-4 hover:bg-red-100 transition-colors"
        >
          退出登录
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
