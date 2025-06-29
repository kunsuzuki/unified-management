'use client';

import { ReactNode } from 'react';

/**
 * アプリケーション全体のプロバイダーコンポーネント
 * 
 * 各種コンテキストプロバイダーをここでラップします
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {/* 
        ここに必要なプロバイダーを追加します
        例: ThemeProvider, AuthProvider など
      */}
      {children}
    </>
  );
}
