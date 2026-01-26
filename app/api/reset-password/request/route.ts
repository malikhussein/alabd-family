import { NextResponse } from 'next/server';
import { User } from '../../../../entities/user.entity';
import { getDb } from '../../../../lib/db';
import { AuthCode, AuthCodeType } from '../../../../entities/auth-code.entity';
import { generateCode, generateExpiry } from '../../../../lib/codes';
import { sendMail } from '../../../../lib/mailer';
import { requestResetPasswordSchema } from '../../../../lib/validation/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = requestResetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Validation error',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const email = parsed.data.email;

  const db = await getDb();
  const userRepo = db.getRepository(User);
  const codeRepo = db.getRepository(AuthCode);

  const user = await userRepo.findOne({ where: { email } });
  if (!user)
    return NextResponse.json(
      {
        message: 'Check your email for password reset instructions',
      },
      { status: 200 },
    );

  await codeRepo.delete({
    email: user.email,
    type: AuthCodeType.RESET_PASSWORD,
  });

  const code = codeRepo.create({
    email: user.email,
    code: generateCode(),
    type: AuthCodeType.RESET_PASSWORD,
    expiresAt: generateExpiry(30), // 30 minutes
  });

  await codeRepo.save(code);

  const resetUrl = `${process.env.APP_URL}`;

  await sendMail({
    to: user.email,
    subject: 'Reset your password',
    html: `<p>You requested a password reset.</p>
    <p>Use the code below to reset your password:</p>
    <p><strong>${code.code}</strong></p>
    <p>Or click the link below:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This code will expire in 30 minutes.</p>`,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
