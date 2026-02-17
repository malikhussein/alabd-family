import { NextResponse } from 'next/server';
import { FamilyData } from '../../../../entities/family-data.entity';
import { getDb } from '../../../../lib/db';
import { updateFamilyDataSchema } from '../../../../lib/validation/family-data';
import { auth } from '../../../../auth';
import { User, UserRole } from '../../../../entities/user.entity';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const familyDataId = Number(id);

  const db = await getDb();
  const familyDataRepo = db.getRepository(FamilyData);

  const familyData = await familyDataRepo.findOne({
    where: { id: familyDataId },
  });

  if (!familyData)
    return NextResponse.json(
      { message: 'Family data not found' },
      { status: 404 },
    );

  return NextResponse.json({ familyData });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const familyDataId = Number(id);

  const body = await req.json().catch(() => null);

  const parsed = updateFamilyDataSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Validation error',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { familyInfo } = parsed.data;

  const db = await getDb();
  const userRepo = db.getRepository(User);
  const familyDataRepo = db.getRepository(FamilyData);

  // Get the current user to check their role
  const currentUser = await userRepo.findOne({ where: { email } });
  if (!currentUser) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const familyData = await familyDataRepo.findOne({
    where: { id: familyDataId },
  });

  if (!familyData)
    return NextResponse.json(
      { message: 'Family data not found' },
      { status: 404 },
    );

  if (currentUser.role === UserRole.USER) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  // Check permissions based on role
  if (currentUser.role === UserRole.MODERATOR) {
    // Moderators can only edit when familyInfo is null or empty
    if (familyData.familyInfo && familyData.familyInfo.trim() !== '') {
      return NextResponse.json(
        { message: 'Moderators can only edit when family info is empty' },
        { status: 403 },
      );
    }
  }
  // Admins can edit without restrictions (no check needed)

  familyData.familyInfo = familyInfo;

  await familyDataRepo.save(familyData);

  return NextResponse.json({ ok: true, familyData });
}
