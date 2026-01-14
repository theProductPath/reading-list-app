'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, ReadingStatus } from '@/types/book';
import { getBookById, updateBook } from '@/lib/storage';

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

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  useEffect(() => {
    const foundBook = getBookById(params.id);
    setBook(foundBook || null);
    setLoading(false);
  }, [params.id]);

  const handleStatusChange = (status: ReadingStatus) => {
    if (!book) return;
    const updates: Partial<Book> = { status };
    if (status === 'currently-reading' && !book.dateStarted) {
      updates.dateStarted = new Date().toISOString();
    }
    if (status === 'finished' && !book.dateFinished) {
      updates.dateFinished = new Date().toISOString();
    }
    updateBook(book.id, updates);
    setBook({ ...book, ...updates });
  };

  const handleRatingClick = (rating: number) => {
    if (!book) return;
    const newRating = book.rating === rating ? undefined : rating;
    updateBook(book.id, { rating: newRating });
    setBook({ ...book, rating: newRating });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Book not found</h1>
        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Back to Reading List
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#666',
          }}
        >
          ← Back to Reading List
        </button>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '2rem',
            padding: '2rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: '0 0 auto' }}>
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={`${book.title} cover`}
                  style={{
                    width: '200px',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                />
              ) : (
                <div style={{
                  width: '200px',
                  height: '300px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                }}>
                  📚
                </div>
              )}
            </div>

            <div style={{ flex: '1 1 400px' }}>
              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '0.5rem',
              }}>
                {book.title}
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: '#666',
                marginBottom: '1rem',
              }}>
                by {book.author}
              </p>

              {book.format && book.format !== 'unknown' && (
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.85rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  backgroundColor: book.format === 'book' ? '#f5e6d3' :
                                 book.format === 'ebook' ? '#e3f2fd' : '#f3e5f5',
                  color: book.format === 'book' ? '#8b4513' :
                         book.format === 'ebook' ? '#1976d2' : '#7b1fa2',
                  fontWeight: '500',
                  marginBottom: '1rem',
                }}>
                  {book.format === 'book' ? '📖 Physical Book' :
                   book.format === 'ebook' ? '📱 eBook' : '🎧 Audiobook'}
                </span>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#666',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}>
                  Status
                </label>
                <select
                  value={book.status}
                  onChange={(e) => handleStatusChange(e.target.value as ReadingStatus)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: `2px solid ${statusColors[book.status]}`,
                    backgroundColor: 'white',
                    color: '#333',
                    fontSize: '0.95rem',
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

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#666',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}>
                  Your Rating
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const displayRating = hoveredRating !== null ? hoveredRating : book.rating || 0;
                    const isFilled = star <= displayRating;

                    return (
                      <span
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(null)}
                        style={{
                          fontSize: '1.5rem',
                          color: isFilled ? '#ffa726' : '#ddd',
                          cursor: 'pointer',
                          transition: 'transform 0.1s',
                        }}
                      >
                        ⭐
                      </span>
                    );
                  })}
                  {book.rating && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                      ({book.rating}/5)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {book.description && (
            <div style={{
              padding: '0 2rem 2rem 2rem',
              borderTop: '1px solid #eee',
              marginTop: '0',
              paddingTop: '1.5rem',
            }}>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '0.75rem',
              }}>
                Description
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: '#555',
                lineHeight: '1.7',
              }}>
                {book.description}
              </p>
            </div>
          )}

          <div style={{
            padding: '0 2rem 2rem 2rem',
            borderTop: '1px solid #eee',
            paddingTop: '1.5rem',
          }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '1rem',
            }}>
              Book Details
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              {book.isbn && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.25rem' }}>ISBN</div>
                  <div style={{ fontSize: '0.95rem', color: '#333' }}>{book.isbn}</div>
                </div>
              )}
              {book.pageCount && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.25rem' }}>Pages</div>
                  <div style={{ fontSize: '0.95rem', color: '#333' }}>{book.pageCount.toLocaleString()}</div>
                </div>
              )}
              {book.publishedDate && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.25rem' }}>Published</div>
                  <div style={{ fontSize: '0.95rem', color: '#333' }}>{book.publishedDate}</div>
                </div>
              )}
              {book.dateAdded && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.25rem' }}>Added to List</div>
                  <div style={{ fontSize: '0.95rem', color: '#333' }}>
                    {new Date(book.dateAdded).toLocaleDateString()}
                  </div>
                </div>
              )}
              {book.dateStarted && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.25rem' }}>Started Reading</div>
                  <div style={{ fontSize: '0.95rem', color: '#333' }}>
                    {new Date(book.dateStarted).toLocaleDateString()}
                  </div>
                </div>
              )}
              {book.dateFinished && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.25rem' }}>Finished Reading</div>
                  <div style={{ fontSize: '0.95rem', color: '#333' }}>
                    {new Date(book.dateFinished).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {book.genres && book.genres.length > 0 && (
            <div style={{
              padding: '0 2rem 2rem 2rem',
              borderTop: '1px solid #eee',
              paddingTop: '1.5rem',
            }}>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '0.75rem',
              }}>
                Genres
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {book.genres.map((genre, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.35rem 0.75rem',
                      backgroundColor: '#667eea15',
                      color: '#667eea',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {book.notes && (
            <div style={{
              padding: '0 2rem 2rem 2rem',
              borderTop: '1px solid #eee',
              paddingTop: '1.5rem',
            }}>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '0.75rem',
              }}>
                Your Notes
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: '#555',
                lineHeight: '1.7',
                backgroundColor: '#fafafa',
                padding: '1rem',
                borderRadius: '8px',
                whiteSpace: 'pre-wrap',
              }}>
                {book.notes}
              </p>
            </div>
          )}

          {book.reviewUrl && (
            <div style={{
              padding: '0 2rem 2rem 2rem',
              borderTop: '1px solid #eee',
              paddingTop: '1.5rem',
            }}>
              <a
                href={book.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                View External Review →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
