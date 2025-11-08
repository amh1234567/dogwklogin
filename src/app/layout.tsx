'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { supabase } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('認証状態の変更:', event, session?.user?.email);

      // 認証不要なパス
      const publicPaths = ['/login', '/register', '/'];
      const isPublicPath = publicPaths.includes(pathname);

      if (event === 'SIGNED_IN') {
        // ログイン成功時
        console.log('ログイン成功:', session?.user?.email);
        // 公開ページにいる場合は、適切なページにリダイレクト
        if (isPublicPath) {
          router.push('/dashboard'); // または適切なページ
        }
      } else if (event === 'SIGNED_OUT') {
        // ログアウト時
        console.log('ログアウトしました');
        // 認証が必要なページにいる場合は、ログインページにリダイレクト
        if (!isPublicPath) {
          router.push('/login');
        }
      } else if (event === 'TOKEN_REFRESHED') {
        // トークンがリフレッシュされた時
        console.log('トークンがリフレッシュされました');
      } else if (event === 'USER_UPDATED') {
        // ユーザー情報が更新された時
        console.log('ユーザー情報が更新されました:', session?.user?.email);
      }
    });

    // 初期セッションを確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('現在のセッション:', session.user.email);
      } else {
        console.log('セッションがありません');
      }
    });

    // クリーンアップ
    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  return (
    <html lang="ja">
      <head>
        <title>犬の散歩アプリ</title>
        <meta name="description" content="愛犬との散歩を楽しむためのアプリ" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
