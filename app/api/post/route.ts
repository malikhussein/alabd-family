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
import { Like } from '../../../entities/like.entity';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get('limit') || '10'))
  );
  const skip = (page - 1) * limit;

  const session = await requireSession();
  const email = session?.user?.email?.toLowerCase() ?? null;

  const db = await getDb();
  const postRepo = db.getRepository(Post);
  const likeRepo = db.getRepository(Like);
  const userRepo = db.getRepository(User);

  const [posts, total] = await postRepo.findAndCount({
    where: { status: PostStatus.APPROVED },
    order: { createdAt: 'DESC' },
    skip,
    take: limit,
  });

  const postIds = posts.map((item) => item.id);

  // likesCount for page posts (1 query)
  const rawCounts = postIds.length
    ? await likeRepo
        .createQueryBuilder('l')
        .select(`l."postId"`, 'postId')
        .addSelect('COUNT(*)', 'count')
        .where(`l."postId" IN (:...ids)`, { ids: postIds })
        .groupBy(`l."postId"`)
        .getRawMany()
    : [];

  const likesCountMap = new Map<string, number>(
    rawCounts.map((r: { postId: string; count: string }) => [
      r.postId,
      Number(r.count),
    ])
  );

  // likedByMe for page posts (1 query)
  let likedSet = new Set<string>();
  if (email && postIds.length) {
    const me = await userRepo.findOne({
      where: { email },
      select: { id: true },
    });
    if (me) {
      const myLikes = await db
        .getRepository(Like)
        .createQueryBuilder('l')
        .select(`l."postId"`, 'postId')
        .where(`l."userId" = :uid`, { uid: me.id })
        .andWhere(`l."postId" IN (:...ids)`, { ids: postIds })
        .getRawMany();

      likedSet = new Set<string>(
        myLikes.map((r: { postId: string }) => r.postId)
      );
    }
  }

  const items = posts.map((p) => ({
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    id: p.id,
    text: p.text,
    imageUrl: p.imageUrl,
    status: p.status,
    authorId: p.authorId,
    approvedAt: p.approvedAt,
    likesCount: likesCountMap.get(p.id) ?? 0,
    likedByMe: likedSet.has(p.id),
  }));

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
