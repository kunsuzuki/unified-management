'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

/**
 * メインレイアウトコンポーネント
 * 
 * ヘッダー、サイドバー、メインコンテンツ、フッターを含む
 * アプリケーションの基本レイアウトを提供します
 */
interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 py-6">
        <aside className="hidden md:block">
          <Sidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
