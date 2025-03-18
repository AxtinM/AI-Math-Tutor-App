'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';
import { toast } from '@/components/toast';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast({ type: 'error', description: 'الحساب موجود بالفعل!' });
    } else if (state.status === 'failed') {
      toast({ type: 'error', description: 'فشل في إنشاء الحساب!' });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'فشل في التحقق من صحة طلبك!',
      });
    } else if (state.status === 'success') {
      toast({ type: 'success', description: 'تم إنشاء الحساب بنجاح!' });

      setIsSuccessful(true);
      // Navigate to home page after successful registration
      router.push('/');
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">إنشاء حساب</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            أنشئ حسابًا باستخدام بريدك الإلكتروني وكلمة المرور
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>إنشاء حساب</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {'هل لديك حساب بالفعل؟ '}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              تسجيل الدخول
            </Link>
            {' بدلاً من ذلك.'}
          </p>
        </AuthForm>
      </div>
    </div>
  );
}
