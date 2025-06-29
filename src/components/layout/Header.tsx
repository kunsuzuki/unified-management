'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * アプリケーションのヘッダーコンポーネント
 * 
 * ナビゲーションメニューの表示/非表示の切り替えと
 * ユーザー関連のアクションを提供します
 */
export function Header() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="モバイルメニューを開く"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">一元管理アプリ</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:inline-block text-sm text-muted-foreground mr-2">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href="/profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">プロフィール</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                aria-label="ログアウト"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">ログアウト</span>
              </Button>
            </>
          ) : (
            <Button asChild variant="default">
              <Link href="/login">ログイン</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
