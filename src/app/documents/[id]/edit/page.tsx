import { MainLayout } from '@/components/layout/MainLayout';
import { Metadata } from 'next';
import { DocumentForm } from '../../_components/DocumentForm';
import { createServerSupabaseClient } from '@/services/supabase-server';
import { redirect, notFound } from 'next/navigation';

/**
 * ドキュメント編集ページのメタデータ
 */
export const metadata: Metadata = {
  title: 'ドキュメント編集 | 一元管理アプリ',
  description: 'ドキュメントを編集',
};

/**
 * ドキュメント編集ページ
 * 
 * 既存のドキュメントを編集するためのフォームを表示します
 */
export default async function EditDocumentPage({
  params,
}: {
  params: { id: string };
}) {
  // サーバーサイドでSupabaseクライアントを作成
  const supabase = createServerSupabaseClient();
  
  // 現在のセッションを取得
  const { data: { session } } = await supabase.auth.getSession();
  
  // 未認証の場合はログインページにリダイレクト
  if (!session) {
    redirect('/login');
  }
  
  // ドキュメントの詳細を取得
  const { data: document, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();
  
  // ドキュメントが見つからない場合は404ページを表示
  if (error || !document) {
    notFound();
  }
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <DocumentForm 
          userId={session.user.id} 
          document={{
            id: document.id,
            title: document.title,
            content: document.content,
          }} 
        />
      </div>
    </MainLayout>
  );
}
