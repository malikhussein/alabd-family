import { NextResponse } from 'next/server';
import {
  isAdmin,
  requireSession,
  toPublicUser,
} from '../../../../../lib/helpers/auth.helper';
import { getDb } from '../../../../../lib/db';
import { User, UserRole } from '../../../../../entities/user.entity';

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session?.user?.email)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(session))
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const userId = Number(id);

  const db = await getDb();
  const repo = db.getRepository(User);

  const target = await repo.findOne({ where: { id: userId } });
  if (!target)
    return NextResponse.json({ message: 'User not found' }, { status: 404 });

  // prevent self-demotion / changes
  if (target.email.toLowerCase() === session.user.email.toLowerCase()) {
    return NextResponse.json(
      { message: 'You cannot change your own role' },
      { status: 400 }
    );
  }

  // never change admins via toggle endpoint
  if (target.role === UserRole.ADMIN) {
    return NextResponse.json(
      { message: 'Cannot change ADMIN role' },
      { status: 400 }
    );
  }

  target.role =
    target.role === UserRole.USER ? UserRole.MODERATOR : UserRole.USER;

  await repo.save(target);

  return NextResponse.json({ user: toPublicUser(target) });
}
