import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { AuthCode, AuthCodeType } from '../../../../entities/auth-code.entity';
import { generateCode, generateExpiry } from '../../../../lib/codes';
import { getDb } from '../../../../lib/db';
import { sendMail } from '../../../../lib/mailer';
import { verifyEmailTemplate } from '../../../../lib/email-templates';

export async function POST() {
  const session = await auth();
  const user = session?.user;
  if (!user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
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
    userName: user.name || '',
    verificationLink,
  });

  await sendMail({
    to: user.email,
    subject: 'التحقق من عنوان بريدك الإلكتروني - قبيلة آل العبد الحباب',
    html: htmlContent,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
