'use client';

import { ReadingStatus } from '@/types/book';

export type DisplayMode = 'card' | 'list';

interface FilterBarProps {
  statusFilter: ReadingStatus | 'all';
  onFilterChange: (filter: ReadingStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bookCount: number;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  genreFilter?: string | 'all';
  onClearGenreFilter?: () => void;
  dashboardButton?: React.ReactNode;
  menuButton?: React.ReactNode;
}

const statusOptions: Array<{ value: ReadingStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Books' },
  { value: 'want-to-read', label: 'Want to Read' },
  { value: 'currently-reading', label: 'Currently Reading' },
  { value: 'finished', label: 'Finished' },
  { value: 'abandoned', label: 'Abandoned' },
];

export default function FilterBar({ statusFilter, onFilterChange, searchQuery, onSearchChange, bookCount, displayMode, onDisplayModeChange, genreFilter, onClearGenreFilter, dashboardButton, menuButton }: FilterBarProps) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '0.75rem', 
      width: '100%',
    }}>
      {/* First row: Dashboard, Search, Menu */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
      }}>
        {dashboardButton}
        <label style={{ fontWeight: '500', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
          🔍
        </label>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or author..."
            style={{
              padding: '0.5rem 1rem',
              paddingRight: searchQuery ? '2.5rem' : '1rem',
              borderRadius: '6px',
              border: '2px solid #e0e0e0',
              backgroundColor: 'white',
              fontSize: '0.9rem',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#999',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
              }}
              aria-label="Clear search"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#999';
              }}
            >
              ×
            </button>
          )}
        </div>
        {menuButton}
      </div>

      {/* Second row: Filters and controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontWeight: '500', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value as ReadingStatus | 'all')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '2px solid #e0e0e0',
              backgroundColor: 'white',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Genre Filter Badge */}
        {genreFilter && genreFilter !== 'all' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.8rem',
            backgroundColor: '#667eea15',
            borderRadius: '6px',
            fontSize: '0.9rem',
          }}>
            <span style={{ color: '#667eea', fontWeight: '500' }}>
              📚 <strong>{genreFilter}</strong>
            </span>
            {onClearGenreFilter && (
              <button
                onClick={onClearGenreFilter}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '0',
                  lineHeight: '1',
                  fontWeight: 'bold',
                }}
                title="Clear genre filter"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Book count and view toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            fontSize: '0.9rem',
            color: '#666',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}>
            {bookCount} {bookCount === 1 ? 'book' : 'books'}
          </span>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => onDisplayModeChange('card')}
              style={{
                padding: '0.4rem 0.6rem',
                backgroundColor: displayMode === 'card' ? '#667eea' : '#f0f0f0',
                color: displayMode === 'card' ? 'white' : '#666',
                border: 'none',
                borderRadius: '4px 0 0 4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              title="Card view"
            >
              ▦
            </button>
            <button
              onClick={() => onDisplayModeChange('list')}
              style={{
                padding: '0.4rem 0.6rem',
                backgroundColor: displayMode === 'list' ? '#667eea' : '#f0f0f0',
                color: displayMode === 'list' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
