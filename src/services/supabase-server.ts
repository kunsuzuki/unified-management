/**
 * サーバーコンポーネント用Supabaseクライアント設定
 * 
 * サーバーコンポーネントでのみ使用するSupabaseクライアントを提供します。
 * このファイルはサーバーコンポーネントでのみインポートしてください。
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { env } from '@/config/env';

// Next.js 15ではcookies()は非同期APIとして扱う必要がある

// サーバーサイドのcookies操作用ヘルパー関数
const getCookieValue = async (name: string) => {
  // Next.js 15ではcookies()を非同期で扱う必要がある
  const cookieStore = cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value;
};

const setCookieValue = async (name: string, value: string, options?: CookieOptions) => {
  const cookieStore = cookies();
  cookieStore.set(name, value, options);
};

const removeCookieValue = async (name: string, options?: { path?: string; domain?: string }) => {
  const cookieStore = cookies();
  cookieStore.set(name, '', { ...options, maxAge: 0 });
};

/**
 * サーバー側で使用するSupabaseクライアントを作成
 */
export const createServerSupabaseClient = () => {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabaseの環境変数が設定されていません。');
  }
  
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: async (name: string) => {
          return await getCookieValue(name);
        },
        set: async (name: string, value: string, options: CookieOptions) => {
          await setCookieValue(name, value, options);
        },
        remove: async (name: string, options: CookieOptions) => {
          await removeCookieValue(name, options);
        },
      },
    }
  );
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

  return createServerClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      cookies: {
        get: (name: string) => {
          return getCookieValue(name);
        },
        set: (name: string, value: string, options: CookieOptions) => {
          setCookieValue(name, value, options);
        },
        remove: (name: string, options: { path?: string; domain?: string; }) => {
          removeCookieValue(name, options);
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

/**
 * サーバーアクションで使用するSupabaseクライアントを作成
 */
export const createActionClient = () => {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabaseの環境変数が設定されていません。');
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name: string) => {
          return getCookieValue(name);
        },
        set: (name: string, value: string, options: CookieOptions) => {
          setCookieValue(name, value, options);
        },
        remove: (name: string, options: { path?: string; domain?: string; }) => {
          removeCookieValue(name, options);
        },
      },
    }
  );
};
