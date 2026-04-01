import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "我的next app 登录",
  description: "标记我的生活 - 短视频",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import  "./login.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <div className="content">
    <div className="login-box">
      <div className="text-2xl font-bold mb-6 flex justify-center mt-4!">用户登录</div>
      {children}
    </div>
  </div>
  )
}
