import { NextResponse } from 'next/server';
import { User } from '../../../../entities/user.entity';
import { AuthCode, AuthCodeType } from '../../../../entities/auth-code.entity';
import { getDb } from '../../../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const code = body?.code?.toString();
  const password = body?.password?.toString();

  if (!code || !password)
    return NextResponse.json(
      { message: 'Code and password are required' },
      { status: 400 }
    );

  const db = await getDb();
  const codeRepo = db.getRepository(AuthCode);
  const userRepo = db.getRepository(User);

  const authCode = await codeRepo.findOne({
    where: { code, type: AuthCodeType.RESET_PASSWORD },
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

  const passwordHash = await bcrypt.hash(password, 12);
  user.password = passwordHash;
  await userRepo.save(user);

  authCode.usedAt = new Date();
  await codeRepo.save(authCode);

  return NextResponse.json({ ok: true });
}
