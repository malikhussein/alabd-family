import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { User } from '../../../../entities/user.entity';

export async function GET(req: Request) {
  try {
    const db = await getDb();

    // Query to find the most active user based on total likes and comments
    const result = await db
      .createQueryBuilder(User, 'user')
      .select('user.id', 'id')
      .addSelect('user.name', 'name')
      .addSelect('user.email', 'email')
      .addSelect('user.profileImageUrl', 'profileImageUrl')
      .addSelect('user.role', 'role')
      .addSelect(
        'COALESCE(COUNT(DISTINCT comments.id), 0) + COALESCE(COUNT(DISTINCT likes.id), 0)',
        'totalActivity',
      )
      .addSelect('COALESCE(COUNT(DISTINCT comments.id), 0)', 'totalComments')
      .addSelect('COALESCE(COUNT(DISTINCT likes.id), 0)', 'totalLikes')
      .leftJoin('comments', 'comments', 'comments.userId = user.id')
      .leftJoin('likes', 'likes', 'likes.userId = user.id')
      .groupBy('user.id')
      .orderBy('"totalActivity"', 'DESC')
      .limit(5)
      .getRawMany();

    if (!result || result.length === 0) {
      return NextResponse.json(
        { message: 'No active users found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      users: result.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        totalActivity: parseInt(user.totalActivity),
        totalComments: parseInt(user.totalComments),
        totalLikes: parseInt(user.totalLikes),
      })),
    });
  } catch (error) {
    console.error('Error fetching most active user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
