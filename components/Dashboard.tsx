'use client';

import { Book, ReadingStatus, BookFormat } from '@/types/book';
import { ReadingStats, calculateReadingStats } from '@/lib/analytics';

interface DashboardProps {
  books: Book[];
  onFilterByStatus?: (status: ReadingStatus | 'all') => void;
  onFilterByFormat?: (format: BookFormat) => void;
  onFilterByAuthor?: (author: string) => void;
  onFilterByRating?: (rating: number | 'all') => void; // -1 = all rated, 0 = unrated, 1-5 = specific rating, 'all' = no filter
  onSwitchToList?: () => void;
}

export default function Dashboard({ books, onFilterByStatus, onFilterByFormat, onFilterByAuthor, onFilterByRating, onSwitchToList }: DashboardProps) {
  const stats = calculateReadingStats(books);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    onClick,
    clickable = false 
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string;
    onClick?: () => void;
    clickable?: boolean;
  }) => (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: clickable ? 'pointer' : 'default',
        transition: clickable ? 'all 0.2s' : 'none',
      }}
      onMouseEnter={clickable ? (e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.backgroundColor = '#f0f0f0';
      } : undefined}
      onMouseLeave={clickable ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.backgroundColor = '#f9f9f9';
      } : undefined}
    >
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
        {title}
        {clickable && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#999' }}>→</span>}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.25rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  const maxTimelineCount = Math.max(...stats.readingTimeline.map(t => t.count), 1);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333' }}>
        📊 Reading Dashboard
      </h2>

      {/* Overview Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <StatCard 
          title="Total Books" 
          value={stats.totalBooks}
          clickable={!!onSwitchToList}
          onClick={() => {
            if (onFilterByStatus) onFilterByStatus('all');
            if (onSwitchToList) onSwitchToList();
          }}
        />
        <StatCard 
          title="Finished" 
          value={stats.finishedBooks}
          subtitle={`${stats.totalBooks > 0 ? Math.round((stats.finishedBooks / stats.totalBooks) * 100) : 0}% of collection`}
          clickable={stats.finishedBooks > 0 && !!onFilterByStatus}
          onClick={() => {
            if (stats.finishedBooks > 0 && onFilterByStatus) {
              onFilterByStatus('finished');
              if (onSwitchToList) onSwitchToList();
            }
          }}
        />
        <StatCard 
          title="Currently Reading" 
          value={stats.currentlyReading}
          clickable={stats.currentlyReading > 0 && !!onFilterByStatus}
          onClick={() => {
            if (stats.currentlyReading > 0 && onFilterByStatus) {
              onFilterByStatus('currently-reading');
              if (onSwitchToList) onSwitchToList();
            }
          }}
        />
        <StatCard 
          title="Want to Read" 
          value={stats.wantToRead}
          clickable={stats.wantToRead > 0 && !!onFilterByStatus}
          onClick={() => {
            if (stats.wantToRead > 0 && onFilterByStatus) {
              onFilterByStatus('want-to-read');
              if (onSwitchToList) onSwitchToList();
            }
          }}
        />
        {stats.averageRating > 0 && (
          <StatCard 
            title="Average Rating" 
            value={stats.averageRating.toFixed(1)}
            subtitle={`from ${stats.totalRatings} rated books`}
          />
        )}
        {stats.totalPages > 0 && (
          <StatCard 
            title="Total Pages" 
            value={stats.totalPages.toLocaleString()}
            subtitle={`avg ${Math.round(stats.averagePages)} pages/book`}
          />
        )}
        <StatCard 
          title="Finished This Year" 
          value={stats.booksFinishedThisYear}
          clickable={stats.booksFinishedThisYear > 0 && !!onFilterByStatus}
          onClick={() => {
            if (stats.booksFinishedThisYear > 0 && onFilterByStatus) {
              onFilterByStatus('finished');
              if (onSwitchToList) onSwitchToList();
            }
          }}
        />
        <StatCard 
          title="Finished This Month" 
          value={stats.booksFinishedThisMonth}
          clickable={stats.booksFinishedThisMonth > 0 && !!onFilterByStatus}
          onClick={() => {
            if (stats.booksFinishedThisMonth > 0 && onFilterByStatus) {
              onFilterByStatus('finished');
              if (onSwitchToList) onSwitchToList();
            }
          }}
        />
      </div>

      {/* Status Breakdown */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
          Reading Status Breakdown
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {Object.entries(stats.booksByStatus).map(([status, count]) => {
            const percentage = stats.totalBooks > 0 ? (count / stats.totalBooks) * 100 : 0;
            const statusLabels: Record<string, string> = {
              'want-to-read': 'Want to Read',
              'currently-reading': 'Currently Reading',
              'finished': 'Finished',
              'abandoned': 'Abandoned',
            };
            const statusColors: Record<string, string> = {
              'want-to-read': '#9e9e9e',
              'currently-reading': '#2196f3',
              'finished': '#4caf50',
              'abandoned': '#f44336',
            };
            
            return (
              <div 
                key={status} 
                style={{ 
                  flex: 1, 
                  minWidth: '150px',
                  cursor: count > 0 && onFilterByStatus ? 'pointer' : 'default',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={count > 0 && onFilterByStatus ? (e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                } : undefined}
                onMouseLeave={count > 0 && onFilterByStatus ? (e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                } : undefined}
                onClick={() => {
                  if (count > 0 && onFilterByStatus) {
                    onFilterByStatus(status as ReadingStatus);
                    if (onSwitchToList) onSwitchToList();
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>{statusLabels[status]}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>
                    {count}
                    {count > 0 && onFilterByStatus && (
                      <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: '#999' }}>→</span>
                    )}
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: statusColors[status],
                    transition: 'width 0.3s',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating Distribution */}
      {stats.totalRatings > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Rating Distribution
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', marginBottom: '1rem' }}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.booksByRating[rating] || 0;
              const maxCount = Math.max(...Object.values(stats.booksByRating), 1);
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const ratingColors: Record<number, string> = {
                5: '#4caf50',
                4: '#8bc34a',
                3: '#ffa726',
                2: '#ff9800',
                1: '#f44336',
              };
              
              return (
                <div 
                  key={rating} 
                  onClick={() => {
                    if (count > 0 && onFilterByRating) {
                      onFilterByRating(rating);
                      if (onSwitchToList) onSwitchToList();
                    }
                  }}
                  style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    position: 'relative',
                    cursor: count > 0 && onFilterByRating ? 'pointer' : 'default',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s, transform 0.1s',
                  }}
                  onMouseEnter={count > 0 && onFilterByRating ? (e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  } : undefined}
                  onMouseLeave={count > 0 && onFilterByRating ? (e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  } : undefined}
                >
                  {count > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: `calc(${100 - height}% - 25px)`,
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: ratingColors[rating],
                      zIndex: 1,
                    }}>
                      {count}
                      {onFilterByRating && (
                        <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: '#999' }}>→</span>
                      )}
                    </div>
                  )}
                  <div style={{
                    width: '100%',
                    backgroundColor: ratingColors[rating],
                    height: `${height}%`,
                    minHeight: count > 0 ? '4px' : '0',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '0.5rem',
                    transition: 'height 0.3s, opacity 0.2s',
                    opacity: count > 0 ? 1 : 0.3,
                  }} />
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}>
                    <div style={{
                      fontSize: '1.2rem',
                      color: ratingColors[rating],
                    }}>
                      {'⭐'.repeat(rating)}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      color: '#333',
                    }}>
                      {rating}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#999',
                    }}>
                      {count} {count === 1 ? 'book' : 'books'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e0e0e0',
            fontSize: '0.9rem',
            color: '#666',
          }}>
            <div
              onClick={() => {
                if (stats.totalRatings > 0 && onFilterByRating) {
                  // Filter to show all rated books (any rating)
                  onFilterByRating(-1);
                  if (onSwitchToList) onSwitchToList();
                }
              }}
              style={{
                cursor: stats.totalRatings > 0 && onFilterByRating ? 'pointer' : 'default',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={stats.totalRatings > 0 && onFilterByRating ? (e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              } : undefined}
              onMouseLeave={stats.totalRatings > 0 && onFilterByRating ? (e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              } : undefined}
            >
              <span style={{ fontWeight: '500' }}>Total Rated: </span>
              <span>{stats.totalRatings}</span>
              {stats.totalRatings > 0 && onFilterByRating && (
                <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: '#999' }}>→</span>
              )}
            </div>
            <div>
              <span style={{ fontWeight: '500' }}>Average: </span>
              <span>{stats.averageRating.toFixed(1)}/5</span>
            </div>
            <div
              onClick={() => {
                const unratedCount = stats.totalBooks - stats.totalRatings;
                if (unratedCount > 0 && onFilterByRating) {
                  // Filter to show unrated books (rating = 0)
                  onFilterByRating(0);
                  if (onSwitchToList) onSwitchToList();
                }
              }}
              style={{
                cursor: (stats.totalBooks - stats.totalRatings) > 0 && onFilterByRating ? 'pointer' : 'default',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(stats.totalBooks - stats.totalRatings) > 0 && onFilterByRating ? (e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              } : undefined}
              onMouseLeave={(stats.totalBooks - stats.totalRatings) > 0 && onFilterByRating ? (e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              } : undefined}
            >
              <span style={{ fontWeight: '500' }}>Unrated: </span>
              <span>{stats.totalBooks - stats.totalRatings}</span>
              {(stats.totalBooks - stats.totalRatings) > 0 && onFilterByRating && (
                <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: '#999' }}>→</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Format Breakdown */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
          Books by Format
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {Object.entries(stats.booksByFormat)
            .filter(([format, count]) => format !== 'unknown' || count > 0)
            .map(([format, count]) => {
            const percentage = stats.totalBooks > 0 ? (count / stats.totalBooks) * 100 : 0;
            const formatLabels: Record<string, string> = {
              'book': '📖 Physical Book',
              'ebook': '📱 eBook',
              'audiobook': '🎧 Audio Book',
              'unknown': '❓ Unknown',
            };
            const formatColors: Record<string, string> = {
              'book': '#8b4513',
              'ebook': '#2196f3',
              'audiobook': '#9c27b0',
              'unknown': '#9e9e9e',
            };
            
            return (
              <div 
                key={format} 
                style={{ 
                  flex: 1, 
                  minWidth: '150px',
                  cursor: count > 0 && onFilterByFormat ? 'pointer' : 'default',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={count > 0 && onFilterByFormat ? (e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                } : undefined}
                onMouseLeave={count > 0 && onFilterByFormat ? (e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                } : undefined}
                onClick={() => {
                  if (count > 0 && onFilterByFormat) {
                    onFilterByFormat(format as BookFormat);
                    if (onSwitchToList) onSwitchToList();
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>{formatLabels[format]}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>
                    {count}
                    {count > 0 && onFilterByFormat && (
                      <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: '#999' }}>→</span>
                    )}
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: formatColors[format],
                    transition: 'width 0.3s',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reading Timeline */}
      {stats.readingTimeline.some(t => t.count > 0) && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Reading Timeline (Last 12 Months)
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '200px', position: 'relative' }}>
            {stats.readingTimeline.map((item, index) => {
              const height = (item.count / maxTimelineCount) * 100;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '100%',
                  }}>
                    {item.count > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: `calc(${100 - height}% - 20px)`,
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#667eea',
                        zIndex: 1,
                      }}>
                        {item.count}
                      </div>
                    )}
                    <div style={{
                      width: '100%',
                      backgroundColor: '#667eea',
                      height: `${height}%`,
                      minHeight: item.count > 0 ? '4px' : '0',
                      borderRadius: '4px 4px 0 0',
                      marginBottom: '0.5rem',
                      transition: 'height 0.3s',
                    }} />
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#666',
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      {item.month}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Authors */}
      {stats.topAuthors.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Top Authors
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.topAuthors.map((author, index) => (
              <div 
                key={author.author} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  cursor: onFilterByAuthor ? 'pointer' : 'default',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={onFilterByAuthor ? (e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                } : undefined}
                onMouseLeave={onFilterByAuthor ? (e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                } : undefined}
                onClick={() => {
                  if (onFilterByAuthor) {
                    onFilterByAuthor(author.author);
                    if (onSwitchToList) onSwitchToList();
                  }
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#667eea',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#333' }}>
                    {author.author}
                    {onFilterByAuthor && (
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#999' }}>→</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {author.count} {author.count === 1 ? 'book' : 'books'}
                  </div>
                </div>
                <div style={{
                  flex: '0 0 100px',
                  height: '8px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(author.count / stats.topAuthors[0].count) * 100}%`,
                    backgroundColor: '#667eea',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Genres */}
      {stats.topGenres.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Top Genres
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {stats.topGenres.map((genre) => (
              <div key={genre.genre} style={{
                backgroundColor: '#f0f4ff',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: '#667eea',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span>{genre.genre}</span>
                <span style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}>
                  {genre.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Finishes */}
      {stats.recentFinishes.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Recent Finishes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.recentFinishes.map((book) => (
              <div key={book.id} style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
              }}>
                {book.coverUrl && (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{
                      width: '60px',
                      height: '90px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#333' }}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    by {book.author}
                  </div>
                  {book.dateFinished && (
                    <div style={{ fontSize: '0.85rem', color: '#999' }}>
                      Finished: {new Date(book.dateFinished).toLocaleDateString()}
                    </div>
                  )}
                  {book.rating && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ color: '#ffa726' }}>⭐</span>
                      <span style={{ marginLeft: '0.25rem', fontSize: '0.9rem' }}>
                        {book.rating}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalBooks === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: '#666',
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            No books in your reading list yet.
          </p>
          <p>Add some books to see your reading statistics!</p>
        </div>
      )}
    </div>
  );
}
