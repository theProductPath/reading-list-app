'use client';

import { ReadingStatus } from '@/types/book';

interface FilterBarProps {
  statusFilter: ReadingStatus | 'all';
  onFilterChange: (filter: ReadingStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bookCount: number;
}

const statusOptions: Array<{ value: ReadingStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Books' },
  { value: 'want-to-read', label: 'Want to Read' },
  { value: 'currently-reading', label: 'Currently Reading' },
  { value: 'finished', label: 'Finished' },
  { value: 'abandoned', label: 'Abandoned' },
];

export default function FilterBar({ statusFilter, onFilterChange, searchQuery, onSearchChange, bookCount }: FilterBarProps) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      flexWrap: 'wrap',
      width: '100%',
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center',
        flexWrap: 'wrap',
        flex: 1,
      }}>
        {/* Search Input */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          alignItems: 'center',
          flex: '1 1 300px',
          minWidth: '200px',
          position: 'relative',
        }}>
          <label style={{ fontWeight: '500', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
            🔍 Search:
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
        </div>

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
      </div>

      <span style={{ 
        fontSize: '0.9rem', 
        color: '#666',
        fontWeight: '500',
        whiteSpace: 'nowrap',
      }}>
        {bookCount} {bookCount === 1 ? 'book' : 'books'}
      </span>
    </div>
  );
}
