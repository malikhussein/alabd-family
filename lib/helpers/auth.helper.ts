import { auth } from '../../auth';
import { UserRole } from '../../entities/user.entity';

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return session;
}

export function isAdmin(session: unknown): boolean {
  return session?.user?.role === UserRole.ADMIN;
}

export function isModerator(session: unknown): boolean {
  return session?.user?.role === UserRole.MODERATOR;
}

export function isUser(session: unknown): boolean {
  return session?.user?.role === UserRole.USER;
}

export function toPublicUser(u: any) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}
