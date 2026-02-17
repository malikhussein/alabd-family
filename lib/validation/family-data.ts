import { z } from 'zod';

export const updateFamilyDataSchema = z.object({
  familyInfo: z
    .string()
    .min(1, 'معلومات القبيلة مطلوبة')
    .max(5000, 'معلومات القبيلة طويلة جدًا'),
});
