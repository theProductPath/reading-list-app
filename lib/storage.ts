import { Book } from '@/types/book';

const STORAGE_KEY = 'reading-list-books';

export function getBooks(): Book[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

export function saveBooks(books: Book[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function addBook(book: Book): void {
  const books = getBooks();
  books.push(book);
  saveBooks(books);
}

export function updateBook(id: string, updates: Partial<Book>): void {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  
  if (index !== -1) {
    books[index] = { ...books[index], ...updates };
    saveBooks(books);
  }
}

export function deleteBook(id: string): void {
  const books = getBooks();
  const filtered = books.filter(b => b.id !== id);
  saveBooks(filtered);
}

export function getBookById(id: string): Book | undefined {
  const books = getBooks();
  return books.find(b => b.id === id);
}
