'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!name.trim()) {
      setError('お名前を入力してください');
      return;
    }

    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (!password) {
      setError('パスワードを入力してください');
      return;
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);

    try {
      // Supabaseにユーザーを登録
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || '登録に失敗しました');
        setLoading(false);
        return;
      }

      if (data.user) {
        // 登録成功 - ダッシュボードにリダイレクト
        router.push('/dashboard');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md px-6">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              新規登録
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              新しいアカウントを作成してください
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
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                お名前
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="山田 太郎"
                required
              />
            </div>

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
                placeholder="8文字以上"
                required
                minLength={8}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                パスワード（確認）
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="パスワードを再入力"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-lg font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? '登録中...' : '登録する'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              すでにアカウントをお持ちの方はログイン
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

