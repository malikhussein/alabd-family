import { NextResponse } from 'next/server';
import { isAdmin, requireSession } from '../../../../lib/helpers/auth.helper';
import { getDb } from '../../../../lib/db';
import { User } from '../../../../entities/user.entity';
import { Comment } from '../../../../entities/comment.entity';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const commentId = id;

  const db = await getDb();
  const commentRepo = db.getRepository(Comment);
  const userRepo = db.getRepository(User);

  const comment = await commentRepo.findOne({
    where: { id: commentId },
  });

  if (!comment)
    return NextResponse.json({ message: 'Comment not found' }, { status: 404 });

  const me = await userRepo.findOne({
    where: { email: session.user.email },
    select: { id: true, role: true },
  });

  if (!me)
    return NextResponse.json({ message: 'User not found' }, { status: 404 });

  const isOwner = comment.userId === me.id;

  if (!isAdmin(session) && !isOwner) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  await commentRepo.softDelete(comment.id);

  return NextResponse.json({ ok: true });
}
