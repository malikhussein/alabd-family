import { NextResponse } from 'next/server';
import {
  isAdmin,
  requireSession,
} from '../../../../../lib/helpers/auth.helper';
import { getDb } from '../../../../../lib/db';
import { Post, PostStatus } from '../../../../../entities/post.entity';

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session?.user?.email)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(session))
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const db = await getDb();
  const repo = db.getRepository(Post);

  const { id } = await params;
  const postId = Number(id);

  const post = await repo.findOne({ where: { id: postId } });
  if (!post)
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });

  post.status = PostStatus.REJECTED;
  post.approvedAt = null;

  await repo.save(post);

  return NextResponse.json({ ok: true });
}
