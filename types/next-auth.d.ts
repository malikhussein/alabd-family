import { DefaultSession } from 'next-auth';
import { UserRole } from '../entities/user.entity';

declare module 'next-auth' {
  interface User {
    role: UserRole;
  }
  interface Session {
    user: DefaultSession['user'] & {
      role: UserRole;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
  }
}
