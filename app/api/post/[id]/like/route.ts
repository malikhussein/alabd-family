import { NextResponse } from 'next/server';
import { User } from '../../../../../entities/user.entity';
import { requireSession } from '../../../../../lib/helpers/auth.helper';
import { getDb } from '../../../../../lib/db';
import { Post, PostStatus } from '../../../../../entities/post.entity';
import { Like } from '../../../../../entities/like.entity';
import { DataSource } from 'typeorm';

async function getMe(db: DataSource, email: string) {
  return db.getRepository(User).findOne({
    where: { email },
    select: { id: true, email: true, name: true },
  });
}

export async function PUT(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session?.user?.email)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const postId = Number(id);

  const db = await getDb();
  const postRepo = db.getRepository(Post);
  const likeRepo = db.getRepository(Like);
  const me = await getMe(db, session.user.email);
  if (!me)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const post = await postRepo.findOne({ where: { id: postId } });
  if (!post)
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  if (post.status !== PostStatus.APPROVED)
    return NextResponse.json(
      { message: 'You can only like approved posts' },
      { status: 400 }
    );

  try {
    await likeRepo.insert({
      postId: post.id,
      userId: me.id,
    } as Partial<Like>);
  } catch {}

  return NextResponse.json({ ok: true, liked: true });
}
