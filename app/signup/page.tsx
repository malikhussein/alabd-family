'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '@/lib/validation/auth';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignupPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
    mode: 'onSubmit',
  });

  async function onSubmit(values: SignupInput) {
    setServerError(null);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setServerError(data?.message ?? 'Signup failed');
      return;
    }

    // auto login after signup
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl: '/',
    });
  }

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Sign up</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'grid', gap: 12 }}
      >
        <div>
          <input placeholder="Name (optional)" {...register('name')} />
          {errors.name && (
            <p style={{ color: 'crimson' }}>{errors.name.message}</p>
          )}
        </div>

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

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>

        {serverError && <p style={{ color: 'crimson' }}>{serverError}</p>}
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
