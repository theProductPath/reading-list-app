import { Book } from '@/types/book';

const API_BASE = '/api/reading-list';

export async function getBooks(): Promise<Book[]> {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

export async function saveBooks(books: Book[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/bulk`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(books),
    });
    if (!response.ok) {
      throw new Error('Failed to save books');
    }
  } catch (error) {
    console.error('Error saving books:', error);
  }
}

export async function addBook(book: Book): Promise<void> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!response.ok) {
      throw new Error('Failed to add book');
    }
  } catch (error) {
    console.error('Error adding book:', error);
  }
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<void> {
  try {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates }),
    });
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
  } catch (error) {
    console.error('Error updating book:', error);
  }
}

export async function deleteBook(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
  }
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find(b => b.id === id);
}
