import { MainLayout } from '@/components/layout/MainLayout';
import { Metadata } from 'next';
import { DocumentForm } from '../_components/DocumentForm';
import { createServerSupabaseClient } from '@/services/supabase-server';
import { redirect } from 'next/navigation';

/**
 * 新規ドキュメント作成ページのメタデータ
 */
export const metadata: Metadata = {
  title: '新規ドキュメント作成 | 一元管理アプリ',
  description: '新しいドキュメントを作成',
};

/**
 * 新規ドキュメント作成ページ
 * 
 * 新しいドキュメントを作成するためのフォームを表示します
 */
export default async function NewDocumentPage() {
  // サーバーサイドでSupabaseクライアントを作成
  const supabase = createServerSupabaseClient();
  
  // 現在のセッションを取得
  const { data: { session } } = await supabase.auth.getSession();
  
  // 未認証の場合はログインページにリダイレクト
  if (!session) {
    redirect('/login');
  }
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <DocumentForm userId={session.user.id} />
      </div>
    </MainLayout>
  );
}
