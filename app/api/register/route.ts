import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getDb } from '@/lib/db';
import { signupSchema } from '@/lib/validation/auth';
import { User, UserRole } from '@/entities/user.entity';
import { AuthCode, AuthCodeType } from '../../../entities/auth-code.entity';
import { generateCode, generateExpiry } from '../../../lib/codes';
import { sendMail } from '../../../lib/mailer';
import { verifyEmailTemplate } from '../../../lib/email-templates';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Validation error',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const db = await getDb();
  const userRepo = db.getRepository(User);

  const existing = await userRepo.findOne({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return NextResponse.json(
      { message: 'Email already in use' },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = userRepo.create({
    name: name?.trim(),
    email: email.toLowerCase(),
    password: passwordHash,
    role: UserRole.USER,
  });

  await userRepo.save(user);

  const codeRepo = db.getRepository(AuthCode);

  await codeRepo.delete({ email: user.email, type: AuthCodeType.VERIFY_EMAIL });

  const verifyCode = codeRepo.create({
    email: user.email,
    code: generateCode(),
    type: AuthCodeType.VERIFY_EMAIL,
    expiresAt: generateExpiry(15), // 15 minutes
  });

  await codeRepo.save(verifyCode);

  const verifyUrl = `${process.env.APP_URL}`;

  const verificationLink = `${verifyUrl}/verify-email?code=${verifyCode.code}`;

  const htmlContent = verifyEmailTemplate({
    userName: user.name,
    verificationLink,
  });

  await sendMail({
    to: user.email,
    subject: 'التحقق من عنوان بريدك الإلكتروني - قبيلة آل العبد الحباب',
    html: htmlContent,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
