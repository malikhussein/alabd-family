import { NextResponse } from 'next/server';
import { User } from '../../../../entities/user.entity';
import { getDb } from '../../../../lib/db';
import { AuthCode, AuthCodeType } from '../../../../entities/auth-code.entity';
import { generateCode, generateExpiry } from '../../../../lib/codes';
import { sendMail } from '../../../../lib/mailer';
import { requestResetPasswordSchema } from '../../../../lib/validation/auth';
import { resetPasswordTemplate } from '../../../../lib/email-templates';

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

  const resetLink = `${resetUrl}/reset-password/${code.code}`;

  const htmlContent = resetPasswordTemplate({
    userName: user.name,
    resetLink,
  });

  await sendMail({
    to: user.email,
    subject: 'إعادة تعيين كلمة المرور - قبيلة آل العبد الحباب',
    html: htmlContent,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
