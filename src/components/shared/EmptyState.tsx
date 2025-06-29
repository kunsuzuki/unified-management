'use client';

import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

/**
 * 空の状態を表示するコンポーネント
 * 
 * コンテンツがない場合に表示され、ユーザーにアクションを促します
 */
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex flex-col items-center justify-center space-y-3">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="mt-4">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
