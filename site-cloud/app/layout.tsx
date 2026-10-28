import type { Metadata } from "next";
export const metadata: Metadata = { title: "办好了 · 公共服务办事引导", description: "公共服务办事引导与语音助手" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body>{children}</body></html>; }
