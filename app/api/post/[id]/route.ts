import { NextResponse } from 'next/server';
import { Post, PostStatus } from '../../../../entities/post.entity';
import { getDb } from '../../../../lib/db';
import { isAdmin, requireSession } from '../../../../lib/helpers/auth.helper';
import { updatePostSchema } from '../../../../lib/validation/post';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const repo = db.getRepository(Post);

  const { id } = await params;
  const postId = Number(id);

  const post = await repo.findOne({
    where: { id: postId },
    relations: { author: true },
  });

  if (!post)
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });

  if (post.status === PostStatus.APPROVED) {
    return NextResponse.json({ post });
  }

  const session = await requireSession();
  if (!session?.user?.email)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const owner =
    post.author?.email?.toLowerCase() === session.user.email.toLowerCase();
  if (isAdmin(session) || owner) return NextResponse.json(post);

  return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
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
      { status: 400 }
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
      { status: 403 }
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
  { params }: { params: { id: string } }
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
      { status: 403 }
    );
  }

  await repo.softDelete({ id: postId });

  return NextResponse.json({ ok: true });
}
