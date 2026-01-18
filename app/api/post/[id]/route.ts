import { NextResponse } from 'next/server';
import { Post, PostStatus } from '../../../../entities/post.entity';
import { getDb } from '../../../../lib/db';
import { isAdmin, requireSession } from '../../../../lib/helpers/auth.helper';
import { updatePostSchema } from '../../../../lib/validation/post';
import { Like } from '../../../../entities/like.entity';
import { User } from '../../../../entities/user.entity';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = await getDb();
  const postRepo = db.getRepository(Post);
  const likeRepo = db.getRepository(Like);
  const userRepo = db.getRepository(User);

  const { id } = await params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    return NextResponse.json({ message: 'Invalid post id' }, { status: 400 });
  }

  const post = await postRepo.findOne({
    where: { id: postId },
    relations: { author: true },
  });

  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  // If not approved -> only admin/owner can see it
  if (post.status !== PostStatus.APPROVED) {
    const session = await requireSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const owner =
      post.author?.email?.toLowerCase() === session.user.email.toLowerCase();

    if (!isAdmin(session) && !owner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  }

  // likesCount (1 query)
  const likesCount = await likeRepo.count({ where: { postId } });

  // likedByMe (0-2 queries, only if logged in)
  const session = await requireSession();
  let likedByMe = false;

  const email = session?.user?.email?.toLowerCase();
  if (email) {
    const me = await userRepo.findOne({
      where: { email },
      select: { id: true },
    });

    if (me) {
      // If your Like.userId type matches me.id type, this works
      const existing = await likeRepo.findOne({
        where: { postId, userId: me.id as any },
        select: { id: true },
      });

      likedByMe = !!existing;
    }
  }

  return NextResponse.json({
    post: {
      ...post,
      likesCount,
      likedByMe,
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session?.user?.email)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Validation error',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { id } = await params;
  const postId = Number(id);

  const db = await getDb();
  const repo = db.getRepository(Post);

  const post = await repo.findOne({
    where: { id: postId },
    relations: { author: true },
  });

  if (!post)
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });

  const isOwner =
    post.author?.email?.toLowerCase() === session.user.email.toLowerCase();

  if (!isAdmin(session) && !isOwner) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  // Can the moderator edit approved posts?
  if (!isAdmin(session) && post.status === PostStatus.APPROVED) {
    return NextResponse.json(
      { message: 'Cannot edit approved post' },
      { status: 403 },
    );
  }

  const { text, imageUrl } = parsed.data;

  if (text !== undefined) post.text = text;
  if (imageUrl !== undefined) post.imageUrl = imageUrl;

  if (!isAdmin(session)) {
    post.status = PostStatus.PENDING;
    post.approvedAt = null;
  }

  await repo.save(post);

  return NextResponse.json({ ok: true, post });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session?.user?.email)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const postId = Number(id);

  const db = await getDb();
  const repo = db.getRepository(Post);

  const post = await repo.findOne({
    where: { id: postId },
    relations: { author: true },
  });

  if (!post)
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });

  const isOwner =
    post.author?.email?.toLowerCase() === session.user.email.toLowerCase();

  if (!isAdmin(session) && !isOwner) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  // Can the moderator delete approved posts?
  if (post.status === PostStatus.APPROVED && !isAdmin(session)) {
    return NextResponse.json(
      { message: 'Cannot delete approved post' },
      { status: 403 },
    );
  }

  await repo.softDelete({ id: postId });

  return NextResponse.json({ ok: true });
}
