import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { Banner } from '../../../../entities/banner.entity';
import { requireSession, isAdmin } from '../../../../lib/helpers/auth.helper';
import { uploadImageToS3 } from '../../../../lib/upload-image';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bannerId = Number(id);

    if (!Number.isFinite(bannerId)) {
      return NextResponse.json(
        { message: 'Invalid banner id' },
        { status: 400 },
      );
    }

    const db = await getDb();
    const bannerRepo = db.getRepository(Banner);

    const banner = await bannerRepo.findOne({
      where: { id: bannerId },
    });

    if (!banner) {
      return NextResponse.json(
        { message: 'Banner not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdmin(session)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const bannerId = Number(id);

    if (!Number.isFinite(bannerId)) {
      return NextResponse.json(
        { message: 'Invalid banner id' },
        { status: 400 },
      );
    }

    const db = await getDb();
    const bannerRepo = db.getRepository(Banner);

    const banner = await bannerRepo.findOne({
      where: { id: bannerId },
    });

    if (!banner) {
      return NextResponse.json(
        { message: 'Banner not found' },
        { status: 404 },
      );
    }

    const form = await req.formData();

    // Optional updates
    const text = form.get('text');
    const file = form.get('file');

    if (typeof text === 'string') {
      const trimmed = text.trim();
      if (!trimmed) {
        return NextResponse.json(
          { message: 'Text cannot be empty' },
          { status: 400 },
        );
      }
      banner.text = trimmed;
    }

    // Replace image
    if (file instanceof File) {
      const userKey = session.user.id ?? session.user.email ?? 'admin';

      const uploaded = await uploadImageToS3({
        file,
        kind: 'banner',
        userKey,
      });

      banner.imageKey = uploaded.key;
      banner.imageUrl = uploaded.publicUrl;
    }

    await bannerRepo.save(banner);

    return NextResponse.json({ ok: true, banner }, { status: 200 });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdmin(session)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const bannerId = Number(id);

    if (!Number.isFinite(bannerId)) {
      return NextResponse.json(
        { message: 'Invalid banner id' },
        { status: 400 },
      );
    }

    const db = await getDb();
    const bannerRepo = db.getRepository(Banner);

    const banner = await bannerRepo.findOne({
      where: { id: bannerId },
    });

    if (!banner) {
      return NextResponse.json(
        { message: 'Banner not found' },
        { status: 404 },
      );
    }

    await bannerRepo.softRemove(banner);

    return NextResponse.json({ ok: true, message: 'Banner deleted' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
