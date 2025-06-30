import { MainLayout } from '@/components/layout/MainLayout';
import { Metadata } from 'next';
import { DocumentsClient } from './DocumentsClient';
import { createServerSupabaseClient } from '@/services/supabase-server';
import { redirect } from 'next/navigation';

/**
 * ドキュメント一覧ページのメタデータ
 */
export const metadata: Metadata = {
  title: 'ドキュメント | 一元管理アプリ',
  description: 'ドキュメント一覧を表示・管理',
};

/**
 * ドキュメント一覧ページ
 * 
 * ユーザーのドキュメント一覧を表示します
 */
export default async function DocumentsPage() {
  // サーバーサイドでSupabaseクライアントを作成
  const supabase = createServerSupabaseClient();
  
  // 現在のセッションを取得
  const { data: { session } } = await supabase.auth.getSession();
  
  // 未認証の場合はログインページにリダイレクト
  if (!session) {
    redirect('/login');
  }
  
  // ドキュメント一覧を取得
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false });
  
  // ドキュメントに関連するタグ情報を取得
  const docIds = documents?.map(doc => doc.id) || [];
  
  // ドキュメントIDがあれば、関連するタグを一括取得
  let tagsByDocId: Record<string, any[]> = {};
  
  if (docIds.length > 0) {
    const { data: tagMappings } = await supabase
      .from('tag_mappings')
      .select(`
        content_id,
        tag_id,
        tags:tag_id(id, name, color)
      `)
      .in('content_id', docIds)
      .eq('content_type', 1); // 1: Document
    
    // ドキュメントIDごとにタグを整理
    if (tagMappings) {
      for (const mapping of tagMappings) {
        if (!tagsByDocId[mapping.content_id]) {
          tagsByDocId[mapping.content_id] = [];
        }
        tagsByDocId[mapping.content_id].push(mapping);
      }
    }
    
    // 各ドキュメントにタグ情報を追加
    if (documents) {
      for (const doc of documents) {
        // @ts-ignore - 動的にプロパティを追加
        doc.tags = tagsByDocId[doc.id] || [];
      }
    }
  }
  
  if (error) {
    console.error('ドキュメント取得エラー:', error);
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <DocumentsClient documents={documents || []} />
      </div>
    </MainLayout>
  );
}
