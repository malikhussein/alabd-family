import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { AuthCode, AuthCodeType } from '../../../entities/auth-code.entity';
import { User } from '../../../entities/user.entity';
import { verifyEmailSchema } from '../../../lib/validation/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = verifyEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Validation error',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const code = parsed.data.code;

  const db = await getDb();
  const codeRepo = db.getRepository(AuthCode);
  const userRepo = db.getRepository(User);

  const authCode = await codeRepo.findOne({
    where: { code, type: AuthCodeType.VERIFY_EMAIL },
  });

  if (!authCode)
    return NextResponse.json({ message: 'Invalid code' }, { status: 400 });

  if (authCode.usedAt)
    return NextResponse.json({ message: 'Code already used' }, { status: 400 });

  if (authCode.expiresAt.getTime() < Date.now())
    return NextResponse.json({ message: 'Code expired' }, { status: 400 });

  const user = await userRepo.findOne({ where: { email: authCode.email } });

  if (!user)
    return NextResponse.json({ message: 'User not found' }, { status: 404 });

  if (!user.emailVerifiedAt) {
    user.emailVerifiedAt = new Date();
    await userRepo.save(user);
  }

  authCode.usedAt = new Date();
  await codeRepo.save(authCode);

  return NextResponse.json({ ok: true });
}
