'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [state, setState] = useState<{
    status: 'loading' | 'success' | 'error';
    message: string;
  }>({
    status: 'loading',
    message: '',
  });

  useEffect(() => {
    if (!code) {
      setState({
        status: 'error',
        message: 'رابط التحقق غير صالح',
      });
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch('/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: code }),
        });

        const data = await res.json();

        if (res.ok) {
          setState({
            status: 'success',
            message: 'تم التحقق من بريدك الإلكتروني بنجاح!',
          });

          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setState({
            status: 'error',
            message: data.error || 'فشل التحقق من البريد الإلكتروني',
          });
        }
      } catch (err) {
        setState({
          status: 'error',
          message: 'حدث خطأ أثناء التحقق',
        });
      }
    };

    verify();
  }, [code, router]);

  return (
    <div
      className="min-h-screen bg-card flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-black shadow-xl p-8 space-y-6">
          <div className="text-center space-y-4">
            {state.status === 'loading' && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  جاري التحقق...
                </h1>
                <p className="text-gray-400">الرجاء الانتظار</p>
              </>
            )}

            {state.status === 'success' && (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="w-20 h-20 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-white">تم بنجاح! 🎉</h1>
                <p className="text-gray-300">{state.message}</p>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-green-300">
                    سيتم توجيهك لتسجيل الدخول خلال 3 ثوانٍ...
                  </p>
                </div>
              </>
            )}

            {state.status === 'error' && (
              <>
                <div className="flex justify-center">
                  <XCircle className="w-20 h-20 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-white">فشل التحقق</h1>
                <p className="text-gray-300">{state.message}</p>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-red-300">
                    الرجاء المحاولة مرة أخرى أو التواصل مع الدعم
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="text-center pt-4 border-t border-gray-700">
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium text-sm"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-card flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
