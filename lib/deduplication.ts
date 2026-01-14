import { Book } from '@/types/book';

/**
 * Normalize a string for comparison (lowercase, trim, remove extra spaces)
 */
function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Check if two books are duplicates based on title and author
 */
export function areBooksDuplicate(book1: Book, book2: Book): boolean {
  const title1 = normalizeString(book1.title);
  const title2 = normalizeString(book2.title);
  const author1 = normalizeString(book1.author);
  const author2 = normalizeString(book2.author);

  // Exact match on title and author
  if (title1 === title2 && author1 === author2) {
    return true;
  }

  // Also check by ISBN if available
  if (book1.isbn && book2.isbn && book1.isbn === book2.isbn) {
    return true;
  }

  return false;
}

/**
 * Remove duplicates from an array of books, keeping the first occurrence
 * and merging data from duplicates (preferring non-empty values)
 */
export function removeDuplicates(books: Book[]): Book[] {
  const seen = new Map<string, Book>();
  const duplicates: { original: Book; duplicate: Book }[] = [];

  for (const book of books) {
    let isDuplicate = false;
    let existingBook: Book | null = null;
    let key: string | null = null;

    // Check against all seen books
    for (const [seenKey, seenBook] of seen.entries()) {
      if (areBooksDuplicate(book, seenBook)) {
        isDuplicate = true;
        existingBook = seenBook;
        key = seenKey;
        break;
      }
    }

    if (isDuplicate && existingBook && key) {
      // Merge duplicate data into existing book (prefer non-empty values)
      const merged: Book = {
        ...existingBook,
        // Keep the original ID
        id: existingBook.id,
        // Merge metadata - prefer existing if both have values, otherwise take whichever has value
        isbn: existingBook.isbn || book.isbn,
        coverUrl: existingBook.coverUrl || book.coverUrl,
        description: existingBook.description || book.description,
        pageCount: existingBook.pageCount || book.pageCount,
        publishedDate: existingBook.publishedDate || book.publishedDate,
        genres: existingBook.genres || book.genres,
        // Keep the most advanced status (finished > currently-reading > want-to-read)
        status: getMostAdvancedStatus(existingBook.status, book.status),
        // Keep the earliest date added
        dateAdded: existingBook.dateAdded && book.dateAdded
          ? (existingBook.dateAdded < book.dateAdded ? existingBook.dateAdded : book.dateAdded)
          : existingBook.dateAdded || book.dateAdded,
        // Keep the earliest date started
        dateStarted: existingBook.dateStarted && book.dateStarted
          ? (existingBook.dateStarted < book.dateStarted ? existingBook.dateStarted : book.dateStarted)
          : existingBook.dateStarted || book.dateStarted,
        // Keep the latest date finished (most recent completion)
        dateFinished: existingBook.dateFinished && book.dateFinished
          ? (existingBook.dateFinished > book.dateFinished ? existingBook.dateFinished : book.dateFinished)
          : existingBook.dateFinished || book.dateFinished,
        // Keep the highest rating
        rating: existingBook.rating && book.rating
          ? Math.max(existingBook.rating, book.rating)
          : existingBook.rating || book.rating,
        // Merge notes
        notes: mergeNotes(existingBook.notes, book.notes),
      };

      seen.set(key, merged);
      duplicates.push({ original: existingBook, duplicate: book });
    } else {
      // Create a key for this book
      const bookKey = `${normalizeString(book.title)}|${normalizeString(book.author)}`;
      seen.set(bookKey, book);
    }
  }

  return Array.from(seen.values());
}

/**
 * Get the most advanced reading status
 */
function getMostAdvancedStatus(status1: Book['status'], status2: Book['status']): Book['status'] {
  const statusOrder: Record<Book['status'], number> = {
    'finished': 4,
    'currently-reading': 3,
    'want-to-read': 2,
    'abandoned': 1,
  };

  return statusOrder[status1] > statusOrder[status2] ? status1 : status2;
}

/**
 * Merge notes from two books
 */
function mergeNotes(notes1?: string, notes2?: string): string | undefined {
  if (!notes1 && !notes2) return undefined;
  if (!notes1) return notes2;
  if (!notes2) return notes1;
  if (notes1 === notes2) return notes1;
  
  // Combine notes, avoiding exact duplicates
  const combined = [notes1, notes2].filter((n, i, arr) => arr.indexOf(n) === i);
  return combined.join('\n\n---\n\n');
}

/**
 * Count duplicates in an array of books
 */
export function countDuplicates(books: Book[]): number {
  const unique = removeDuplicates(books);
  return books.length - unique.length;
}
