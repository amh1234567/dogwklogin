import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証不要なパス
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // 認証ページや公開ページの場合はそのまま通す
  if (isPublicPath) {
    return NextResponse.next();
  }

  // ここで認証チェックを実装
  // 現在は基本的な構造のみ
  // 将来的に Supabase のセッション確認を追加可能

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

