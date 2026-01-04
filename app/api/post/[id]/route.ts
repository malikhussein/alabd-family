import { NextResponse } from 'next/server';
import { Post, PostStatus } from '../../../../entities/post.entity';
import { getDb } from '../../../../lib/db';
import { isAdmin, requireSession } from '../../../../lib/helpers/auth.helper';

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
