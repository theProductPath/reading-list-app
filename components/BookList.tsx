'use client';

import { useRouter } from 'next/navigation';
import { Book, ReadingStatus } from '@/types/book';
import BookCard from './BookCard';
import { DisplayMode } from './FilterBar';

interface BookListProps {
  books: Book[];
  onUpdateStatus: (id: string, status: ReadingStatus) => void;
  onUpdateRating?: (id: string, rating: number | undefined) => void;
  onDelete?: (id: string) => void;
  onFilterByAuthor?: (author: string) => void;
  onFilterByGenre?: (genre: string) => void;
  displayMode?: DisplayMode;
}

const statusLabels: Record<ReadingStatus, string> = {
  'want-to-read': 'Want to Read',
  'currently-reading': 'Reading',
  'finished': 'Finished',
  'abandoned': 'Abandoned',
};

const statusColors: Record<ReadingStatus, string> = {
  'want-to-read': '#9e9e9e',
  'currently-reading': '#2196f3',
  'finished': '#4caf50',
  'abandoned': '#f44336',
};

export default function BookList({ books, onUpdateStatus, onUpdateRating, onDelete, onFilterByAuthor, onFilterByGenre, displayMode = 'card' }: BookListProps) {
  const router = useRouter();

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

  if (displayMode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px 1fr 150px 120px 100px 50px',
          gap: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '0.85rem',
          color: '#666',
        }}>
          <div></div>
          <div>Title / Author</div>
          <div>Status</div>
          <div>Rating</div>
          <div>Format</div>
          <div></div>
        </div>

        {/* Book rows */}
        {books.map(book => (
          <div
            key={book.id}
            onClick={() => router.push(`/book/${book.id}`)}
            style={{
              display: 'grid',
              gridTemplateColumns: '50px 1fr 150px 120px 100px 50px',
              gap: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fafafa';
            }}
          >
            {/* Cover thumbnail */}
            <div>
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt=""
                  style={{
                    width: '40px',
                    height: '55px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <div style={{
                  width: '40px',
                  height: '55px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  📖
                </div>
              )}
            </div>

            {/* Title and Author */}
            <div>
              <div style={{ fontWeight: '500', color: '#333', marginBottom: '0.2rem' }}>
                {book.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>
                {book.author}
              </div>
              {book.genres && book.genres.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {book.genres.map((genre) => (
                    <span
                      key={genre}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onFilterByGenre) {
                          onFilterByGenre(genre);
                        }
                      }}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.45rem',
                        borderRadius: '10px',
                        backgroundColor: '#667eea15',
                        color: '#667eea',
                        fontWeight: '500',
                        cursor: onFilterByGenre ? 'pointer' : 'default',
                        transition: 'background-color 0.2s',
                        display: 'inline-block',
                      }}
                      onMouseEnter={onFilterByGenre ? (e) => {
                        e.currentTarget.style.backgroundColor = '#667eea30';
                      } : undefined}
                      onMouseLeave={onFilterByGenre ? (e) => {
                        e.currentTarget.style.backgroundColor = '#667eea15';
                      } : undefined}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div onClick={(e) => e.stopPropagation()}>
              <select
                value={book.status}
                onChange={(e) => onUpdateStatus(book.id, e.target.value as ReadingStatus)}
                style={{
                  padding: '0.3rem 0.5rem',
                  borderRadius: '4px',
                  border: `2px solid ${statusColors[book.status]}`,
                  backgroundColor: 'white',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '0.1rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => onUpdateRating?.(book.id, book.rating === star ? undefined : star)}
                  style={{
                    fontSize: '1rem',
                    color: star <= (book.rating || 0) ? '#ffa726' : '#ddd',
                    cursor: 'pointer',
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>

            {/* Format */}
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              {book.format === 'book' ? '📖 Book' :
               book.format === 'ebook' ? '📱 eBook' :
               book.format === 'audiobook' ? '🎧 Audio' : '—'}
            </div>

            {/* Delete */}
            <div onClick={(e) => e.stopPropagation()}>
              {onDelete && (
                <button
                  onClick={() => onDelete(book.id)}
                  title="Delete book"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    opacity: 0.5,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.5';
                  }}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
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
          onDelete={onDelete}
          onFilterByAuthor={onFilterByAuthor}
          onFilterByGenre={onFilterByGenre}
        />
      ))}
    </div>
  );
}
