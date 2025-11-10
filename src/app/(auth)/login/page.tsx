'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (!password) {
      setError('パスワードを入力してください');
      return;
    }

    setLoading(true);

    try {
      console.log('🔑 ログイン試行中...', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log('✅ ログイン結果:', { data, signInError });

      if (signInError) {
        console.error('❌ ログインエラー:', signInError);
        setError(signInError.message || 'ログインに失敗しました');
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log('✅ ログイン成功:', data.user.email);

        // セッション保存のタイミングを確実にするため少し待機
        await new Promise((resolve) => setTimeout(resolve, 300));

        // メール認証確認
        if (data.user.email_confirmed_at) {
          console.log('➡ ダッシュボードに遷移');
          setLoading(false);
          await router.push('/dashboard');
        } else {
          console.log('➡ メール確認ページに遷移');
          setLoading(false);
          await router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }
      } else {
        setError('ログインに失敗しました。もう一度お試しください。');
        setLoading(false);
      }
    } catch (err) {
      console.error('⚠️ 予期しないエラー:', err);
      setError('予期しないエラーが発生しました');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md px-6">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ログイン
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              アカウントにログインしてください
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="パスワードを入力"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-lg font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/register"
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              アカウントをお持ちでない方は新規登録
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
