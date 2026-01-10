import { NextResponse } from 'next/server';
import { Comment } from '../../../../../entities/comment.entity';
import { Post, PostStatus } from '../../../../../entities/post.entity';
import { getDb } from '../../../../../lib/db';
import {
  isAdmin,
  requireSession,
} from '../../../../../lib/helpers/auth.helper';
import { createCommentSchema } from '../../../../../lib/validation/comment';
import { User } from '../../../../../entities/user.entity';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);

  const db = await getDb();
  const postRepo = db.getRepository(Post);
  const userRepo = db.getRepository(User);
  const commentRepo = db.getRepository(Comment);

  const post = await postRepo.findOne({
    where: { id: postId, status: PostStatus.APPROVED },
  });
  if (!post)
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  if (post.status !== PostStatus.APPROVED)
    return NextResponse.json(
      { message: 'You can only comment on approved posts' },
      { status: 400 }
    );

  const body = await req.json().catch(() => null);
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Validation input',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const me = await userRepo.findOne({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!me)
    return NextResponse.json({ message: 'User not found' }, { status: 404 });

  const comment = commentRepo.create({
    postId,
    userId: me.id,
    content: parsed.data.content,
  });

  await commentRepo.save(comment);

  return NextResponse.json(
    { ok: true, commentId: comment.id },
    { status: 201 }
  );
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const postId = Number(id);

  const db = await getDb();
  const postRepo = db.getRepository(Post);
  const commentRepo = db.getRepository(Comment);

  const post = await postRepo.findOne({
    where: { id: postId, status: PostStatus.APPROVED },
  });
  if (!post)
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });

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

  const comments = await commentRepo.find({
    where: { postId: post.id },
    order: { createdAt: 'ASC' },
    relations: ['user'],
  });

  return NextResponse.json({
    items: comments.map((c) => ({
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      id: c.id,
      content: c.content,
      user: {
        id: c.user.id,
        name: c.user.name,
        email: c.user.email,
      },
    })),
  });
}
