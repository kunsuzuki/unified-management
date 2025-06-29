'use client';

import { ContentCard, ContentType } from './ContentCard';
import { EmptyState } from '../shared/EmptyState';
import { FileText, CheckSquare, StickyNote, Plus } from 'lucide-react';
import { useState } from 'react';

/**
 * コンテンツアイテムの型定義
 */
export interface ContentItem {
  id: string;
  title: string;
  excerpt?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
}

/**
 * コンテンツリストのプロパティ
 */
interface ContentListProps {
  items: ContentItem[];
  contentType: ContentType;
  emptyStateTitle: string;
  emptyStateDescription: string;
  onCreateNew: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * コンテンツリストコンポーネント
 * 
 * ドキュメント、タスク、メモなどのコンテンツ一覧を表示します
 */
export function ContentList({
  items,
  contentType,
  emptyStateTitle,
  emptyStateDescription,
  onCreateNew,
  onEdit,
  onDelete,
}: ContentListProps) {
  // コンテンツタイプに応じたアイコンを取得
  const getEmptyStateIcon = () => {
    switch (contentType) {
      case 'document':
        return <FileText className="h-10 w-10" />;
      case 'task':
        return <CheckSquare className="h-10 w-10" />;
      case 'memo':
        return <StickyNote className="h-10 w-10" />;
      default:
        return <FileText className="h-10 w-10" />;
    }
  };

  // コンテンツがない場合は空の状態を表示
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
        icon={getEmptyStateIcon()}
        actionLabel={`新規作成`}
        onAction={onCreateNew}
      />
    );
  }

  // コンテンツ一覧を表示
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ContentCard
          key={item.id}
          id={item.id}
          title={item.title}
          excerpt={item.excerpt}
          contentType={contentType}
          createdAt={item.createdAt}
          updatedAt={item.updatedAt}
          tags={item.tags}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
