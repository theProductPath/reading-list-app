import { Book, ReadingStatus, BookFormat } from '@/types/book';

export interface ReadingStats {
  totalBooks: number;
  booksByStatus: Record<ReadingStatus, number>;
  booksByFormat: Record<BookFormat, number>;
  booksByRating: Record<number, number>;
  finishedBooks: number;
  currentlyReading: number;
  wantToRead: number;
  abandoned: number;
  averageRating: number;
  totalRatings: number;
  booksFinishedThisYear: number;
  booksFinishedThisMonth: number;
  totalPages: number;
  averagePages: number;
  topAuthors: Array<{ author: string; count: number }>;
  topGenres: Array<{ genre: string; count: number }>;
  readingTimeline: Array<{ month: string; count: number }>;
  recentFinishes: Book[];
}

export function calculateReadingStats(books: Book[]): ReadingStats {
  const stats: ReadingStats = {
    totalBooks: books.length,
    booksByStatus: {
      'want-to-read': 0,
      'currently-reading': 0,
      'finished': 0,
      'abandoned': 0,
    },
    booksByFormat: {
      'book': 0,
      'ebook': 0,
      'audiobook': 0,
      'unknown': 0,
    },
    booksByRating: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    finishedBooks: 0,
    currentlyReading: 0,
    wantToRead: 0,
    abandoned: 0,
    averageRating: 0,
    totalRatings: 0,
    booksFinishedThisYear: 0,
    booksFinishedThisMonth: 0,
    totalPages: 0,
    averagePages: 0,
    topAuthors: [],
    topGenres: [],
    readingTimeline: [],
    recentFinishes: [],
  };

  if (books.length === 0) return stats;

  // Count by status and format
  books.forEach(book => {
    stats.booksByStatus[book.status]++;
    if (book.status === 'finished') stats.finishedBooks++;
    if (book.status === 'currently-reading') stats.currentlyReading++;
    if (book.status === 'want-to-read') stats.wantToRead++;
    if (book.status === 'abandoned') stats.abandoned++;
    
    // Count format - ensure we handle all cases correctly
    if (book.format && (book.format === 'book' || book.format === 'ebook' || book.format === 'audiobook')) {
      stats.booksByFormat[book.format]++;
    } else {
      stats.booksByFormat['unknown']++;
    }
  });

  // Calculate ratings
  const ratedBooks = books.filter(b => b.rating);
  stats.totalRatings = ratedBooks.length;
  if (ratedBooks.length > 0) {
    const sum = ratedBooks.reduce((acc, b) => acc + (b.rating || 0), 0);
    stats.averageRating = sum / ratedBooks.length;
    
    // Count books by rating
    ratedBooks.forEach(book => {
      const rating = book.rating;
      if (rating && rating >= 1 && rating <= 5) {
        stats.booksByRating[rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });
  }

  // Count pages
  const booksWithPages = books.filter(b => b.pageCount);
  stats.totalPages = booksWithPages.reduce((acc, b) => acc + (b.pageCount || 0), 0);
  if (booksWithPages.length > 0) {
    stats.averagePages = stats.totalPages / booksWithPages.length;
  }

  // Books finished this year/month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  books.forEach(book => {
    if (book.dateFinished) {
      const finishedDate = new Date(book.dateFinished);
      if (finishedDate.getFullYear() === currentYear) {
        stats.booksFinishedThisYear++;
        if (finishedDate.getMonth() === currentMonth) {
          stats.booksFinishedThisMonth++;
        }
      }
    }
  });

  // Top authors
  const authorCounts = new Map<string, number>();
  books.forEach(book => {
    const count = authorCounts.get(book.author) || 0;
    authorCounts.set(book.author, count + 1);
  });
  stats.topAuthors = Array.from(authorCounts.entries())
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top genres
  const genreCounts = new Map<string, number>();
  books.forEach(book => {
    if (book.genres) {
      book.genres.forEach(genre => {
        const count = genreCounts.get(genre) || 0;
        genreCounts.set(genre, count + 1);
      });
    }
  });
  stats.topGenres = Array.from(genreCounts.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Reading timeline (last 12 months)
  const timelineMap = new Map<string, number>();
  const months: string[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    months.push(monthLabel);
    timelineMap.set(monthKey, 0);
  }

  books.forEach(book => {
    if (book.dateFinished) {
      const finishedDate = new Date(book.dateFinished);
      const monthKey = `${finishedDate.getFullYear()}-${String(finishedDate.getMonth() + 1).padStart(2, '0')}`;
      if (timelineMap.has(monthKey)) {
        timelineMap.set(monthKey, (timelineMap.get(monthKey) || 0) + 1);
      }
    }
  });

  stats.readingTimeline = months.map((month, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - index));
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return {
      month,
      count: timelineMap.get(monthKey) || 0,
    };
  });

  // Recent finishes (last 5)
  stats.recentFinishes = books
    .filter(b => b.status === 'finished' && b.dateFinished)
    .sort((a, b) => {
      const dateA = new Date(a.dateFinished || 0).getTime();
      const dateB = new Date(b.dateFinished || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  return stats;
}
