import { MainLayout } from '@/components/layout/MainLayout';
import { Metadata } from 'next';
import { DocumentsClient } from './DocumentsClient';

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
  // TODO: サーバーサイドでSupabaseからドキュメント一覧を取得
  // 現時点では空の配列を渡す
  const documents: any[] = [];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <DocumentsClient documents={documents} />
      </div>
    </MainLayout>
  );
}
