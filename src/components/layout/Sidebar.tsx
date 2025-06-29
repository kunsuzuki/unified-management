'use client';

import { NAVIGATION_ITEMS } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * アプリケーションのサイドバーコンポーネント
 * 
 * メインナビゲーションを提供します
 */
export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            メニュー
          </h2>
          <div className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === item.path
                    ? 'bg-accent text-accent-foreground'
                    : 'transparent'
                )}
              >
                <span className="mr-2 h-4 w-4">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
