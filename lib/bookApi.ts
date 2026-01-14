import { BookMetadata } from '@/types/book';

const OPEN_LIBRARY_API = 'https://openlibrary.org';
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export interface BookSearchResult {
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  description?: string;
  pageCount?: number;
  publishedDate?: string;
  genres?: string[];
}

/**
 * Search for book metadata using Open Library API
 */
export async function searchBookOpenLibrary(query: string): Promise<BookSearchResult | null> {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&limit=1`
    );
    const data = await response.json();
    
    if (data.docs && data.docs.length > 0) {
      const book = data.docs[0];
      const coverId = book.cover_i;
      const coverUrl = coverId 
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : undefined;
      
      return {
        title: book.title || query,
        author: book.author_name?.[0] || 'Unknown',
        isbn: book.isbn?.[0],
        coverUrl,
        description: undefined, // Open Library doesn't provide descriptions in search
        publishedDate: book.first_publish_year?.toString(),
      };
    }
  } catch (error) {
    console.error('Error fetching from Open Library:', error);
  }
  
  return null;
}

/**
 * Search for book metadata using Google Books API
 */
export async function searchBookGoogleBooks(query: string): Promise<BookSearchResult | null> {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=1`
    );
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const volume = data.items[0].volumeInfo;
      const isbn = volume.industryIdentifiers?.find(
        (id: any) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
      )?.identifier;
      
      return {
        title: volume.title || query,
        author: volume.authors?.[0] || 'Unknown',
        isbn,
        coverUrl: volume.imageLinks?.thumbnail || volume.imageLinks?.smallThumbnail,
        description: volume.description,
        pageCount: volume.pageCount,
        publishedDate: volume.publishedDate,
        genres: volume.categories,
      };
    }
  } catch (error) {
    console.error('Error fetching from Google Books:', error);
  }
  
  return null;
}

/**
 * Get book metadata - tries Google Books first, then Open Library
 */
export async function getBookMetadata(title: string, author?: string): Promise<BookMetadata | null> {
  const query = author ? `${title} ${author}` : title;
  
  // Try Google Books first (better metadata)
  let result = await searchBookGoogleBooks(query);
  
  // Fallback to Open Library
  if (!result) {
    result = await searchBookOpenLibrary(query);
  }
  
  if (!result) {
    return {
      title,
      author: author || 'Unknown',
    };
  }
  
  return {
    title: result.title,
    author: result.author,
    isbn: result.isbn,
    coverUrl: result.coverUrl,
    description: result.description,
    pageCount: result.pageCount,
    publishedDate: result.publishedDate,
    genres: result.genres,
  };
}

/**
 * Get book cover URL by ISBN
 */
export function getCoverUrlByISBN(isbn: string): string {
  // Open Library cover API
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}
