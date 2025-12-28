import { NextResponse } from 'next/server';
import { changePasswordSchema } from '../../../../lib/validation/auth';
import { auth } from '../../../../auth';
import { getDb } from '../../../../lib/db';
import { User } from '../../../../entities/user.entity';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Validation error',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  const db = await getDb();
  const repo = db.getRepository(User);

  const user = await repo.findOne({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: 'Current password is incorrect' },
      { status: 400 }
    );
  }

  user.password = await bcrypt.hash(newPassword, 12);

  await repo.save(user);

  return NextResponse.json({ ok: true });
}
