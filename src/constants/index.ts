/**
 * アプリケーション全体で使用する定数
 */

// ナビゲーション項目
export const NAVIGATION_ITEMS = [
  {
    name: 'ダッシュボード',
    path: '/',
    icon: 'layout-dashboard',
  },
  {
    name: 'ドキュメント',
    path: '/documents',
    icon: 'file-text',
  },
  {
    name: 'タスク',
    path: '/tasks',
    icon: 'check-square',
  },
  {
    name: 'メモ',
    path: '/memos',
    icon: 'sticky-note',
  },
  {
    name: 'タグ管理',
    path: '/tags',
    icon: 'tag',
  },
];

// タスクステータス
export const TASK_STATUSES = [
  { value: 'not_started', label: '未着手', color: 'bg-gray-200' },
  { value: 'in_progress', label: '進行中', color: 'bg-blue-200' },
  { value: 'completed', label: '完了', color: 'bg-green-200' },
];

// タスク優先度
export const TASK_PRIORITIES = [
  { value: 'low', label: '低', color: 'bg-green-100' },
  { value: 'medium', label: '中', color: 'bg-yellow-100' },
  { value: 'high', label: '高', color: 'bg-red-100' },
];

// デフォルトのタグカラー
export const DEFAULT_TAG_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#6b7280', // gray
];

// ページごとの表示件数
export const ITEMS_PER_PAGE = 10;
