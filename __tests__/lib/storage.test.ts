import { getBooks, saveBooks, addBook, updateBook, deleteBook, getBookById } from '@/lib/storage';
import { Book } from '@/types/book';

// Helper to create a minimal book object
function createBook(overrides: Partial<Book> = {}): Book {
  return {
    id: `test-${Math.random()}`,
    title: 'Test Book',
    author: 'Test Author',
    status: 'want-to-read',
    ...overrides,
  };
}

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Suppress console.error during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

beforeEach(() => {
  mockFetch.mockClear();
});

describe('getBooks', () => {
  it('fetches books from the API', async () => {
    const mockBooks = [createBook({ id: '1' }), createBook({ id: '2' })];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks,
    });

    const result = await getBooks();

    expect(mockFetch).toHaveBeenCalledWith('/api/reading-list');
    expect(result).toEqual(mockBooks);
  });

  it('returns empty array on fetch error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const result = await getBooks();

    expect(result).toEqual([]);
  });

  it('returns empty array on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getBooks();

    expect(result).toEqual([]);
  });
});

describe('saveBooks', () => {
  it('saves books via bulk PUT endpoint', async () => {
    const books = [createBook({ id: '1' })];
    mockFetch.mockResolvedValueOnce({ ok: true });

    await saveBooks(books);

    expect(mockFetch).toHaveBeenCalledWith('/api/reading-list/bulk', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(books),
    });
  });

  it('handles save error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(saveBooks([createBook()])).resolves.toBeUndefined();
  });
});

describe('addBook', () => {
  it('adds a book via POST endpoint', async () => {
    const book = createBook({ id: 'new-book' });
    mockFetch.mockResolvedValueOnce({ ok: true });

    await addBook(book);

    expect(mockFetch).toHaveBeenCalledWith('/api/reading-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
  });

  it('handles add error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(addBook(createBook())).resolves.toBeUndefined();
  });
});

describe('updateBook', () => {
  it('updates a book via PUT endpoint', async () => {
    const id = 'book-123';
    const updates = { status: 'finished' as const, rating: 5 };
    mockFetch.mockResolvedValueOnce({ ok: true });

    await updateBook(id, updates);

    expect(mockFetch).toHaveBeenCalledWith('/api/reading-list', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates }),
    });
  });

  it('handles update error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(updateBook('id', { rating: 3 })).resolves.toBeUndefined();
  });
});

describe('deleteBook', () => {
  it('deletes a book via DELETE endpoint with id query param', async () => {
    const id = 'book-to-delete';
    mockFetch.mockResolvedValueOnce({ ok: true });

    await deleteBook(id);

    expect(mockFetch).toHaveBeenCalledWith('/api/reading-list?id=book-to-delete', {
      method: 'DELETE',
    });
  });

  it('handles delete error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(deleteBook('id')).resolves.toBeUndefined();
  });

  it('handles network error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(deleteBook('id')).resolves.toBeUndefined();
  });
});

describe('getBookById', () => {
  it('returns the book with matching id', async () => {
    const books = [
      createBook({ id: 'book-1', title: 'First Book' }),
      createBook({ id: 'book-2', title: 'Second Book' }),
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => books,
    });

    const result = await getBookById('book-2');

    expect(result?.title).toBe('Second Book');
  });

  it('returns undefined if book not found', async () => {
    const books = [createBook({ id: 'book-1' })];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => books,
    });

    const result = await getBookById('nonexistent');

    expect(result).toBeUndefined();
  });

  it('returns undefined on fetch error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    const result = await getBookById('any-id');

    expect(result).toBeUndefined();
  });
});
