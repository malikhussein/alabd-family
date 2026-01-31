'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  requestResetPasswordSchema,
  type RequestResetPasswordInput,
} from '@/lib/validation/auth';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<RequestResetPasswordInput>({
    resolver: zodResolver(requestResetPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function onSubmit(values: RequestResetPasswordInput) {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerError(
          data?.message ?? 'فشل إرسال رابط إعادة تعيين كلمة المرور',
        );
        return;
      }

      setSuccessMessage(
        'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      );
      setCountdown(60); // Start 60 second countdown
    } catch (error) {
      console.log(error);
      setServerError('حدث خطأ. يرجى المحاولة مرة أخرى');
    }
  }

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  return (
    <div
      className="min-h-screen bg-card flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-2xl bg-black shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full mx-auto flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-primary">
              نسيت كلمة المرور؟
            </h1>
            <p className="text-gray-500 text-sm">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="example@email.com"
                  {...register('email')}
                  className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  dir="ltr"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center justify-end gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="border border-green-200 rounded-lg p-3 flex items-center gap-2 text-black">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{serverError}</span>
              </div>
            )}

            {/* Countdown Timer */}
            {countdown > 0 && (
              <div className="border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-700">
                  يمكنك إعادة طلب الرابط بعد{' '}
                  <span className="font-bold">{countdown}</span> ثانية
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              disabled={isSubmitting || countdown > 0}
              type="submit"
              className="w-full bg-primary text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  جاري الإرسال...
                </span>
              ) : countdown > 0 ? (
                `إعادة الإرسال بعد ${countdown} ثانية`
              ) : (
                'إرسال رابط إعادة التعيين'
              )}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-400 hover:text-blue-700 font-medium inline-flex items-center gap-2 underline"
              >
                <ArrowRight className="w-4 h-4" />
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
