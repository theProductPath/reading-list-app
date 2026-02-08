'use client';

import { Book, ReadingStatus, BookFormat } from '@/types/book';
import { ReadingStats, calculateReadingStats } from '@/lib/analytics';

interface DashboardProps {
  books: Book[];
  onFilterByStatus?: (status: ReadingStatus | 'all') => void;
  onFilterByFormat?: (format: BookFormat) => void;
  onFilterByAuthor?: (author: string) => void;
  onFilterByRating?: (rating: number | 'all') => void; // -1 = all rated, 0 = unrated, 1-5 = specific rating, 'all' = no filter
  onFilterByGenre?: (genre: string) => void;
  onFilterByYear?: (year: number) => void;
  onSwitchToList?: () => void;
}

export default function Dashboard({ books, onFilterByStatus, onFilterByFormat, onFilterByAuthor, onFilterByRating, onFilterByGenre, onFilterByYear, onSwitchToList }: DashboardProps) {
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
    <div style={{ padding: '0 2rem 2rem 2rem' }}>
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

      {/* Charts Container - Status & Rating Distribution */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {/* Status Breakdown */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          flex: '1 1 300px',
          minWidth: '300px',
        }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
          Reading Status Breakdown
        </h3>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Pie Chart */}
          <div style={{ flex: '0 0 200px', display: 'flex', justifyContent: 'center' }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ maxWidth: '100%' }}>
              {(() => {
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
                
                let currentAngle = 0;
                const cx = 100, cy = 100, radius = 80;
                
                return Object.entries(stats.booksByStatus).map(([status, count]) => {
                  const percentage = stats.totalBooks > 0 ? (count / stats.totalBooks) * 100 : 0;
                  const sliceAngle = (percentage / 100) * 360;
                  
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + sliceAngle;
                  
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = cx + radius * Math.cos(startRad);
                  const y1 = cy + radius * Math.sin(startRad);
                  const x2 = cx + radius * Math.cos(endRad);
                  const y2 = cy + radius * Math.sin(endRad);
                  
                  const largeArc = sliceAngle > 180 ? 1 : 0;
                  
                  const pathData = [
                    `M ${cx} ${cy}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ');
                  
                  const result = (
                    <path
                      key={status}
                      d={pathData}
                      fill={statusColors[status]}
                      stroke="white"
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (count > 0 && onFilterByStatus) {
                          onFilterByStatus(status as ReadingStatus);
                          if (onSwitchToList) onSwitchToList();
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    />
                  );
                  
                  currentAngle = endAngle;
                  return result;
                });
              })()}
            </svg>
          </div>
          
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
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
                  onClick={() => {
                    if (count > 0 && onFilterByStatus) {
                      onFilterByStatus(status as ReadingStatus);
                      if (onSwitchToList) onSwitchToList();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: count > 0 && onFilterByStatus ? 'pointer' : 'default',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={count > 0 && onFilterByStatus ? (e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  } : undefined}
                  onMouseLeave={count > 0 && onFilterByStatus ? (e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  } : undefined}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    backgroundColor: statusColors[status],
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#333' }}>
                      {statusLabels[status]}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {count} {count === 1 ? 'book' : 'books'} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {stats.totalRatings > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          flex: '1 1 300px',
          minWidth: '300px',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Rating Distribution
          </h3>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Pie Chart */}
            <div style={{ flex: '0 0 200px', display: 'flex', justifyContent: 'center' }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ maxWidth: '100%' }}>
                {(() => {
                  const ratingColors: Record<number, string> = {
                    5: '#4caf50',
                    4: '#8bc34a',
                    3: '#ffa726',
                    2: '#ff9800',
                    1: '#f44336',
                  };
                  
                  let currentAngle = 0;
                  const cx = 100, cy = 100, radius = 80;
                  
                  return [5, 4, 3, 2, 1].map((rating) => {
                    const count = stats.booksByRating[rating] || 0;
                    const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
                    const sliceAngle = (percentage / 100) * 360;
                    
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + sliceAngle;
                    
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    
                    const x1 = cx + radius * Math.cos(startRad);
                    const y1 = cy + radius * Math.sin(startRad);
                    const x2 = cx + radius * Math.cos(endRad);
                    const y2 = cy + radius * Math.sin(endRad);
                    
                    const largeArc = sliceAngle > 180 ? 1 : 0;
                    
                    const pathData = [
                      `M ${cx} ${cy}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');
                    
                    const result = (
                      <path
                        key={rating}
                        d={pathData}
                        fill={ratingColors[rating]}
                        stroke="white"
                        strokeWidth="2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (count > 0 && onFilterByRating) {
                            onFilterByRating(rating);
                            if (onSwitchToList) onSwitchToList();
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                      />
                    );
                    
                    currentAngle = endAngle;
                    return result;
                  });
                })()}
              </svg>
            </div>
            
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.booksByRating[rating] || 0;
                const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: count > 0 && onFilterByRating ? 'pointer' : 'default',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={count > 0 && onFilterByRating ? (e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    } : undefined}
                    onMouseLeave={count > 0 && onFilterByRating ? (e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    } : undefined}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '3px',
                      backgroundColor: ratingColors[rating],
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#333' }}>
                        {'⭐'.repeat(rating)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {count} {count === 1 ? 'book' : 'books'} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>Average: </span>
                  <span>{stats.averageRating.toFixed(1)}/5</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ fontWeight: '500' }}>Unrated: </span>
                  <span>{stats.totalBooks - stats.totalRatings} books</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Format & Genres Row */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {/* Format Breakdown - Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          flex: '1 1 300px',
          minWidth: '300px',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Books by Format
          </h3>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Pie Chart */}
            <div style={{ flex: '0 0 160px', display: 'flex', justifyContent: 'center' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ maxWidth: '100%' }}>
                {(() => {
                  const formatColors: Record<string, string> = {
                    'book': '#8b4513',
                    'ebook': '#2196f3',
                    'audiobook': '#9c27b0',
                    'unknown': '#9e9e9e',
                  };

                  let currentAngle = 0;
                  const cx = 80, cy = 80, radius = 65;
                  const formatEntries = Object.entries(stats.booksByFormat).filter(([format, count]) => count > 0);

                  return formatEntries.map(([format, count]) => {
                    const percentage = stats.totalBooks > 0 ? (count / stats.totalBooks) * 100 : 0;
                    const sliceAngle = (percentage / 100) * 360;

                    const startAngle = currentAngle;
                    const endAngle = currentAngle + sliceAngle;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    const x1 = cx + radius * Math.cos(startRad);
                    const y1 = cy + radius * Math.sin(startRad);
                    const x2 = cx + radius * Math.cos(endRad);
                    const y2 = cy + radius * Math.sin(endRad);

                    const largeArc = sliceAngle > 180 ? 1 : 0;

                    const pathData = [
                      `M ${cx} ${cy}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');

                    const result = (
                      <path
                        key={format}
                        d={pathData}
                        fill={formatColors[format]}
                        stroke="white"
                        strokeWidth="2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (count > 0 && onFilterByFormat) {
                            onFilterByFormat(format as BookFormat);
                            if (onSwitchToList) onSwitchToList();
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                      />
                    );

                    currentAngle = endAngle;
                    return result;
                  });
                })()}
              </svg>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
              {Object.entries(stats.booksByFormat)
                .filter(([format, count]) => format !== 'unknown' || count > 0)
                .map(([format, count]) => {
                  const percentage = stats.totalBooks > 0 ? (count / stats.totalBooks) * 100 : 0;
                  const formatLabels: Record<string, string> = {
                    'book': '📖 Physical',
                    'ebook': '📱 eBook',
                    'audiobook': '🎧 Audio',
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
                      onClick={() => {
                        if (count > 0 && onFilterByFormat) {
                          onFilterByFormat(format as BookFormat);
                          if (onSwitchToList) onSwitchToList();
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: count > 0 && onFilterByFormat ? 'pointer' : 'default',
                        padding: '0.35rem',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={count > 0 && onFilterByFormat ? (e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      } : undefined}
                      onMouseLeave={count > 0 && onFilterByFormat ? (e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      } : undefined}
                    >
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: formatColors[format],
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#333' }}>
                          {formatLabels[format]}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                          {count} ({percentage.toFixed(0)}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Top Genres - Pie Chart */}
        {stats.topGenres.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            flex: '1 1 300px',
            minWidth: '300px',
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
              Top Genres
            </h3>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Pie Chart */}
              <div style={{ flex: '0 0 160px', display: 'flex', justifyContent: 'center' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ maxWidth: '100%' }}>
                  {(() => {
                    const genreColors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];

                    let currentAngle = 0;
                    const cx = 80, cy = 80, radius = 65;
                    const totalGenreBooks = stats.topGenres.reduce((sum, g) => sum + g.count, 0);

                    return stats.topGenres.slice(0, 8).map((genre, index) => {
                      const percentage = totalGenreBooks > 0 ? (genre.count / totalGenreBooks) * 100 : 0;
                      const sliceAngle = (percentage / 100) * 360;

                      const startAngle = currentAngle;
                      const endAngle = currentAngle + sliceAngle;

                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;

                      const x1 = cx + radius * Math.cos(startRad);
                      const y1 = cy + radius * Math.sin(startRad);
                      const x2 = cx + radius * Math.cos(endRad);
                      const y2 = cy + radius * Math.sin(endRad);

                      const largeArc = sliceAngle > 180 ? 1 : 0;

                      const pathData = [
                        `M ${cx} ${cy}`,
                        `L ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                        'Z'
                      ].join(' ');

                      const result = (
                        <path
                          key={genre.genre}
                          d={pathData}
                          fill={genreColors[index % genreColors.length]}
                          stroke="white"
                          strokeWidth="2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            if (onFilterByGenre) {
                              onFilterByGenre(genre.genre);
                              if (onSwitchToList) onSwitchToList();
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        />
                      );

                      currentAngle = endAngle;
                      return result;
                    });
                  })()}
                </svg>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, minWidth: '150px' }}>
                {stats.topGenres.slice(0, 8).map((genre, index) => {
                  const genreColors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];
                  const totalGenreBooks = stats.topGenres.reduce((sum, g) => sum + g.count, 0);
                  const percentage = totalGenreBooks > 0 ? (genre.count / totalGenreBooks) * 100 : 0;

                  return (
                    <div
                      key={genre.genre}
                      onClick={() => {
                        if (onFilterByGenre) {
                          onFilterByGenre(genre.genre);
                          if (onSwitchToList) onSwitchToList();
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: onFilterByGenre ? 'pointer' : 'default',
                        padding: '0.3rem',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={onFilterByGenre ? (e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      } : undefined}
                      onMouseLeave={onFilterByGenre ? (e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      } : undefined}
                    >
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: genreColors[index % genreColors.length],
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {genre.genre}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                          {genre.count} ({percentage.toFixed(0)}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
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

      {/* Books Finished by Year */}
      {stats.booksFinishedByYear.some(y => y.count > 0) && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
            Books Finished by Year
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '200px', justifyContent: 'center' }}>
            {(() => {
              const maxYearCount = Math.max(...stats.booksFinishedByYear.map(y => y.count), 1);
              return stats.booksFinishedByYear.map((item) => {
                const height = (item.count / maxYearCount) * 100;
                const isCurrentYear = item.year === new Date().getFullYear();
                return (
                  <div
                    key={item.year}
                    onClick={() => {
                      if (item.count > 0 && onFilterByYear) {
                        onFilterByYear(item.year);
                      }
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: '0 1 120px',
                      height: '100%',
                      justifyContent: 'flex-end',
                      cursor: item.count > 0 && onFilterByYear ? 'pointer' : 'default',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={item.count > 0 && onFilterByYear ? (e) => {
                      e.currentTarget.style.opacity = '0.75';
                    } : undefined}
                    onMouseLeave={item.count > 0 && onFilterByYear ? (e) => {
                      e.currentTarget.style.opacity = '1';
                    } : undefined}
                  >
                    {item.count > 0 && (
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: isCurrentYear ? '#667eea' : '#999',
                        marginBottom: '0.25rem',
                      }}>
                        {item.count}
                      </div>
                    )}
                    <div style={{
                      width: '100%',
                      maxWidth: '80px',
                      backgroundColor: isCurrentYear ? '#667eea' : '#c5cae9',
                      height: `${height}%`,
                      minHeight: item.count > 0 ? '4px' : '0',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s',
                    }} />
                    <div style={{
                      fontSize: '0.9rem',
                      color: isCurrentYear ? '#667eea' : '#666',
                      fontWeight: isCurrentYear ? '700' : '500',
                      marginTop: '0.5rem',
                    }}>
                      {item.year}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Top Authors & Recent Finishes Row */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {/* Top Authors */}
        {stats.topAuthors.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            flex: '1 1 300px',
            minWidth: '300px',
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
              Top Authors
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stats.topAuthors.slice(0, 5).map((author, index) => (
                <div
                  key={author.author}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: onFilterByAuthor ? 'pointer' : 'default',
                    padding: '0.4rem',
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
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#667eea',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '500', color: '#333', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {author.author}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                      {author.count} {author.count === 1 ? 'book' : 'books'}
                    </div>
                  </div>
                  <div style={{
                    flex: '0 0 60px',
                    height: '6px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '3px',
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

        {/* Recent Finishes */}
        {stats.recentFinishes.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            flex: '1 1 300px',
            minWidth: '300px',
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
              Recent Finishes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recentFinishes.slice(0, 4).map((book) => (
                <div key={book.id} style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                }}>
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      style={{
                        width: '40px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '40px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}>
                      📖
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {book.author}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                      {book.rating && (
                        <span style={{ fontSize: '0.75rem', color: '#ffa726' }}>
                          {'⭐'.repeat(book.rating)}
                        </span>
                      )}
                      {book.dateFinished && (
                        <span style={{ fontSize: '0.7rem', color: '#999' }}>
                          {new Date(book.dateFinished).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
