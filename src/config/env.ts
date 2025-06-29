/**
 * 環境変数のラッパー
 * 
 * 環境変数へのアクセスを一元管理し、型安全性を確保します。
 * サーバーサイドでのみ使用する環境変数はここで管理します。
 */

// 必須の環境変数をチェックする関数
const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません。`);
  }
  return value;
};

// 任意の環境変数を取得する関数
const optionalEnv = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

// 環境変数の設定
export const env = {
  // アプリケーション設定
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  APP_URL: optionalEnv('APP_URL', 'http://localhost:3000'),
  
  // Supabase設定
  // 注意: NEXT_PUBLIC_から始まる環境変数はクライアントサイドでも利用可能
  NEXT_PUBLIC_SUPABASE_URL: optionalEnv('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  
  // サーバーサイドのみで使用するSupabase設定
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

// 本番環境での必須環境変数チェック
if (env.NODE_ENV === 'production') {
  // 本番環境で必須の環境変数をここでチェック
  try {
    requireEnv('NEXT_PUBLIC_SUPABASE_URL');
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    // サービスロールキーは必要に応じてチェック
    // requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  } catch (error) {
    console.error('環境変数エラー:', error);
    process.exit(1);
  }
}
