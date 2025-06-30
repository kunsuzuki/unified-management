-- 初期スキーマ作成
-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ユーザープロファイルテーブル
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- タグテーブル
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  is_global BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ドキュメントテーブル
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- タスクテーブル
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not_started',
  due_date TIMESTAMP WITH TIME ZONE,
  parent_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- メモテーブル
CREATE TABLE IF NOT EXISTS public.memos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- タグマッピングテーブル
CREATE TABLE IF NOT EXISTS public.tag_mappings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  content_type INTEGER NOT NULL, -- 1: Document, 2: Task, 3: Memo
  content_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- コンテンツ間の関連付けテーブル
CREATE TABLE IF NOT EXISTS public.relations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source_type INTEGER NOT NULL, -- 1: Document, 2: Task, 3: Memo
  source_id UUID NOT NULL,
  target_type INTEGER NOT NULL, -- 1: Document, 2: Task, 3: Memo
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS（Row Level Security）ポリシーの設定
-- プロファイルテーブルのRLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- タグテーブルのRLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_select_own" ON public.tags
  FOR SELECT USING (auth.uid() = user_id OR is_global = TRUE);
CREATE POLICY "tags_insert_own" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tags_update_own" ON public.tags
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tags_delete_own" ON public.tags
  FOR DELETE USING (auth.uid() = user_id);

-- ドキュメントテーブルのRLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents_select_own" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documents_insert_own" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documents_update_own" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "documents_delete_own" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- タスクテーブルのRLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_select_own" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tasks_insert_own" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_update_own" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tasks_delete_own" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- メモテーブルのRLS
ALTER TABLE public.memos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "memos_select_own" ON public.memos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "memos_insert_own" ON public.memos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "memos_update_own" ON public.memos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "memos_delete_own" ON public.memos
  FOR DELETE USING (auth.uid() = user_id);

-- タグマッピングテーブルのRLS
ALTER TABLE public.tag_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tag_mappings_select" ON public.tag_mappings
  FOR SELECT USING (
    (EXISTS (SELECT 1 FROM public.tags WHERE id = tag_id AND (user_id = auth.uid() OR is_global = TRUE)))
  );
CREATE POLICY "tag_mappings_insert" ON public.tag_mappings
  FOR INSERT WITH CHECK (
    (EXISTS (SELECT 1 FROM public.tags WHERE id = tag_id AND (user_id = auth.uid() OR is_global = TRUE)))
  );
CREATE POLICY "tag_mappings_delete" ON public.tag_mappings
  FOR DELETE USING (
    (EXISTS (SELECT 1 FROM public.tags WHERE id = tag_id AND (user_id = auth.uid() OR is_global = TRUE)))
  );

-- 関連付けテーブルのRLS
ALTER TABLE public.relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "relations_select" ON public.relations
  FOR SELECT USING (
    (source_type = 1 AND EXISTS (SELECT 1 FROM public.documents WHERE id = source_id AND user_id = auth.uid())) OR
    (source_type = 2 AND EXISTS (SELECT 1 FROM public.tasks WHERE id = source_id AND user_id = auth.uid())) OR
    (source_type = 3 AND EXISTS (SELECT 1 FROM public.memos WHERE id = source_id AND user_id = auth.uid()))
  );
CREATE POLICY "relations_insert" ON public.relations
  FOR INSERT WITH CHECK (
    (source_type = 1 AND EXISTS (SELECT 1 FROM public.documents WHERE id = source_id AND user_id = auth.uid())) OR
    (source_type = 2 AND EXISTS (SELECT 1 FROM public.tasks WHERE id = source_id AND user_id = auth.uid())) OR
    (source_type = 3 AND EXISTS (SELECT 1 FROM public.memos WHERE id = source_id AND user_id = auth.uid()))
  );
CREATE POLICY "relations_delete" ON public.relations
  FOR DELETE USING (
    (source_type = 1 AND EXISTS (SELECT 1 FROM public.documents WHERE id = source_id AND user_id = auth.uid())) OR
    (source_type = 2 AND EXISTS (SELECT 1 FROM public.tasks WHERE id = source_id AND user_id = auth.uid())) OR
    (source_type = 3 AND EXISTS (SELECT 1 FROM public.memos WHERE id = source_id AND user_id = auth.uid()))
  );

-- トリガー関数: 更新時にupdated_atを更新
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルに更新トリガーを設定
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memos_updated_at
  BEFORE UPDATE ON public.memos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 新規ユーザー登録時にプロファイルを自動作成する関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 新規ユーザー登録時のトリガー
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON public.tasks(parent_id);
CREATE INDEX IF NOT EXISTS idx_memos_user_id ON public.memos(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON public.tags(user_id);
CREATE INDEX IF NOT EXISTS idx_tag_mappings_tag_id ON public.tag_mappings(tag_id);
CREATE INDEX IF NOT EXISTS idx_tag_mappings_content ON public.tag_mappings(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_relations_source ON public.relations(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_relations_target ON public.relations(target_type, target_id);
