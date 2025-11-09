import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証不要なパス
  const publicPaths = ['/login', '/register', '/verify-email', '/'];
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // 認証ページや公開ページの場合はそのまま通す
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Supabase のセッションを確認
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 環境変数が設定されていない場合は、そのまま通す（開発環境でのエラー回避）
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Supabase クライアントを作成（middleware 用）
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  // クッキーからセッション情報を取得
  // Supabase は sb-<project-ref>-auth-token という形式のクッキーを使用
  // プロジェクト参照を URL から取得
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  const authTokenCookieName = projectRef ? `sb-${projectRef}-auth-token` : null;
  
  // セッションクッキーを確認
  const hasSession = authTokenCookieName 
    ? request.cookies.has(authTokenCookieName)
    : // フォールバック: sb- で始まるクッキーを確認
      Array.from(request.cookies.getAll()).some(cookie => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token'));

  // セッションがない場合はログインページにリダイレクト
  if (!hasSession) {
    // ログインページへのリダイレクト
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // セッションがある場合は、そのまま通す
  // 詳細な認証チェック（メール確認など）は各ページで行う
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのリクエストパスにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - その他の静的ファイル (.svg, .png, .jpg など)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

