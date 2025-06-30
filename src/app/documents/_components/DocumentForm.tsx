'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TagSelector, Tag } from '@/components/tag/TagSelector';

/**
 * ドキュメントフォームのプロパティ
 */
interface DocumentFormProps {
  userId: string;
  document?: {
    id: string;
    title: string;
    content: string | null;
    tags?: Tag[];
  };
}

/**
 * ドキュメントフォームコンポーネント
 * 
 * 新規作成と編集の両方に対応したドキュメントフォーム
 */
export function DocumentForm({ userId, document }: DocumentFormProps) {
  const router = useRouter();
  const isEditing = !!document;
  
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');
  const [selectedTags, setSelectedTags] = useState<Tag[]>(document?.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ドキュメントが編集モードの場合、タグを取得
  useEffect(() => {
    if (isEditing && document?.id) {
      const fetchDocumentTags = async () => {
        try {
          const supabase = createClient();
          // タグマッピングテーブルからドキュメントに関連するタグを取得
          // @ts-ignore - Supabaseの型定義の問題を一時的に無視
          const { data, error } = await supabase
            .from('tag_mappings')
            .select(`
              tag_id,
              tags:tag_id(id, name, color)
            `)
            .eq('content_id', document.id)
            .eq('content_type', 1) // 1: Document
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            // タグデータを整形
            // @ts-ignore - Supabaseの型定義の問題を一時的に無視
            const tags = data.map(item => ({
              id: item.tags.id,
              name: item.tags.name,
              color: item.tags.color || ''
            }));
            
            setSelectedTags(tags);
          }
        } catch (err) {
          console.error('タグ取得エラー:', err);
        }
      };
      
      fetchDocumentTags();
    }
  }, [isEditing, document?.id]);
  
  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      let documentId = document?.id;
      
      if (isEditing) {
        // 既存ドキュメントの更新
        const { error } = await supabase
          .from('documents')
          .update({
            title,
            content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', document.id);
          
        if (error) throw error;
        documentId = document.id;
      } else {
        // 新規ドキュメントの作成
        const { data, error } = await supabase
          .from('documents')
          .insert({
            title,
            content,
            user_id: userId,
          })
          .select();
          
        if (error) throw error;
        documentId = data?.[0]?.id;
      }
      
      // ドキュメントIDが取得できた場合、タグの関連付けを更新
      if (documentId) {
        // 既存のタグ関連付けを削除
        if (isEditing) {
          // 既存のタグマッピングを削除
          // @ts-ignore - Supabaseの型定義の問題を一時的に無視
          await supabase
            .from('tag_mappings')
            .delete()
            .eq('content_id', documentId)
            .eq('content_type', 1) // 1: Document
        }
        
        // 新しいタグ関連付けを作成
        if (selectedTags.length > 0) {
          // 新しいタグマッピングを作成
          for (const tag of selectedTags) {
            // @ts-ignore - Supabaseの型定義の問題を一時的に無視
            const { error: tagError } = await supabase
              .from('tag_mappings')
              .insert({
                content_id: documentId,
                tag_id: tag.id,
                content_type: 1, // 1: Document
                user_id: userId
              });
              
            if (tagError) {
              console.error('タグ関連付けエラー:', tagError);
            }
          }
        }
      }
      
      // 成功したらドキュメント一覧ページに戻る
      router.push('/documents');
      router.refresh();
    } catch (err) {
      console.error('ドキュメント保存エラー:', err);
      setError('ドキュメントの保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'ドキュメントを編集' : '新規ドキュメント作成'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditing 
            ? 'ドキュメントの内容を編集してください' 
            : '新しいドキュメントを作成します'}
        </p>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ドキュメントのタイトルを入力"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">内容</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ドキュメントの内容を入力"
            disabled={isSubmitting}
            rows={10}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">タグ</Label>
          <TagSelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            userId={userId}
          />
        </div>
        
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : isEditing ? '更新' : '作成'}
          </Button>
        </div>
      </form>
    </div>
  );
}
