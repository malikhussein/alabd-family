import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isAdmin, requireSession } from '../../../../lib/helpers/auth.helper';
import { Post, PostStatus } from '../../../../entities/post.entity';

export async function GET(req: Request) {
  const session = await requireSession();
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(session))
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get('limit') ?? '10'))
  );
  const skip = (page - 1) * limit;

  const db = await getDb();
  const repo = db.getRepository(Post);

  const [items, total] = await repo.findAndCount({
    where: { status: PostStatus.PENDING },
    order: { createdAt: 'ASC' },
    skip,
    take: limit,
    relations: { author: true },
  });

  return NextResponse.json({ page, limit, total, items });
}
