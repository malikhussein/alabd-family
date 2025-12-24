import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCode } from '../entities/auth-code.entity';

const globalForDataSource = globalThis as unknown as {
  appDataSource?: DataSource;
};

export const AppDataSource =
  globalForDataSource.appDataSource ??
  new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, AuthCode],
    synchronize: true, // use migrations later
    logging: true,
  });

if (!globalForDataSource.appDataSource) {
  globalForDataSource.appDataSource = AppDataSource;
}

export async function getDb() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
