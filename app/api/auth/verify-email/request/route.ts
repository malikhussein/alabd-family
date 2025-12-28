import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import {
  AuthCode,
  AuthCodeType,
} from '../../../../../entities/auth-code.entity';
import { generateCode, generateExpiry } from '../../../../../lib/codes';
import { getDb } from '../../../../../lib/db';
import { sendMail } from '../../../../../lib/mailer';

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

  await sendMail({
    to: user.email,
    subject: 'Verify your email address',
    html: `<p>Welcome to Alabd Family!</p>
      <p>Verify your email:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>Your verification code is: <strong>${verifyCode.code}</strong></p>
      <p>Expires in 15 minutes.</p>`,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
