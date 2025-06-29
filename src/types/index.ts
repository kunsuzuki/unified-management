/**
 * アプリケーション全体で使用する共通の型定義
 */

// ユーザー関連の型
export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

// ドキュメント関連の型
export type Document = {
  id: string;
  title: string;
  content: string;
  folder_id?: string;
  user_id: string;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
};

// タスク関連の型
export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  parent_id?: string;
  user_id: string;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
};

// メモ関連の型
export type Memo = {
  id: string;
  content: string;
  user_id: string;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
};

// タグ関連の型
export type Tag = {
  id: string;
  name: string;
  color?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

// フォルダ関連の型
export type Folder = {
  id: string;
  name: string;
  parent_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

// コンテンツ間の関連付け
export type ContentRelation = {
  id: string;
  source_type: 'document' | 'task' | 'memo';
  source_id: string;
  target_type: 'document' | 'task' | 'memo';
  target_id: string;
  user_id: string;
  created_at: string;
};
