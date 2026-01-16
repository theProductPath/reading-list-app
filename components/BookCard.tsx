'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, ReadingStatus, BookFormat } from '@/types/book';

interface BookCardProps {
  book: Book;
  onUpdateStatus: (id: string, status: ReadingStatus) => void;
  onUpdateRating?: (id: string, rating: number | undefined) => void;
  onDelete?: (id: string) => void;
  onFilterByAuthor?: (author: string) => void;
}

const statusLabels: Record<ReadingStatus, string> = {
  'want-to-read': 'Want to Read',
  'currently-reading': 'Currently Reading',
  'finished': 'Finished',
  'abandoned': 'Abandoned',
};

const statusColors: Record<ReadingStatus, string> = {
  'want-to-read': '#9e9e9e',
  'currently-reading': '#2196f3',
  'finished': '#4caf50',
  'abandoned': '#f44336',
};

export default function BookCard({ book, onUpdateStatus, onUpdateRating, onDelete, onFilterByAuthor }: BookCardProps) {
  const router = useRouter();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleCardClick = () => {
    router.push(`/book/${book.id}`);
  };

  const handleRatingClick = (rating: number) => {
    if (onUpdateRating) {
      // If clicking the same rating, remove it
      if (book.rating === rating) {
        onUpdateRating(book.id, undefined);
      } else {
        onUpdateRating(book.id, rating);
      }
    }
  };
  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
    onClick={handleCardClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }}
    >
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`${book.title} cover`}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              backgroundColor: '#e0e0e0',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '3rem',
          }}>
            📚
          </div>
        )}
      </div>

      <h3 style={{ 
        fontSize: '1.1rem', 
        fontWeight: 'bold', 
        marginBottom: '0.5rem',
        color: '#333',
      }}>
        {book.title}
      </h3>

      <p style={{ 
        fontSize: '0.9rem', 
        color: '#666', 
        marginBottom: '0.5rem' 
      }}>
        by{' '}
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (onFilterByAuthor) {
              onFilterByAuthor(book.author);
            }
          }}
          style={{
            color: onFilterByAuthor ? '#667eea' : '#666',
            textDecoration: onFilterByAuthor ? 'underline' : 'none',
            cursor: onFilterByAuthor ? 'pointer' : 'default',
            fontWeight: onFilterByAuthor ? '500' : 'normal',
            transition: 'color 0.2s',
          }}
          onMouseEnter={onFilterByAuthor ? (e) => {
            e.currentTarget.style.color = '#5568d3';
          } : undefined}
          onMouseLeave={onFilterByAuthor ? (e) => {
            e.currentTarget.style.color = '#667eea';
          } : undefined}
        >
          {book.author}
        </span>
      </p>

      {book.format && book.format !== 'unknown' && (
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            fontSize: '0.8rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: book.format === 'book' ? '#f5e6d3' : 
                           book.format === 'ebook' ? '#e3f2fd' : '#f3e5f5',
            color: book.format === 'book' ? '#8b4513' : 
                   book.format === 'ebook' ? '#1976d2' : '#7b1fa2',
            fontWeight: '500',
          }}>
            {book.format === 'book' ? '📖 Book' : 
             book.format === 'ebook' ? '📱 eBook' : '🎧 Audio Book'}
          </span>
        </div>
      )}

      {book.description && (
        <p style={{
          fontSize: '0.85rem',
          color: '#777',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {book.description}
        </p>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <select
          value={book.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onUpdateStatus(book.id, e.target.value as ReadingStatus)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '6px',
            border: `2px solid ${statusColors[book.status]}`,
            backgroundColor: 'white',
            color: '#333',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          cursor: onUpdateRating ? 'pointer' : 'default',
        }}>
          <label style={{ 
            fontSize: '0.85rem', 
            color: '#666', 
            marginRight: '0.5rem',
            fontWeight: '500',
          }}>
            Rating:
          </label>
          {[1, 2, 3, 4, 5].map((star) => {
            const displayRating = hoveredRating !== null ? hoveredRating : book.rating || 0;
            const isFilled = star <= displayRating;
            
            return (
              <span
                key={star}
                onClick={() => onUpdateRating && handleRatingClick(star)}
                onMouseEnter={() => onUpdateRating && setHoveredRating(star)}
                onMouseLeave={() => onUpdateRating && setHoveredRating(null)}
                style={{
                  fontSize: '1.2rem',
                  color: isFilled ? '#ffa726' : '#ddd',
                  cursor: onUpdateRating ? 'pointer' : 'default',
                  transition: 'color 0.2s, transform 0.1s',
                }}
                onMouseDown={(e) => {
                  if (onUpdateRating) {
                    e.currentTarget.style.transform = 'scale(0.9)';
                  }
                }}
                onMouseUp={(e) => {
                  if (onUpdateRating) {
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                ⭐
              </span>
            );
          })}
          {book.rating && (
            <span style={{ 
              marginLeft: '0.5rem', 
              fontSize: '0.85rem', 
              color: '#666' 
            }}>
              ({book.rating}/5)
            </span>
          )}
          {!book.rating && onUpdateRating && (
            <span style={{ 
              marginLeft: '0.5rem', 
              fontSize: '0.8rem', 
              color: '#999',
              fontStyle: 'italic',
            }}>
              Click to rate
            </span>
          )}
        </div>
      </div>

      {book.dateFinished && (
        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
          Finished: {new Date(book.dateFinished).toLocaleDateString()}
        </p>
      )}

      <details style={{ marginTop: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
        <summary style={{
          fontSize: '0.85rem',
          color: '#667eea',
          cursor: 'pointer',
          fontWeight: '500',
        }}>
          Details
        </summary>
        <div style={{ 
          marginTop: '0.5rem',
          padding: '0.75rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '0.85rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {book.format && book.format !== 'unknown' && (
              <div>
                <span style={{ fontWeight: '500', color: '#333' }}>Format: </span>
                <span style={{ color: '#666' }}>
                  {book.format === 'book' ? '📖 Physical Book' : 
                   book.format === 'ebook' ? '📱 eBook' : '🎧 Audio Book'}
                </span>
              </div>
            )}
            {book.isbn && (
              <div>
                <span style={{ fontWeight: '500', color: '#333' }}>ISBN: </span>
                <span style={{ color: '#666' }}>{book.isbn}</span>
              </div>
            )}
            {book.pageCount && (
              <div>
                <span style={{ fontWeight: '500', color: '#333' }}>Pages: </span>
                <span style={{ color: '#666' }}>{book.pageCount.toLocaleString()}</span>
              </div>
            )}
            {book.publishedDate && (
              <div>
                <span style={{ fontWeight: '500', color: '#333' }}>Published: </span>
                <span style={{ color: '#666' }}>{book.publishedDate}</span>
              </div>
            )}
            {book.genres && book.genres.length > 0 && (
              <div>
                <span style={{ fontWeight: '500', color: '#333' }}>Genres: </span>
                <span style={{ color: '#666' }}>{book.genres.join(', ')}</span>
              </div>
            )}
            {book.dateAdded && (
              <div>
                <span style={{ fontWeight: '500', color: '#333' }}>Added: </span>
                <span style={{ color: '#666' }}>
                  {new Date(book.dateAdded).toLocaleDateString()}
                </span>
              </div>
            )}
            {book.dateStarted && (
              <div>
                <span style={{ fontWeight: '500', color: '#333' }}>Started: </span>
                <span style={{ color: '#666' }}>
                  {new Date(book.dateStarted).toLocaleDateString()}
                </span>
              </div>
            )}
            {(!book.format || book.format === 'unknown') && 
             !book.isbn && 
             !book.pageCount && 
             !book.publishedDate && 
             (!book.genres || book.genres.length === 0) && 
             !book.dateAdded && 
             !book.dateStarted && (
              <div style={{ color: '#999', fontStyle: 'italic' }}>
                No additional details available
              </div>
            )}
          </div>
        </div>
      </details>

      {book.notes && (
        <details style={{ marginTop: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
          <summary style={{
            fontSize: '0.85rem',
            color: '#667eea',
            cursor: 'pointer',
            fontWeight: '500',
          }}>
            Notes
          </summary>
          <p style={{
            fontSize: '0.85rem',
            color: '#666',
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}>
            {book.notes}
          </p>
        </details>
      )}

      {onDelete && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book.id);
            }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #f44336',
              color: '#f44336',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              width: '100%',
              transition: 'background-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f44336';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#f44336';
            }}
          >
            Delete Book
          </button>
        </div>
      )}
    </div>
  );
}
