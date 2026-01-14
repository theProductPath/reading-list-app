'use client';

import { Book, ReadingStatus } from '@/types/book';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
  onUpdateStatus: (id: string, status: ReadingStatus) => void;
  onUpdateRating?: (id: string, rating: number | undefined) => void;
  onFilterByAuthor?: (author: string) => void;
}

export default function BookList({ books, onUpdateStatus, onUpdateRating, onFilterByAuthor }: BookListProps) {
  if (books.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        color: '#666'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          No books in your reading list yet.
        </p>
        <p>Import your Notion exports or add a book manually to get started!</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
    }}>
      {books.map(book => (
        <BookCard 
          key={book.id} 
          book={book} 
          onUpdateStatus={onUpdateStatus}
          onUpdateRating={onUpdateRating}
          onFilterByAuthor={onFilterByAuthor}
        />
      ))}
    </div>
  );
}
