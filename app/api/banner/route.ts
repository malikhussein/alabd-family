import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { Banner } from '../../../entities/banner.entity';
import { requireSession, isAdmin } from '../../../lib/helpers/auth.helper';
import { uploadImageToS3 } from '../../../lib/upload-image';

export async function POST(req: Request) {
  const session = await requireSession();

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdmin(session)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const form = await req.formData();
    const text = form.get('text');
    const file = form.get('file');

    if (typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { message: 'Text is required' },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: 'Image file is required' },
        { status: 400 },
      );
    }

    // Upload image to S3
    const userKey = session.user.id ?? session.user.email ?? 'admin';
    const uploaded = await uploadImageToS3({
      file,
      kind: 'banner',
      userKey,
    });

    // Create banner record
    const db = await getDb();
    const bannerRepo = db.getRepository(Banner);

    const banner = bannerRepo.create({
      text: text.trim(),
      imageKey: uploaded.key,
      imageUrl: uploaded.publicUrl,
    });

    await bannerRepo.save(banner);

    return NextResponse.json({ ok: true, banner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const bannerRepo = db.getRepository(Banner);

    const banners = await bannerRepo.find({
      order: { createdAt: 'DESC' },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
