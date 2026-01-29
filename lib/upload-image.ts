import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3';

const MAX_MB = 5;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type UploadKind = 'avatar' | 'post';

function extFromType(type: string) {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  return null;
}

function safeSegment(value: string) {
  // keeps keys clean (no spaces, slashes, weird chars)
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .slice(0, 80);
}

/**
 * Uploads an image (received as a Web File object) to MinIO/S3.
 * Returns the S3 key and the public URL.
 */
export async function uploadImageToS3(params: {
  file: File;
  kind: UploadKind;
  userKey?: string; // user id or email (required for avatars)
}) {
  const { file, kind, userKey } = params;

  // validate by file itself
  if (!ALLOWED.has(file.type)) throw new Error('Invalid file type');
  if (file.size <= 0 || file.size > MAX_MB * 1024 * 1024)
    throw new Error(`Max file size is ${MAX_MB}MB`);

  const ext = extFromType(file.type);
  if (!ext) throw new Error('Unsupported type');

  const bucket = process.env.S3_BUCKET;
  const base = process.env.S3_PUBLIC_BASE_URL;

  if (!bucket) throw new Error('Missing S3_BUCKET env');
  if (!base) throw new Error('Missing S3_PUBLIC_BASE_URL env');

  if (kind === 'avatar' && !userKey) {
    throw new Error('userKey is required for avatar uploads');
  }

  const random = crypto.randomBytes(16).toString('hex');
  const folder = kind === 'avatar' ? 'avatars' : 'posts';
  const key =
    kind === 'avatar'
      ? `${folder}/${safeSegment(userKey!)}/${random}.${ext}`
      : `${folder}/${random}.${ext}`;

  const bytes = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: bytes,
      ContentType: file.type,
    }),
  );

  const publicUrl = `${base.replace(/\/$/, '')}/${key}`;
  return { key, publicUrl, contentType: file.type, size: file.size };
}
