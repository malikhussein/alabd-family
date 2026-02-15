import { NextResponse } from 'next/server';
import { FamilyData } from '../../../../entities/family-data.entity';
import { getDb } from '../../../../lib/db';

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
