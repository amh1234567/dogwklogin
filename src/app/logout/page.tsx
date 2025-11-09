'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('ログアウトしています...');

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // ログアウト処理
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error('ログアウトエラー:', error);
          setMessage('ログアウト中にエラーが発生しました');
          // エラーが発生してもログインページにリダイレクト
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          setMessage('ログアウトしました');
          // ログアウト成功後、ログインページにリダイレクト
          setTimeout(() => {
            router.push('/login');
          }, 1000);
        }
      } catch (error) {
        console.error('ログアウトエラー:', error);
        setMessage('ログアウト中にエラーが発生しました');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md px-6">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="space-y-4 text-center">
            {loading && (
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ログアウト
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {message}
            </p>
            {!loading && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ログインページにリダイレクトしています...
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

