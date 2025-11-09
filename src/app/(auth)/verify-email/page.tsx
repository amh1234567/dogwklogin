'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // URLパラメータからメールアドレスを取得
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      console.log('メールアドレスを取得:', emailParam);
    }

    // セッションを確認して、メール確認が完了しているかチェック
    const checkEmailConfirmation = async () => {
      console.log('メール確認状態をチェック中...');
      console.log('URLパラメータ:', window.location.search);
      
      // 少し待ってからセッションを確認（新規登録直後はセッションが作成されていない可能性がある）
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('セッション確認結果:', {
        hasSession: !!session,
        emailConfirmed: !!session?.user?.email_confirmed_at,
        email: session?.user?.email,
      });
      
      if (session?.user?.email_confirmed_at) {
        // メール確認が完了している場合はダッシュボードにリダイレクト
        console.log('メール確認済み、ダッシュボードにリダイレクト');
        window.location.href = '/dashboard';
        return;
      }

      // セッションがない、またはメール確認が未完了の場合はページを表示
      // 新規登録直後はセッションがないことが正常な状態
      console.log('メール確認待ちページを表示（セッション:', session ? 'あり' : 'なし', '）');
      setLoading(false);
    };

    checkEmailConfirmation();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('認証状態変更:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        // メール確認が完了した場合はダッシュボードにリダイレクト
        console.log('メール確認完了、ダッシュボードにリダイレクト');
        window.location.href = '/dashboard';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, searchParams]);

  const handleResendEmail = async () => {
    if (!email) return;

    setResending(true);
    try {
      // Supabase の確認メール再送信 API
      // resendConfirmationEmail メソッドを使用
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error('メール再送信エラー:', error);
        // エラーメッセージをより詳細に表示
        const errorMessage = error.message || 'メールの再送信に失敗しました。もう一度お試しください。';
        alert(errorMessage);
      } else {
        alert('確認メールを再送信しました。メールボックスをご確認ください。');
      }
    } catch (error) {
      console.error('メール再送信エラー:', error);
      alert('メールの再送信に失敗しました。もう一度お試しください。');
    } finally {
      setResending(false);
    }
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md px-6">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              メール確認が必要です
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              登録ありがとうございます
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {email ? (
                  <>
                    <strong>{email}</strong> に確認メールを送信しました。
                  </>
                ) : (
                  <>確認メールを送信しました。</>
                )}
              </p>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                メール内のリンクをクリックして、メールアドレスを確認してください。
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  確認手順
                </h2>
                <ol className="list-inside list-decimal space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>メールボックスを確認してください</li>
                  <li>確認メール内のリンクをクリックしてください</li>
                  <li>自動的にログインされます</li>
                </ol>
              </div>

              {email && (
                <button
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resending ? '送信中...' : '確認メールを再送信'}
                </button>
              )}

              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>メールが届かない場合：</strong>
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                  <li>スパムフォルダを確認してください</li>
                  <li>メールアドレスが正しいか確認してください</li>
                  <li>上記の「確認メールを再送信」ボタンをクリックしてください</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-center">
              <Link
                href="/login"
                className="block text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                ログインページに戻る
              </Link>
              <Link
                href="/"
                className="block text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                トップページに戻る
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <div className="text-lg text-gray-600 dark:text-gray-300">
              読み込み中...
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

