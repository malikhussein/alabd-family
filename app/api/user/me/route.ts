import { NextResponse } from 'next/server';
import {
  requireSession,
  toPublicUser,
} from '../../../../lib/helpers/auth.helper';
import { getDb } from '../../../../lib/db';
import { User } from '../../../../entities/user.entity';

export async function GET() {
  const session = await requireSession();
  if (!session?.user?.email)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const db = await getDb();
  const repo = db.getRepository(User);

  const user = await repo.findOne({
    where: { email: session.user.email.toLowerCase() },
  });

  if (!user)
    return NextResponse.json({ message: 'User not found' }, { status: 404 });

  return NextResponse.json({ user: toPublicUser(user) });
}
