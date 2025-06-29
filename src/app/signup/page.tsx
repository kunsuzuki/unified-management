import { SignupForm } from '@/components/auth/SignupForm';
import { Metadata } from 'next';

/**
 * サインアップページのメタデータ
 */
export const metadata: Metadata = {
  title: 'アカウント作成 | 一元管理アプリ',
  description: '新しいアカウントを作成して一元管理アプリを利用する',
};

/**
 * サインアップページ
 */
export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <SignupForm />
      </div>
    </div>
  );
}
