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
          
          // デバッグ用：ドキュメントIDを確認
          console.log('ドキュメントID:', document.id);
          
          // タグマッピングテーブルからドキュメントに関連するタグを取得
          const { data: mappings, error: mappingsError } = await supabase
            .from('tag_mappings')
            .select('tag_id, content_type')
            .eq('content_id', document.id)
            .eq('content_type', 1); // 整数型で1を指定（ドキュメントタイプ）
            
          if (mappingsError) {
            console.error('タグマッピング取得エラー:', mappingsError);
            return;
          }
          
          console.log('取得したタグマッピング:', mappings);
          
          if (mappings && mappings.length > 0) {
            // タグIDのリストを取得
            const tagIds = mappings.map(mapping => mapping.tag_id);
            
            // タグ情報を取得
            const { data: tagData, error: tagError } = await supabase
              .from('tags')
              .select('id, name, color')
              .in('id', tagIds);
              
            if (tagError) {
              console.error('タグ情報取得エラー:', tagError);
              return;
            }
            
            console.log('取得したタグ情報:', tagData);
            
            // タグデータを整形
            const tags = tagData.map(tag => ({
              id: tag.id,
              name: tag.name,
              color: tag.color || ''
            }));
            
            setSelectedTags(tags);
          } else {
            console.log('このドキュメントに関連付けられたタグはありません');
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
            .eq('content_type', 1) // 整数型で1を指定（ドキュメントタイプ）
        }
        
        // 新しいタグ関連付けを作成
        if (selectedTags.length > 0) {
          console.log('選択されたタグ:', selectedTags);
          
          // 新しいタグマッピングを作成
          for (const tag of selectedTags) {
            console.log('タグ関連付け処理:', tag.id, tag.name);
            
            // タグマッピングデータを明示的に定義
            const tagMapping = {
              content_id: documentId,
              tag_id: tag.id,
              content_type: 1 // 整数型でドキュメントタイプを表す値を1として指定
              // user_idカラムはtag_mappingsテーブルに存在しないため削除
            };
            
            console.log('挿入するタグマッピングデータ:', tagMapping);
            
            // タグ関連付けの処理を改善
            const { data: insertedData, error: tagError } = await supabase
              .from('tag_mappings')
              .insert(tagMapping)
              .select();
              
            if (tagError) {
              console.error('タグ関連付けエラー:', tagError);
              // エラーの詳細情報を出力
              console.error('エラー詳細:', JSON.stringify(tagError, null, 2));
              // エラーをスローするのではなく、エラー情報を記録して処理を継続
              setError(`タグ「${tag.name}」の関連付けに失敗しました。他のタグは正常に処理されています。`);
            } else {
              console.log('タグ関連付け成功:', insertedData);
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
