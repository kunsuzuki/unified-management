'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { ContentList } from '@/components/content/ContentList';
import { useRouter } from 'next/navigation';

/**
 * ドキュメントクライアントコンポーネントのプロパティ
 */
interface DocumentsClientProps {
  documents: any[];
}

/**
 * ドキュメント一覧のクライアントコンポーネント
 * 
 * インタラクティブな要素を含むドキュメント一覧表示を担当します
 */
export function DocumentsClient({ documents }: DocumentsClientProps) {
  const router = useRouter();

  // 新規ドキュメント作成ハンドラ
  const handleCreateDocument = () => {
    router.push('/documents/new');
  };

  // ドキュメント編集ハンドラ
  const handleEditDocument = (id: string) => {
    router.push(`/documents/${id}/edit`);
  };

  // ドキュメント削除ハンドラ
  const handleDeleteDocument = (id: string) => {
    // TODO: 削除確認ダイアログを表示
    console.log(`ドキュメント ${id} を削除`);
  };

  return (
    <>
      <PageHeader
        title="ドキュメント"
        description="重要な文書やノートを整理して保存します"
        createButtonLabel="新規ドキュメント"
        onCreateClick={handleCreateDocument}
      />

      <ContentList
        items={documents}
        contentType="document"
        emptyStateTitle="ドキュメントがありません"
        emptyStateDescription="新しいドキュメントを作成して、重要な情報を整理しましょう"
        onCreateNew={handleCreateDocument}
        onEdit={handleEditDocument}
        onDelete={handleDeleteDocument}
      />
    </>
  );
}
