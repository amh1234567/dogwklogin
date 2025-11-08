import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ビルド時には環境変数がなくてもエラーを投げない
// 実行時に環境変数がない場合は、クライアント側で適切にエラーハンドリングする
// 注意: Vercelの環境変数設定で NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// 実行時に環境変数をチェックするヘルパー関数
export const checkSupabaseConfig = () => {
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'https://placeholder.supabase.co' || 
      supabaseAnonKey === 'placeholder-key') {
    console.error(
      '⚠️ Supabase環境変数が設定されていません。\n' +
      'Vercelの環境変数設定で以下を設定してください：\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
    return false;
  }
  return true;
};

