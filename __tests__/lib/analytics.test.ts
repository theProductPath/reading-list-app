import { calculateReadingStats } from '@/lib/analytics';
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

describe('calculateReadingStats', () => {
  it('returns zero stats for empty array', () => {
    const stats = calculateReadingStats([]);

    expect(stats.totalBooks).toBe(0);
    expect(stats.finishedBooks).toBe(0);
    expect(stats.currentlyReading).toBe(0);
    expect(stats.wantToRead).toBe(0);
    expect(stats.averageRating).toBe(0);
  });

  it('counts total books correctly', () => {
    const books = [
      createBook(),
      createBook(),
      createBook(),
    ];

    const stats = calculateReadingStats(books);
    expect(stats.totalBooks).toBe(3);
  });

  it('counts books by status correctly', () => {
    const books = [
      createBook({ status: 'want-to-read' }),
      createBook({ status: 'want-to-read' }),
      createBook({ status: 'currently-reading' }),
      createBook({ status: 'finished' }),
      createBook({ status: 'finished' }),
      createBook({ status: 'finished' }),
      createBook({ status: 'abandoned' }),
    ];

    const stats = calculateReadingStats(books);
    expect(stats.booksByStatus['want-to-read']).toBe(2);
    expect(stats.booksByStatus['currently-reading']).toBe(1);
    expect(stats.booksByStatus['finished']).toBe(3);
    expect(stats.booksByStatus['abandoned']).toBe(1);
    expect(stats.wantToRead).toBe(2);
    expect(stats.currentlyReading).toBe(1);
    expect(stats.finishedBooks).toBe(3);
    expect(stats.abandoned).toBe(1);
  });

  it('counts books by format correctly', () => {
    const books = [
      createBook({ format: 'book' }),
      createBook({ format: 'book' }),
      createBook({ format: 'ebook' }),
      createBook({ format: 'audiobook' }),
      createBook({ format: undefined }),
    ];

    const stats = calculateReadingStats(books);
    expect(stats.booksByFormat['book']).toBe(2);
    expect(stats.booksByFormat['ebook']).toBe(1);
    expect(stats.booksByFormat['audiobook']).toBe(1);
    expect(stats.booksByFormat['unknown']).toBe(1);
  });

  it('calculates average rating correctly', () => {
    const books = [
      createBook({ rating: 5 }),
      createBook({ rating: 4 }),
      createBook({ rating: 3 }),
      createBook({ rating: undefined }), // should be excluded
    ];

    const stats = calculateReadingStats(books);
    expect(stats.averageRating).toBe(4); // (5 + 4 + 3) / 3
    expect(stats.totalRatings).toBe(3);
  });

  it('counts books by rating correctly', () => {
    const books = [
      createBook({ rating: 5 }),
      createBook({ rating: 5 }),
      createBook({ rating: 4 }),
      createBook({ rating: 3 }),
      createBook({ rating: 1 }),
    ];

    const stats = calculateReadingStats(books);
    expect(stats.booksByRating[5]).toBe(2);
    expect(stats.booksByRating[4]).toBe(1);
    expect(stats.booksByRating[3]).toBe(1);
    expect(stats.booksByRating[2]).toBe(0);
    expect(stats.booksByRating[1]).toBe(1);
  });

  it('calculates total and average pages correctly', () => {
    const books = [
      createBook({ pageCount: 300 }),
      createBook({ pageCount: 200 }),
      createBook({ pageCount: undefined }), // should be excluded
    ];

    const stats = calculateReadingStats(books);
    expect(stats.totalPages).toBe(500);
    expect(stats.averagePages).toBe(250);
  });

  it('identifies top authors correctly', () => {
    const books = [
      createBook({ author: 'Author A' }),
      createBook({ author: 'Author A' }),
      createBook({ author: 'Author A' }),
      createBook({ author: 'Author B' }),
      createBook({ author: 'Author B' }),
      createBook({ author: 'Author C' }),
    ];

    const stats = calculateReadingStats(books);
    expect(stats.topAuthors).toHaveLength(3);
    expect(stats.topAuthors[0]).toEqual({ author: 'Author A', count: 3 });
    expect(stats.topAuthors[1]).toEqual({ author: 'Author B', count: 2 });
    expect(stats.topAuthors[2]).toEqual({ author: 'Author C', count: 1 });
  });

  it('identifies top genres correctly', () => {
    const books = [
      createBook({ genres: ['Fiction', 'Drama'] }),
      createBook({ genres: ['Fiction', 'Thriller'] }),
      createBook({ genres: ['Non-Fiction'] }),
    ];

    const stats = calculateReadingStats(books);
    expect(stats.topGenres.find(g => g.genre === 'Fiction')?.count).toBe(2);
    expect(stats.topGenres.find(g => g.genre === 'Drama')?.count).toBe(1);
    expect(stats.topGenres.find(g => g.genre === 'Thriller')?.count).toBe(1);
    expect(stats.topGenres.find(g => g.genre === 'Non-Fiction')?.count).toBe(1);
  });

  it('limits top authors to 5', () => {
    const books = [
      createBook({ author: 'Author A' }),
      createBook({ author: 'Author B' }),
      createBook({ author: 'Author C' }),
      createBook({ author: 'Author D' }),
      createBook({ author: 'Author E' }),
      createBook({ author: 'Author F' }),
      createBook({ author: 'Author G' }),
    ];

    const stats = calculateReadingStats(books);
    expect(stats.topAuthors).toHaveLength(5);
  });

  it('counts books finished this year', () => {
    const thisYear = new Date().getFullYear();
    const lastYear = thisYear - 1;

    const books = [
      createBook({ status: 'finished', dateFinished: `${thisYear}-06-15` }),
      createBook({ status: 'finished', dateFinished: `${thisYear}-03-10` }),
      createBook({ status: 'finished', dateFinished: `${lastYear}-12-01` }),
    ];

    const stats = calculateReadingStats(books);
    expect(stats.booksFinishedThisYear).toBe(2);
  });

  it('returns recent finishes sorted by date', () => {
    const books = [
      createBook({ status: 'finished', dateFinished: '2024-01-01', title: 'Old Book' }),
      createBook({ status: 'finished', dateFinished: '2024-06-01', title: 'Recent Book' }),
      createBook({ status: 'finished', dateFinished: '2024-03-01', title: 'Middle Book' }),
      createBook({ status: 'want-to-read', title: 'Not Finished' }),
    ];

    const stats = calculateReadingStats(books);
    expect(stats.recentFinishes).toHaveLength(3);
    expect(stats.recentFinishes[0].title).toBe('Recent Book');
    expect(stats.recentFinishes[1].title).toBe('Middle Book');
    expect(stats.recentFinishes[2].title).toBe('Old Book');
  });

  it('limits recent finishes to 5', () => {
    const books = Array.from({ length: 10 }, (_, i) =>
      createBook({
        status: 'finished',
        dateFinished: `2024-0${(i % 9) + 1}-01`,
        title: `Book ${i}`
      })
    );

    const stats = calculateReadingStats(books);
    expect(stats.recentFinishes).toHaveLength(5);
  });

  it('generates reading timeline with 12 months', () => {
    const stats = calculateReadingStats([]);
    expect(stats.readingTimeline).toHaveLength(12);
  });
});
