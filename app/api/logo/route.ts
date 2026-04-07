import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Keep a stable URL for crawlers and brand schema references.
  const logoUrl = new URL('/images/hz.png', req.url);
  return NextResponse.redirect(logoUrl, 308);
}
