import { areBooksDuplicate, removeDuplicates, countDuplicates } from '@/lib/deduplication';
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

describe('areBooksDuplicate', () => {
  it('returns true for exact title and author match', () => {
    const book1 = createBook({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' });
    const book2 = createBook({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' });

    expect(areBooksDuplicate(book1, book2)).toBe(true);
  });

  it('returns true for case-insensitive matches', () => {
    const book1 = createBook({ title: 'THE GREAT GATSBY', author: 'F. SCOTT FITZGERALD' });
    const book2 = createBook({ title: 'the great gatsby', author: 'f. scott fitzgerald' });

    expect(areBooksDuplicate(book1, book2)).toBe(true);
  });

  it('returns true for matches with extra whitespace', () => {
    const book1 = createBook({ title: '  The Great Gatsby  ', author: 'F. Scott  Fitzgerald' });
    const book2 = createBook({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' });

    expect(areBooksDuplicate(book1, book2)).toBe(true);
  });

  it('returns true for matching ISBNs', () => {
    const book1 = createBook({ title: 'Book One', author: 'Author A', isbn: '978-0-123456-78-9' });
    const book2 = createBook({ title: 'Different Title', author: 'Different Author', isbn: '978-0-123456-78-9' });

    expect(areBooksDuplicate(book1, book2)).toBe(true);
  });

  it('returns false for different books', () => {
    const book1 = createBook({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' });
    const book2 = createBook({ title: '1984', author: 'George Orwell' });

    expect(areBooksDuplicate(book1, book2)).toBe(false);
  });

  it('returns false for same title but different author', () => {
    const book1 = createBook({ title: 'The Journey', author: 'Author One' });
    const book2 = createBook({ title: 'The Journey', author: 'Author Two' });

    expect(areBooksDuplicate(book1, book2)).toBe(false);
  });
});

describe('removeDuplicates', () => {
  it('returns empty array for empty input', () => {
    expect(removeDuplicates([])).toEqual([]);
  });

  it('returns same books when no duplicates exist', () => {
    const books = [
      createBook({ title: 'Book One', author: 'Author A' }),
      createBook({ title: 'Book Two', author: 'Author B' }),
    ];

    const result = removeDuplicates(books);
    expect(result).toHaveLength(2);
  });

  it('removes duplicate books', () => {
    const books = [
      createBook({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }),
      createBook({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }),
      createBook({ title: '1984', author: 'George Orwell' }),
    ];

    const result = removeDuplicates(books);
    expect(result).toHaveLength(2);
  });

  it('keeps the most advanced status when merging', () => {
    const books = [
      createBook({ title: 'Test', author: 'Author', status: 'want-to-read' }),
      createBook({ title: 'Test', author: 'Author', status: 'finished' }),
    ];

    const result = removeDuplicates(books);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('finished');
  });

  it('keeps the highest rating when merging', () => {
    const books = [
      createBook({ title: 'Test', author: 'Author', rating: 3 }),
      createBook({ title: 'Test', author: 'Author', rating: 5 }),
    ];

    const result = removeDuplicates(books);
    expect(result).toHaveLength(1);
    expect(result[0].rating).toBe(5);
  });

  it('merges metadata from duplicates', () => {
    const books = [
      createBook({ title: 'Test', author: 'Author', coverUrl: 'http://example.com/cover.jpg' }),
      createBook({ title: 'Test', author: 'Author', description: 'A great book' }),
    ];

    const result = removeDuplicates(books);
    expect(result).toHaveLength(1);
    expect(result[0].coverUrl).toBe('http://example.com/cover.jpg');
    expect(result[0].description).toBe('A great book');
  });
});

describe('countDuplicates', () => {
  it('returns 0 for empty array', () => {
    expect(countDuplicates([])).toBe(0);
  });

  it('returns 0 when no duplicates exist', () => {
    const books = [
      createBook({ title: 'Book One', author: 'Author A' }),
      createBook({ title: 'Book Two', author: 'Author B' }),
    ];

    expect(countDuplicates(books)).toBe(0);
  });

  it('returns correct count of duplicates', () => {
    const books = [
      createBook({ title: 'Duplicate', author: 'Author' }),
      createBook({ title: 'Duplicate', author: 'Author' }),
      createBook({ title: 'Duplicate', author: 'Author' }),
      createBook({ title: 'Unique', author: 'Other' }),
    ];

    expect(countDuplicates(books)).toBe(2);
  });
});
