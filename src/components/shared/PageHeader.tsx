'use client';

import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { Plus } from 'lucide-react';

/**
 * ページヘッダーコンポーネント
 * 
 * タイトル、説明、アクションボタンを含むページヘッダーを提供します
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  createButtonLabel?: string;
  onCreateClick?: () => void;
}

export function PageHeader({
  title,
  description,
  children,
  createButtonLabel,
  onCreateClick,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {createButtonLabel && onCreateClick && (
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            {createButtonLabel}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
