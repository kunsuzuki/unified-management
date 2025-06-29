/**
 * Supabaseクライアント設定
 * 
 * サーバーコンポーネントとクライアントコンポーネントで使用するSupabaseクライアントを提供します。
 */
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../types/database';

// クライアントサイドでのSupabaseクライアント作成
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabaseの環境変数が設定されていません。');
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// サーバーサイドでのSupabaseクライアント作成（Cookieベース）
export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabaseの環境変数が設定されていません。');
  }
  
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

// サーバーサイドでの管理者権限を持つSupabaseクライアント作成
// 注意: これはサーバーサイドでのみ使用し、RLSをバイパスする必要がある場合のみ使用してください
export const createSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase管理者用の環境変数が設定されていません。');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
