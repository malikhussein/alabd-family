import { NextResponse } from 'next/server';
import { Post, PostStatus } from '../../../entities/post.entity';
import { getDb } from '../../../lib/db';
import {
  isAdmin,
  isModerator,
  requireSession,
} from '../../../lib/helpers/auth.helper';
import { createPostSchema } from '../../../lib/validation/post';
import { User, UserRole } from '../../../entities/user.entity';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get('limit') || '10'))
  );
  const skip = (page - 1) * limit;

  const db = await getDb();
  const repo = db.getRepository(Post);

  const [items, total] = await repo.findAndCount({
    where: { status: PostStatus.APPROVED },
    order: { createdAt: 'DESC' },
    skip,
    take: limit,
  });

  return NextResponse.json({
    page,
    limit,
    total,
    items,
  });
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session?.user?.email)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  if (!isAdmin(session) && !isModerator(session))
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Validation input',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const db = await getDb();
  const userRepo = db.getRepository(User);
  const postRepo = db.getRepository(Post);

  const me = await userRepo.findOne({ where: { email: session.user.email } });
  if (!me) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const admin = me.role === UserRole.ADMIN;

  const post = postRepo.create({
    text: parsed.data.text,
    imageUrl: parsed.data.imageUrl ?? null,
    authorId: me.id,
    status: admin ? PostStatus.APPROVED : PostStatus.PENDING,
    approvedAt: admin ? new Date() : null,
  });

  await postRepo.save(post);

  return NextResponse.json({ post }, { status: 201 });
}
