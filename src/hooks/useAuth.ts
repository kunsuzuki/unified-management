/**
 * 認証関連のカスタムフック
 * 
 * クライアントコンポーネントで認証状態を管理するためのフック
 */
'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/services/supabase';
import { useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const supabase = createSupabaseClient();

  // 認証状態の監視
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // 認証状態の変化に応じてルーターを更新
      router.refresh();
    });

    // 初期状態の取得
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // ログイン処理
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      router.push('/');
      return { success: true };
    } catch (error) {
      console.error('ログインエラー:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      };
    } finally {
      setLoading(false);
    }
  };

  // サインアップ処理
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('サインアップエラー:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      };
    } finally {
      setLoading(false);
    }
  };

  // ログアウト処理
  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
