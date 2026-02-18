import { NextResponse } from 'next/server';
import { Post, PostStatus } from '../../../entities/post.entity';
import { getDb } from '../../../lib/db';
import {
  isAdmin,
  isModerator,
  requireSession,
} from '../../../lib/helpers/auth.helper';
import { User } from '../../../entities/user.entity';
import { Like } from '../../../entities/like.entity';
import { Comment } from '../../../entities/comment.entity';
import { uploadImageToS3 } from '../../../lib/upload-image';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get('limit') || '10')),
  );
  const skip = (page - 1) * limit;

  const session = await requireSession();
  const email = session?.user?.email?.toLowerCase() ?? null;

  const db = await getDb();
  const postRepo = db.getRepository(Post);
  const likeRepo = db.getRepository(Like);
  const commentRepo = db.getRepository(Comment);
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

  const likesCountMap = new Map<number, number>(
    rawCounts.map((r: { postId: string; count: string }) => [
      Number(r.postId),
      Number(r.count),
    ]),
  );

  // commentsCount for page posts (1 query)
  const rawCommentCounts = postIds.length
    ? await commentRepo
        .createQueryBuilder('c')
        .select(`c."postId"`, 'postId')
        .addSelect('COUNT(*)', 'count')
        .where(`c."postId" IN (:...ids)`, { ids: postIds })
        .groupBy(`c."postId"`)
        .getRawMany()
    : [];

  const commentsCountMap = new Map<number, number>(
    rawCommentCounts.map((r: { postId: string; count: string }) => [
      Number(r.postId),
      Number(r.count),
    ]),
  );

  // likedByMe for page posts (1 query)
  let likedSet = new Set<number>();
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

      likedSet = new Set<number>(
        myLikes.map((r: { postId: string }) => Number(r.postId)),
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
    commentsCount: commentsCountMap.get(p.id) ?? 0,
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

  const form = await req.formData();
  const text = form.get('text');
  if (typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ message: 'Text is required' }, { status: 400 });
  }

  const file = form.get('file');

  const db = await getDb();
  const userRepo = db.getRepository(User);
  const postRepo = db.getRepository(Post);

  const me = await userRepo.findOne({ where: { email: session.user.email } });
  if (!me) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const userKey = session.user.id ?? session.user.email ?? 'user';

  // Optional image upload
  let imageKey: string | null = null;
  let imageUrl: string | null = null;

  if (file instanceof File) {
    const uploaded = await uploadImageToS3({
      file,
      kind: 'post',
      userKey,
    });
    imageKey = uploaded.key;
    imageUrl = uploaded.publicUrl;
  }

  const post = postRepo.create({
    text: text.trim(),
    author: me,
    status: isAdmin(session) ? PostStatus.APPROVED : PostStatus.PENDING,
    imageKey,
    imageUrl,
  });

  await postRepo.save(post);

  return NextResponse.json({ ok: true, post }, { status: 201 });
}
