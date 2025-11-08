import { createClient } from '@supabase/supabase-js';

// Next.jsでは、NEXT_PUBLIC_プレフィックスの環境変数は
// クライアント側とサーバー側の両方で process.env から直接アクセス可能
// ビルド時に環境変数が埋め込まれるため、実行時に動的に取得する必要はない
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数の検証
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    // クライアント側でのエラー
    console.error(
      '⚠️ Supabase環境変数が設定されていません。\n' +
      '以下の環境変数を設定してください：\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n' +
      '.env.local ファイルを作成して設定するか、\n' +
      'Vercelなどのホスティングサービスの環境変数設定で設定してください。'
    );
  } else {
    // サーバー側でのエラー
    console.error(
      '⚠️ Supabase環境変数が設定されていません。\n' +
      'サーバー側で以下の環境変数を設定してください：\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
}

// Supabaseクライアントを初期化
// 環境変数が設定されていない場合でも、エラーを投げずにクライアントを作成
// （実行時にエラーハンドリングで対応）
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// 実行時に環境変数をチェックするヘルパー関数
export const checkSupabaseConfig = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || 
      url === 'https://placeholder.supabase.co' || 
      key === 'placeholder-key') {
    if (typeof window !== 'undefined') {
      console.error(
        '⚠️ Supabase環境変数が正しく設定されていません。\n' +
        '現在の値:\n' +
        `- NEXT_PUBLIC_SUPABASE_URL: ${url || '(未設定)'}\n` +
        `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key ? `${key.substring(0, 10)}...` : '(未設定)'}\n\n` +
        '.env.local ファイルを確認するか、開発サーバーを再起動してください。'
      );
    }
    return false;
  }
  return true;
};

