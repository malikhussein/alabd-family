'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/lib/validation/auth';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: code || '', password: '' },
    mode: 'onSubmit',
  });

  async function onSubmit(values: ResetPasswordInput) {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerError(data?.message ?? 'فشل إعادة تعيين كلمة المرور');
        return;
      }

      setSuccessMessage('تم إعادة تعيين كلمة المرور بنجاح');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-primary">
              إعادة تعيين كلمة المرور
            </h1>
            <p className="text-gray-500 text-sm">
              أدخل كلمة المرور الجديدة الخاصة بك
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Hidden Code Input */}
            <input type="hidden" {...register('code')} value={code} />

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  dir="ltr"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center justify-end gap-1">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                يجب أن تكون كلمة المرور 8 أحرف على الأقل
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="text-sm block">{successMessage}</span>
                  <span className="text-xs">
                    جاري تحويلك إلى صفحة تسجيل الدخول...
                  </span>
                </div>
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

            {/* Submit Button */}
            <Button
              disabled={isSubmitting || !!successMessage}
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
                  جاري إعادة التعيين...
                </span>
              ) : (
                'إعادة تعيين كلمة المرور'
              )}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-400 hover:text-blue-700 font-medium underline"
              >
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            🔒 رابط إعادة التعيين صالح لمرة واحدة فقط وسينتهي بعد 24 ساعة
          </p>
        </div>
      </div>
    </div>
  );
}
