import { NextResponse } from 'next/server';
import { User, UserRole } from '../../../entities/user.entity';
import { getDb } from '../../../lib/db';
import {
  isAdmin,
  requireSession,
  toPublicUser,
} from '../../../lib/helpers/auth.helper';
import { FindOptionsWhere, ILike } from 'typeorm';

export async function GET(req: Request) {
  const session = await requireSession();

  if (!session) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }

  if (!isAdmin(session)) {
    return NextResponse.json(
      { message: 'Forbidden' },
      {
        status: 403,
      },
    );
  }

  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get('limit') ?? '20')),
  );
  const skip = (page - 1) * limit;
  const role = searchParams.get('role');

  const keyword = searchParams.get('keyword');

  const db = await getDb();
  const repo = db.getRepository(User);

  const whereCondition: FindOptionsWhere<User> = {};

  if (role) {
    whereCondition.role = role as UserRole;
  }

  if (keyword) {
    whereCondition.name = ILike(`%${keyword}%`);
  }

  const [users, total] = await repo.findAndCount({
    where: whereCondition,
    order: { createdAt: 'DESC' },
    skip,
    take: limit,
  });

  return NextResponse.json({
    page,
    limit,
    total,
    items: users.map(toPublicUser),
  });
}
