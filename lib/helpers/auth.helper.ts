import { Session } from 'next-auth';
import { auth } from '../../auth';
import { UserRole, User } from '../../entities/user.entity';

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return session;
}

export function isAdmin(session: Session): boolean {
  return session?.user?.role === UserRole.ADMIN;
}

export function isModerator(session: Session): boolean {
  return session?.user?.role === UserRole.MODERATOR;
}

export function isUser(session: Session): boolean {
  return session?.user?.role === UserRole.USER;
}

export function toPublicUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    emailVerifiedAt: u.emailVerifiedAt,
    profileImageUrl: u.profileImageUrl,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}
