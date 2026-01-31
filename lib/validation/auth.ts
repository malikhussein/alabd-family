import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'الاسم مطلوب')
      .max(120, 'الاسم طويل جداً')
      .optional(),
    email: z.string().email('البريد الإلكتروني غير صالح'),
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .max(72, 'كلمة المرور طويلة جداً'),
    confirmPassword: z.string().min(1, 'يرجى تأكيد كلمة المرور'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمة المرور وتأكيد كلمة المرور غير متطابقين',
    path: ['confirmPassword'],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const requestResetPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
});

export type RequestResetPasswordInput = z.infer<
  typeof requestResetPasswordSchema
>;

export const resetPasswordSchema = z.object({
  code: z.string().min(1, 'الكود مطلوب'),
  password: z
    .string()
    .min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل')
    .max(72, 'كلمة المرور طويلة جداً'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(72, 'New password too long'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
