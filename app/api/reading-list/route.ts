import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Book } from '@/types/book';

const DATA_FILE = path.join(process.cwd(), 'data', 'reading-list.json');

// Helper to read books from JSON file
async function readBooks(): Promise<Book[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, '[]', 'utf-8');
      return [];
    }
    throw error;
  }
}

// Helper to write books to JSON file
async function writeBooks(books: Book[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), 'utf-8');
}

// GET - Retrieve all books
export async function GET() {
  try {
    const books = await readBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error reading books:', error);
    return NextResponse.json(
      { error: 'Failed to read books' },
      { status: 500 }
    );
  }
}

// POST - Add a new book
export async function POST(request: NextRequest) {
  try {
    const newBook: Book = await request.json();

    if (!newBook.id || !newBook.title || !newBook.author) {
      return NextResponse.json(
        { error: 'Book must have id, title, and author' },
        { status: 400 }
      );
    }

    const books = await readBooks();
    books.push(newBook);
    await writeBooks(books);

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing book
export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const books = await readBooks();
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    books[index] = { ...books[index], ...updates };
    await writeBooks(books);

    return NextResponse.json(books[index]);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a book
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const books = await readBooks();
    const filteredBooks = books.filter(b => b.id !== id);

    if (filteredBooks.length === books.length) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    await writeBooks(filteredBooks);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
