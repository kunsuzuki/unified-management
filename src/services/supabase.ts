/**
 * Supabaseクライアント設定
 * 
 * サーバーコンポーネントとクライアントコンポーネントで使用するSupabaseクライアントを提供します。
 */
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { env } from '@/config/env';

/**
 * クライアント側で使用するSupabaseクライアントを作成
 */
export const createClient = () => {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabaseの環境変数が設定されていません。');
  }

  return createSupabaseBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};
