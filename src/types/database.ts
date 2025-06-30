/**
 * Supabaseのデータベース型定義
 * 
 * このファイルは後でSupabaseプロジェクトを作成した際に
 * 自動生成される型定義に置き換えることを想定しています。
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          title: string
          content: string
          folder_id: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          folder_id?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          folder_id?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_folder_id_fkey"
            columns: ["folder_id"]
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: "not_started" | "in_progress" | "completed"
          priority: "low" | "medium" | "high"
          due_date: string | null
          parent_id: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: "not_started" | "in_progress" | "completed"
          priority?: "low" | "medium" | "high"
          due_date?: string | null
          parent_id?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: "not_started" | "in_progress" | "completed"
          priority?: "low" | "medium" | "high"
          due_date?: string | null
          parent_id?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      memos: {
        Row: {
          id: string
          content: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          color: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tag_mappings: {
        Row: {
          id: string
          tag_id: string
          content_type: number // 1: Document, 2: Task, 3: Memo
          content_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          tag_id: string
          content_type: number // 1: Document, 2: Task, 3: Memo
          content_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          tag_id?: string
          content_type?: number
          content_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_mappings_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      },
      content_tags: {
        Row: {
          id: string
          content_type: "document" | "task" | "memo"
          content_id: string
          tag_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content_type: "document" | "task" | "memo"
          content_id: string
          tag_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content_type?: "document" | "task" | "memo"
          content_id?: string
          tag_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tags_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      folders: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      content_relations: {
        Row: {
          id: string
          source_type: "document" | "task" | "memo"
          source_id: string
          target_type: "document" | "task" | "memo"
          target_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          source_type: "document" | "task" | "memo"
          source_id: string
          target_type: "document" | "task" | "memo"
          target_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          source_type?: "document" | "task" | "memo"
          source_id?: string
          target_type?: "document" | "task" | "memo"
          target_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_relations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
