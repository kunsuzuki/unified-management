/**
 * Supabaseクライアント設定
 * 
 * サーバーコンポーネントとクライアントコンポーネントで使用するSupabaseクライアントを提供します。
 */
import { createBrowserClient } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';
import { env } from '@/config/env';

/**
 * ブラウザ側で使用するSupabaseクライアントを作成
 */
export const createClient = () => {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabaseの環境変数が設定されていません。');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

/**
 * サーバー側で使用するSupabaseクライアントを作成
 */
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabaseの環境変数が設定されていません。');
  }
  
  return createServerClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
    getCookie: name => {
      return cookieStore.get(name)?.value;
    },
    setCookie: (name, value, options) => {
      // cookieStoreはPromiseを返すため、void演算子でPromiseを無視
      void cookieStore.set({ name, value, ...options });
    },
    deleteCookie: (name, options) => {
      void cookieStore.set({ name, value: '', ...options, maxAge: 0 });
    }
  });
};

/**
 * 管理者権限を持つSupabaseクライアントを作成
 * 
 * 注意: このクライアントはサーバーサイドでのみ使用してください
 */
export const createAdminClient = () => {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabaseの環境変数が設定されていません。');
  }

  return createServerClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseServiceRoleKey,
    options: {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  });
};

/**
 * サーバーアクションで使用するSupabaseクライアントを作成
 */
export const createActionClient = () => {
  const cookieStore = cookies();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabaseの環境変数が設定されていません。');
  }

  return createServerClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
    getCookie: name => {
      return cookieStore.get(name)?.value;
    },
    setCookie: (name, value, options) => {
      void cookieStore.set({ name, value, ...options });
    },
    deleteCookie: (name, options) => {
      void cookieStore.set({ name, value: '', ...options, maxAge: 0 });
    }
  });
};
