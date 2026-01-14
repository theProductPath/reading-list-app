import { Book, ReadingStatus, BookFormat } from '@/types/book';

/**
 * Parse a CSV file exported from Notion
 */
export function parseNotionCSV(csvContent: string): Book[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const books: Book[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const book: Partial<Book> = {
      id: generateId(),
    };

    headers.forEach((header, index) => {
      const value = values[index]?.trim() || '';
      const headerLower = header.toLowerCase();
      
      switch (headerLower) {
        case 'title':
        case 'name':
          book.title = value;
          break;
        case 'author':
        case 'authors':
          book.author = value;
          break;
        case 'isbn':
          book.isbn = value;
          break;
        case 'status':
          book.status = mapStatus(value);
          break;
        case 'format':
        case 'type':
          book.format = mapFormat(value);
          break;
        case 'rating':
        case 'score /5':
        case 'score':
          book.rating = parseStarRating(value);
          break;
        case 'notes':
        case 'notes/comments':
          book.notes = value;
          break;
        case 'date added':
        case 'dateadded':
          book.dateAdded = value;
          break;
        case 'date started':
        case 'datestarted':
          book.dateStarted = value;
          break;
        case 'date finished':
        case 'datefinished':
        case 'finished':
          book.dateFinished = parseDate(value);
          break;
        case 'cover image':
        case 'cover':
        case 'coverimage':
          if (value && value.startsWith('http')) {
            book.coverUrl = value;
          }
          break;
      }
    });

    if (book.title && book.author) {
      books.push({
        id: book.id!,
        title: book.title,
        author: book.author,
        status: book.status || 'want-to-read',
        ...book,
      } as Book);
    }
  }

  return books;
}

/**
 * Parse a markdown file exported from Notion
 */
export function parseNotionMarkdown(mdContent: string): Book[] {
  const books: Book[] = [];
  const lines = mdContent.split('\n');
  
  let currentBook: Partial<Book> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for heading (book title)
    if (line.startsWith('# ')) {
      if (currentBook && currentBook.title && currentBook.author) {
        books.push({
          id: generateId(),
          title: currentBook.title,
          author: currentBook.author,
          status: currentBook.status || 'want-to-read',
          ...currentBook,
        } as Book);
      }
      currentBook = { id: generateId(), title: line.substring(2).trim() };
    }
    // Check for metadata lines (Author:, Status:, etc.)
    else if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      const keyLower = key.toLowerCase().trim();
      
      if (!currentBook) currentBook = { id: generateId() };
      
      switch (keyLower) {
        case 'author':
        case 'authors':
          currentBook.author = value;
          break;
        case 'status':
          currentBook.status = mapStatus(value);
          break;
        case 'format':
        case 'type':
          currentBook.format = mapFormat(value);
          break;
        case 'isbn':
          currentBook.isbn = value;
          break;
        case 'rating':
          currentBook.rating = parseFloat(value) || undefined;
          break;
        case 'notes':
          currentBook.notes = value;
          break;
      }
    }
  }
  
  // Add last book
  if (currentBook && currentBook.title && currentBook.author) {
    books.push({
      id: generateId(),
      title: currentBook.title,
      author: currentBook.author,
      status: currentBook.status || 'want-to-read',
      ...currentBook,
    } as Book);
  }
  
  return books;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

function mapStatus(status: string): ReadingStatus {
  const statusLower = status.toLowerCase().trim();
  
  if (statusLower.includes('finished') || statusLower.includes('read') || statusLower === 'done') {
    return 'finished';
  }
  if (statusLower.includes('reading') || statusLower.includes('current')) {
    return 'currently-reading';
  }
  if (statusLower.includes('abandoned') || statusLower.includes('dropped') || statusLower.includes('quit')) {
    return 'abandoned';
  }
  if (statusLower.includes('ready to start') || statusLower.includes('want to read')) {
    return 'want-to-read';
  }
  
  return 'want-to-read';
}

function mapFormat(format: string): BookFormat {
  // Remove emojis and normalize
  const cleaned = format.replace(/[🔉📖📱📚]/g, '').trim();
  const formatLower = cleaned.toLowerCase();
  
  if (formatLower.includes('ebook') || formatLower.includes('e-book') || formatLower.includes('digital')) {
    return 'ebook';
  }
  if (formatLower.includes('audio') || formatLower.includes('audiobook') || formatLower.includes('audible')) {
    return 'audiobook';
  }
  if (formatLower.includes('book') || formatLower.includes('physical') || formatLower.includes('hardcover') || formatLower.includes('paperback') || formatLower.includes('graphic novel')) {
    return 'book';
  }
  
  return 'unknown';
}

/**
 * Parse star rating from emoji format (⭐️⭐️⭐️) or numeric format
 */
function parseStarRating(rating: string): number | undefined {
  if (!rating || !rating.trim()) return undefined;
  
  // Count star emojis (⭐️ or ⭐)
  const starMatches = rating.match(/⭐️|⭐/g);
  if (starMatches) {
    return starMatches.length;
  }
  
  // Try to parse as number
  const numeric = parseFloat(rating);
  if (!isNaN(numeric) && numeric >= 0 && numeric <= 5) {
    return numeric;
  }
  
  return undefined;
}

/**
 * Parse date string and convert to ISO format if possible
 */
function parseDate(dateStr: string): string | undefined {
  if (!dateStr || !dateStr.trim()) return undefined;
  
  try {
    // Try to parse common date formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (e) {
    // If parsing fails, return the original string
  }
  
  return dateStr;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
