'use client';

/**
 * アプリケーションのフッターコンポーネント
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} 一元管理アプリ - All Rights Reserved.
        </p>
        <div className="text-sm text-muted-foreground">
          <span>Built with Next.js, Supabase, and Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}
