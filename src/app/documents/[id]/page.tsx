import { MainLayout } from '@/components/layout/MainLayout';
import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/services/supabase-server';
import { redirect, notFound } from 'next/navigation';
import { DocumentDetail } from '../_components/DocumentDetail';

/**
 * ドキュメント詳細ページのメタデータ
 */
export const metadata: Metadata = {
  title: 'ドキュメント詳細 | 一元管理アプリ',
  description: 'ドキュメントの詳細を表示',
};

/**
 * ドキュメント詳細ページ
 * 
 * 特定のドキュメントの詳細情報を表示します
 */
export default async function DocumentDetailPage({
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
  
  // ドキュメントを取得
  const { data: document, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.id)
    .single();
  
  // エラーがある場合または存在しない場合は404ページを表示
  if (error || !document) {
    notFound();
  }
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <DocumentDetail document={document} userId={session.user.id} />
      </div>
    </MainLayout>
  );
}
