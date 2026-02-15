import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCode } from '../entities/auth-code.entity';
import { Post } from '../entities/post.entity';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';
import { Banner } from '../entities/banner.entity';
import { FamilyData } from '../entities/family-data.entity';

const globalForDataSource = globalThis as unknown as {
  appDataSource?: DataSource;
};

export const AppDataSource =
  globalForDataSource.appDataSource ??
  new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, AuthCode, Post, Like, Comment, Banner, FamilyData],
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
