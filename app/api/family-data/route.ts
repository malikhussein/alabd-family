import { NextResponse } from 'next/server';
import { FamilyData } from '../../../entities/family-data.entity';
import { getDb } from '../../../lib/db';

export async function GET() {
  const db = await getDb();

  const familyDataRepo = db.getRepository(FamilyData);

  const familyData = await familyDataRepo.find({
    select: ['id', 'familyName'],
    order: { id: 'ASC' },
  });

  return NextResponse.json(familyData);
}
