'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

/**
 * コンテンツの種類
 */
export type ContentType = 'document' | 'task' | 'memo';

/**
 * タグの型定義
 */
interface Tag {
  id: string;
  name: string;
  color?: string;
}

/**
 * コンテンツカードのプロパティ
 */
interface ContentCardProps {
  id: string;
  title: string;
  excerpt?: string;
  contentType: ContentType;
  createdAt: Date;
  updatedAt: Date;
  tags?: Tag[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * コンテンツカードコンポーネント
 * 
 * ドキュメント、タスク、メモなどのコンテンツを表示するカード
 */
export function ContentCard({
  id,
  title,
  excerpt,
  contentType,
  createdAt,
  updatedAt,
  tags = [],
  onEdit,
  onDelete,
}: ContentCardProps) {
  // コンテンツタイプに応じたリンク先を設定
  const contentTypeMap = {
    document: 'documents',
    task: 'tasks',
    memo: 'memos',
  };
  
  const viewUrl = `/${contentTypeMap[contentType]}/${id}`;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {excerpt}
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                style={{ 
                  backgroundColor: tag.color ? `${tag.color}20` : undefined,
                  borderColor: tag.color || undefined 
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground">
        <div>
          {formatDistanceToNow(new Date(updatedAt), { addSuffix: true, locale: ja })}更新
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={viewUrl}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">詳細を見る</span>
            </Link>
          </Button>
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">編集</span>
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">削除</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
