'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { ContentList } from '@/components/content/ContentList';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/services/supabase';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

/**
 * タグの型定義
 */
interface Tag {
  id: string;
  name: string;
  color: string;
}

/**
 * ドキュメントの型定義
 */
interface Document {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  tags?: {
    content_id: string;
    tag_id: string;
    tags: Tag;
  }[];
}

/**
 * ドキュメントクライアントコンポーネントのプロパティ
 */
interface DocumentsClientProps {
  documents: Document[];
}

/**
 * ドキュメント一覧のクライアントコンポーネント
 * 
 * インタラクティブな要素を含むドキュメント一覧表示を担当します
 */
export function DocumentsClient({ documents: initialDocuments }: DocumentsClientProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 新規ドキュメント作成ハンドラ
  const handleCreateDocument = () => {
    router.push('/documents/new');
  };

  // ドキュメント編集ハンドラ
  const handleEditDocument = (id: string) => {
    router.push(`/documents/${id}/edit`);
  };

  // ドキュメント削除ハンドラ
  const handleDeleteDocument = async (id: string) => {
    if (!confirm('このドキュメントを削除してもよろしいですか？')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // 成功したら、ローカルの状態を更新
      const updatedDocuments = documents.filter(doc => doc.id !== id);
      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.content?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      ));
    } catch (error) {
      console.error('ドキュメント削除エラー:', error);
      alert('ドキュメントの削除に失敗しました。');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // 検索クエリが変更されたときにドキュメントをフィルタリング
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDocuments(documents);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = documents.filter(doc => 
      doc.title.toLowerCase().includes(query) ||
      (doc.content?.toLowerCase() || '').includes(query)
    );
    
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  return (
    <>
      <PageHeader
        title="ドキュメント"
        description="重要な文書やノートを整理して保存します"
        createButtonLabel="新規ドキュメント"
        onCreateClick={handleCreateDocument}
      />
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ドキュメントを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <ContentList
        items={filteredDocuments.map(doc => ({
          id: doc.id,
          title: doc.title,
          description: doc.content?.substring(0, 100) || '内容なし',
          updatedAt: new Date(doc.updated_at),
          createdAt: new Date(doc.created_at),
          tags: doc.tags?.map(tagMapping => ({
            id: tagMapping.tags.id,
            name: tagMapping.tags.name,
            color: tagMapping.tags.color || ''
          })) || []
        }))}
        contentType="document"
        emptyStateTitle="ドキュメントがありません"
        emptyStateDescription="新しいドキュメントを作成して、重要な情報を整理しましょう"
        onCreateNew={handleCreateDocument}
        onEdit={handleEditDocument}
        onDelete={handleDeleteDocument}
        isLoading={isDeleting}
      />
    </>
  );
}
