import { NextResponse } from 'next/server';
import { requireSession } from '../../../../../lib/helpers/auth.helper';
import { uploadImageToS3 } from '../../../../../lib/upload-image';
import { getDb } from '../../../../../lib/db';
import { User } from '../../../../../entities/user.entity';

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  const userKey = session.user.id ?? session.user.email ?? 'user';

  const { key, publicUrl } = await uploadImageToS3({
    file,
    kind: 'avatar',
    userKey,
  });

  const db = await getDb();
  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({ where: { email: session.user.email } });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  user.profileImageKey = key;
  user.profileImageUrl = publicUrl;

  await userRepo.save(user);

  return NextResponse.json(
    { message: 'Profile picture updated', profileImageUrl: publicUrl },
    { status: 200 },
  );
}
