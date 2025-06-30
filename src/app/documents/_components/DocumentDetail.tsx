'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

/**
 * ドキュメント詳細コンポーネントのプロパティ
 */
interface DocumentDetailProps {
  document: {
    id: string;
    title: string;
    content: string | null;
    created_at: string;
    updated_at: string;
    user_id: string;
  };
  userId: string;
}

/**
 * ドキュメント詳細コンポーネント
 * 
 * ドキュメントの詳細情報を表示し、編集・削除機能を提供します
 */
export function DocumentDetail({ document, userId }: DocumentDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 自分のドキュメントかどうかを確認
  const isOwner = document.user_id === userId;
  
  // 編集ページに移動
  const handleEdit = () => {
    router.push(`/documents/${document.id}/edit`);
  };
  
  // ドキュメント削除処理
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);
      
      if (error) throw error;
      
      // 削除成功後、一覧ページに戻る
      router.push('/documents');
      router.refresh();
    } catch (error) {
      console.error('ドキュメント削除エラー:', error);
      alert('ドキュメントの削除に失敗しました。');
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Button>
        
        {isOwner && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-1"
              disabled={isDeleting}
            >
              <Edit className="h-4 w-4" />
              編集
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  削除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ドキュメントを削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    この操作は元に戻すことができません。このドキュメントは完全に削除されます。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? '削除中...' : '削除'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      {/* ドキュメント内容 */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{document.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>作成: {formatDate(new Date(document.created_at))}</span>
          <span>更新: {formatDate(new Date(document.updated_at))}</span>
        </div>
        
        <div className="mt-6 whitespace-pre-wrap rounded-md border p-4">
          {document.content || '内容なし'}
        </div>
      </div>
    </div>
  );
}
