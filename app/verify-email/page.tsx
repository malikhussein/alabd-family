'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const [status, setStatus] = useState<
    'verifying' | 'success' | 'error' | 'idle'
  >('idle');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function verifyEmail(verificationToken: string) {
    setStatus('verifying');
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('تم التحقق من بريدك الإلكتروني بنجاح!');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'فشل التحقق من البريد الإلكتروني');
      }
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ أثناء التحقق');
    }
  }

  async function handleResendVerification() {
    if (countdown > 0) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      const response = await fetch('/api/verify-email/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        setResendSuccess(true);
        setCountdown(60);
        setMessage('تم إرسال رابط التحقق الجديد إلى بريدك الإلكتروني');
      } else {
        setMessage(data.error || 'فشل إرسال رابط التحقق');
      }
    } catch (error) {
      setMessage('حدث خطأ أثناء إرسال رابط التحقق');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-card flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-black shadow-xl p-8 space-y-6">
          <div className="text-center space-y-4">
            {status === 'verifying' && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  جاري التحقق من بريدك الإلكتروني...
                </h1>
                <p className="text-gray-400">
                  الرجاء الانتظار بينما نتحقق من حسابك
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  تم التحقق بنجاح!
                </h1>
                <p className="text-gray-400">{message}</p>
                <p className="text-sm text-gray-500">
                  سيتم توجيهك إلى صفحة تسجيل الدخول...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center">
                  <XCircle className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">فشل التحقق</h1>
                <p className="text-gray-400">{message}</p>
              </>
            )}

            {status === 'idle' && !token && (
              <>
                <div className="flex justify-center">
                  <Mail className="w-16 h-16 text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  تحقق من بريدك الإلكتروني
                </h1>
                <p className="text-gray-400">لم يتم التحقق من حسابك بعد</p>
              </>
            )}
          </div>

          {(status === 'error' || (status === 'idle' && !token)) && (
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300 text-center">
                  لم تستلم رابط التحقق؟ يمكنك طلب إرسال رابط جديد
                </p>
              </div>

              <Button
                onClick={handleResendVerification}
                disabled={isResending || countdown > 0}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الإرسال...
                  </span>
                ) : countdown > 0 ? (
                  `أعد المحاولة بعد ${countdown} ثانية`
                ) : (
                  'إرسال رابط تحقق جديد'
                )}
              </Button>

              {resendSuccess && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <p className="text-sm text-green-300 text-center">
                    ✓ تم إرسال رابط التحقق بنجاح
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-center pt-4 border-t border-gray-700">
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium underline text-sm"
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
      <VerifyEmailContent />
    </Suspense>
  );
}
