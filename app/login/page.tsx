'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validation/auth';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  async function onSubmit(values: LoginInput) {
    setServerError(null);

    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      setServerError('Invalid email or password');
      return;
    }

    window.location.href = '/';
  }

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Login</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'grid', gap: 12 }}
      >
        <div>
          <input placeholder="Email" {...register('email')} />
          {errors.email && (
            <p style={{ color: 'crimson' }}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <p style={{ color: 'crimson' }}>{errors.password.message}</p>
          )}
        </div>

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>

        {serverError && <p style={{ color: 'crimson' }}>{serverError}</p>}
      </form>

      <p style={{ marginTop: 12 }}>
        Don’t have an account? <Link href="/signup">Sign up</Link>
      </p>

      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/' })}
      >
        Continue with Google
      </button>
    </div>
  );
}
