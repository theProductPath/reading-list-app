import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Book } from '@/types/book';

const DATA_FILE = path.join(process.cwd(), 'data', 'reading-list.json');

// Helper to write books to JSON file
async function writeBooks(books: Book[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), 'utf-8');
}

// PUT - Replace all books (bulk save)
export async function PUT(request: NextRequest) {
  try {
    const books: Book[] = await request.json();

    if (!Array.isArray(books)) {
      return NextResponse.json(
        { error: 'Request body must be an array of books' },
        { status: 400 }
      );
    }

    await writeBooks(books);

    return NextResponse.json({ success: true, count: books.length });
  } catch (error) {
    console.error('Error saving books:', error);
    return NextResponse.json(
      { error: 'Failed to save books' },
      { status: 500 }
    );
  }
}
