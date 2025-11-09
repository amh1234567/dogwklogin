'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let hasRedirected = false;

    // セッションを確認
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!isMounted) return;

      if (!session) {
        // セッションがない場合はログインページにリダイレクト
        if (!hasRedirected) {
          hasRedirected = true;
          router.push('/login');
        }
        return;
      }

      // メール確認が完了しているかチェック
      if (!session.user.email_confirmed_at) {
        // メール確認が完了していない場合は確認待ちページにリダイレクト
        if (!hasRedirected) {
          hasRedirected = true;
          router.push(`/verify-email?email=${encodeURIComponent(session.user.email || '')}`);
        }
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkSession();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      // 初期セッション確認時はスキップ（checkSession で処理済み）
      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (!session) {
        // ログアウト時のみリダイレクト（無限ループを防ぐ）
        if (event === 'SIGNED_OUT' && !hasRedirected) {
          hasRedirected = true;
          router.push('/login');
        }
        setLoading(false);
        return;
      }

      // メール確認が完了しているかチェック
      if (!session.user.email_confirmed_at) {
        // メール確認が完了していない場合は確認待ちページにリダイレクト
        // ただし、既に verify-email ページにいる場合はリダイレクトしない
        if (!hasRedirected && pathname !== '/verify-email') {
          hasRedirected = true;
          router.push(`/verify-email?email=${encodeURIComponent(session.user.email || '')}`);
        }
      } else {
        // メール確認が完了している場合はユーザー情報を設定
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-lg text-gray-600 dark:text-gray-300">
            読み込み中...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ダッシュボード
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                愛犬との散歩を楽しみましょう
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800"
            >
              ログアウト
            </button>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main>
          {/* ユーザー情報カード */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              ユーザー情報
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  メールアドレス
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ユーザーID
                </label>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {user.id}
                </p>
              </div>
              {user.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    登録日時
                  </label>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleString('ja-JP')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 機能カード */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 散歩記録カード */}
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                散歩記録
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                愛犬との散歩を記録しましょう
              </p>
              <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800">
                記録を追加
              </button>
            </div>

            {/* 統計カード */}
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                統計
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                散歩の統計を確認しましょう
              </p>
              <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800">
                統計を見る
              </button>
            </div>

            {/* 設定カード */}
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                設定
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                アプリの設定を変更しましょう
              </p>
              <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800">
                設定を開く
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

