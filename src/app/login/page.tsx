import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

/**
 * ログインページのメタデータ
 */
export const metadata: Metadata = {
  title: 'ログイン | 一元管理アプリ',
  description: 'アカウントにログインして一元管理アプリを利用する',
};

/**
 * ログインページ
 */
export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <LoginForm />
      </div>
    </div>
  );
}
