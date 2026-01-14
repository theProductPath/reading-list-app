import { NextRequest, NextResponse } from 'next/server';
import { getBookMetadata } from '@/lib/bookApi';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');
  const author = searchParams.get('author');

  if (!title) {
    return NextResponse.json(
      { error: 'Title parameter is required' },
      { status: 400 }
    );
  }

  try {
    const metadata = await getBookMetadata(title, author || undefined);
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching book metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book metadata' },
      { status: 500 }
    );
  }
}
