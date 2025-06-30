'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/services/supabase';

/**
 * タグの型定義
 */
export interface Tag {
  id: string;
  name: string;
  color: string;
}

/**
 * タグセレクターのプロパティ
 */
interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  userId: string;
}

/**
 * タグ選択コンポーネント
 * 
 * 既存のタグから選択したり、新しいタグを作成したりできます
 */
export function TagSelector({ selectedTags, onTagsChange, userId }: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  
  // タグ一覧を取得
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .eq('user_id', userId);
          
        if (error) throw error;
        // nullのcolorを空文字列に変換
      const formattedData = (data || []).map(tag => ({
        ...tag,
        color: tag.color || ''
      }));
      setTags(formattedData);
      } catch (error) {
        console.error('タグ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTags();
  }, [userId]);
  
  // 新しいタグを作成
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      setLoading(true);
      const supabase = createClient();
      
      // ランダムな色を生成
      const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange', 'cyan'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      // タグを作成
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: newTagName.trim(),
          color: randomColor,
          user_id: userId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // タグ一覧と選択済みタグを更新
      const newTag = {
        ...data,
        color: data.color || ''
      };
      setTags([...tags, newTag]);
      onTagsChange([...selectedTags, newTag]);
      setNewTagName('');
    } catch (error) {
      console.error('タグ作成エラー:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // タグを選択
  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      // 選択解除
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      // 選択
      onTagsChange([...selectedTags, tag]);
    }
  };
  
  // タグを削除
  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge
            key={tag.id}
            variant="outline"
            className={`bg-${tag.color ? tag.color : 'gray'}-100 text-${tag.color ? tag.color : 'gray'}-800 flex items-center gap-1`}
          >
            {tag.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeTag(tag.id)}
            />
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full"
              disabled={loading}
            >
              タグを選択
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]">
            <Command>
              <CommandInput placeholder="タグを検索..." />
              <CommandList>
                <CommandEmpty>タグが見つかりません</CommandEmpty>
                <CommandGroup>
                  {tags.map(tag => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => {
                        toggleTag(tag);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTags.some(t => t.id === tag.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className={`flex-1 text-${tag.color ? tag.color : 'gray'}-800`}>{tag.name}</span>
                    </CommandItem>
                  ))}
                  <CommandItem
                    onSelect={() => {
                      setNewTagName('');
                      document.getElementById('new-tag-input')?.focus();
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="flex-1">新しいタグを作成</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
              <div className="flex items-center border-t p-2">
                <input
                  id="new-tag-input"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="新しいタグ名"
                  className="flex-1 border-none bg-transparent outline-none text-sm"
                />
                <Button
                  size="sm"
                  disabled={!newTagName.trim() || loading}
                  onClick={handleCreateTag}
                >
                  作成
                </Button>
              </div>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
