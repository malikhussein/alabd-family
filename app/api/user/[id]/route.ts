import { NextResponse } from 'next/server';
import { User } from '../../../../entities/user.entity';
import { getDb } from '../../../../lib/db';
import {
  isAdmin,
  requireSession,
  toPublicUser,
} from '../../../../lib/helpers/auth.helper';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }

  if (!isAdmin(session)) {
    return NextResponse.json(
      { message: 'Forbidden' },
      {
        status: 403,
      }
    );
  }

  const { id } = await params;
  const userId = Number(id);

  if (isNaN(userId) || userId <= 0) {
    return NextResponse.json(
      { message: 'Invalid user ID' },
      {
        status: 400,
      }
    );
  }

  const db = await getDb();
  const repo = db.getRepository(User);

  const user = await repo.findOne({ where: { id: userId } });

  if (!user) {
    return NextResponse.json(
      { message: 'User not found' },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({ user: toPublicUser(user) });
}
