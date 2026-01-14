export type ReadingStatus = 'want-to-read' | 'currently-reading' | 'finished' | 'abandoned';
export type BookFormat = 'book' | 'ebook' | 'audiobook' | 'unknown';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  status: ReadingStatus;
  format?: BookFormat;
  dateAdded?: string;
  dateStarted?: string;
  dateFinished?: string;
  rating?: number;
  notes?: string;
  coverUrl?: string;
  description?: string;
  pageCount?: number;
  publishedDate?: string;
  genres?: string[];
  reviewUrl?: string;
}

export interface BookMetadata {
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  description?: string;
  pageCount?: number;
  publishedDate?: string;
  genres?: string[];
  rating?: number;
  reviewUrl?: string;
}
