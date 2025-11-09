import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6">
        <div className="w-full space-y-8 text-center">
          {/* タイトル */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              犬の散歩アプリ
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              愛犬との散歩を楽しみましょう
            </p>
          </div>

          {/* ボタン */}
          <div className="flex flex-col gap-4 pt-8">
            <Link
              href="/login"
              className="flex h-14 w-full items-center justify-center rounded-lg bg-indigo-600 px-6 text-lg font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="flex h-14 w-full items-center justify-center rounded-lg border-2 border-indigo-600 bg-white px-6 text-lg font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 active:bg-indigo-100 dark:border-indigo-500 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700"
            >
              新規登録
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
