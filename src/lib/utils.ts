import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 日付をフォーマットする関数
 * 
 * @param date フォーマットする日付
 * @param options フォーマットオプション
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Intl.DateTimeFormat('ja-JP', defaultOptions).format(date);
}
