// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabaseの環境変数を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 環境変数が正しく設定されているかチェックする関数
const isValidConfig = (url: string | undefined, key: string | undefined): boolean => {
  if (!url || !key) {
    return false
  }
  
  return (
    url !== 'https://placeholder.supabase.co' &&
    key !== 'placeholder-key' &&
    url.startsWith('https://') &&
    key.length > 20 // 最低限の長さチェック
  )
}

// 環境変数の検証（警告のみ、エラーは投げない）
if (!isValidConfig(supabaseUrl, supabaseAnonKey)) {
  const message = `
⚠️ Supabaseの環境変数が設定されていません。

必要な環境変数：
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

設定方法：
.env.local に以下を追加してください👇

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

その後、開発サーバーを再起動してください。
`

  // モジュール読み込み時にエラーを投げず、警告のみを出す
  // これにより、環境変数が未設定でもアプリは起動できる
  console.error(message)
}

// Supabaseクライアントの作成
// 環境変数が未設定の場合はプレースホルダー値を使用
// 実行時に checkSupabaseConfig() で検証すること
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true, // セッションをローカルストレージに保持
      autoRefreshToken: true, // トークンの自動更新を有効化
      detectSessionInUrl: true, // URLからセッションを検出（Magic Linkなど）
    },
  }
)

// 実行時に環境変数を検証するヘルパー関数
// この関数を呼び出して、環境変数が正しく設定されているか確認すること
export const checkSupabaseConfig = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isValid = isValidConfig(url, key)

  if (!isValid) {
    if (typeof window !== 'undefined') {
      console.error(`
⚠️ Supabase環境変数が正しく設定されていません。
現在の値:
- NEXT_PUBLIC_SUPABASE_URL: ${url || '(未設定)'}
- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key ? key.substring(0, 10) + '...' : '(未設定)'}

.env.local を確認するか、開発サーバーを再起動してください。
`)
    }
    return false
  }
  return true
}

// 環境変数が正しく設定されている場合のみtrueを返す
// 実際にSupabaseを使用する前にこの関数でチェックすること
export const isSupabaseConfigured = (): boolean => {
  return isValidConfig(supabaseUrl, supabaseAnonKey)
}
