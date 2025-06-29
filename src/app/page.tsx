import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckSquare, StickyNote } from "lucide-react";

export const metadata: Metadata = {
  title: "ホーム | 一元管理アプリ",
  description: "ドキュメント、タスク、メモを一元管理できるシンプルなWebアプリケーション",
};

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">一元管理アプリへようこそ</h1>
          <p className="text-muted-foreground">
            ドキュメント、タスク、メモを一元管理できるシンプルなWebアプリケーションです。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-blue-500" />
              <CardTitle>ドキュメント管理</CardTitle>
              <CardDescription>
                重要な文書やノートを整理して保存します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>フォルダ構造でドキュメントを整理し、タグ付けして簡単に検索できます。</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/documents">ドキュメントを見る</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CheckSquare className="h-8 w-8 mb-2 text-green-500" />
              <CardTitle>タスク管理</CardTitle>
              <CardDescription>
                タスクを作成し、進捗を追跡します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>優先度や期限を設定し、サブタスクを作成して複雑なプロジェクトも管理できます。</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/tasks">タスクを見る</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <StickyNote className="h-8 w-8 mb-2 text-yellow-500" />
              <CardTitle>メモ管理</CardTitle>
              <CardDescription>
                素早くメモを取り、整理します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>アイデアやちょっとした情報をメモとして保存し、後で簡単に参照できます。</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/memos">メモを見る</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>始めましょう</CardTitle>
            <CardDescription>
              アカウントを作成してすべての機能を利用できます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>アカウントを作成すると、以下の機能が利用できます：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>ドキュメント、タスク、メモの作成と管理</li>
              <li>コンテンツの整理と検索</li>
              <li>タグによる分類</li>
              <li>コンテンツ間の関連付け</li>
            </ul>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild>
              <Link href="/signup">アカウント作成</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">ログイン</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
