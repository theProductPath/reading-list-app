'use client';

import { useState, useEffect } from 'react';
import { Book, ReadingStatus, BookFormat } from '@/types/book';
import { getBooks, saveBooks, addBook, updateBook } from '@/lib/storage';
import { parseNotionCSV, parseNotionMarkdown } from '@/lib/notionParser';
import { getBookMetadata } from '@/lib/bookApi';
import { removeDuplicates, countDuplicates } from '@/lib/deduplication';
import BookList from '@/components/BookList';
import AddBookForm from '@/components/AddBookForm';
import FilterBar, { DisplayMode } from '@/components/FilterBar';
import Menu from '@/components/Menu';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | 'all'>('all');
  const [formatFilter, setFormatFilter] = useState<BookFormat | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState<'list' | 'dashboard'>('list');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('card');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedBooks = getBooks();
    setBooks(storedBooks);
    setFilteredBooks(storedBooks);
  }, []);

  useEffect(() => {
    let filtered = books;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Apply format filter
    if (formatFilter !== 'all') {
      filtered = filtered.filter(b => b.format === formatFilter || (!b.format && formatFilter === 'unknown'));
    }

    // Apply rating filter
    if (ratingFilter !== 'all') {
      if (ratingFilter === 0) {
        // Filter for unrated books
        filtered = filtered.filter(b => !b.rating);
      } else if (ratingFilter === -1) {
        // Filter for any rated books (all books with a rating)
        filtered = filtered.filter(b => !!b.rating);
      } else {
        // Filter for specific rating
        filtered = filtered.filter(b => b.rating === ratingFilter);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  }, [statusFilter, formatFilter, ratingFilter, searchQuery, books]);

  const handleImport = async (files: File[]) => {
    setLoading(true);
    const newBooks: Book[] = [];

    for (const file of files) {
      const text = await file.text();
      
      if (file.name.endsWith('.csv')) {
        const parsed = parseNotionCSV(text);
        newBooks.push(...parsed);
      } else if (file.name.endsWith('.md')) {
        const parsed = parseNotionMarkdown(text);
        newBooks.push(...parsed);
      }
    }

    // Fetch metadata for imported books
    for (const book of newBooks) {
      if (!book.coverUrl && (book.title || book.isbn)) {
        try {
          const metadata = await getBookMetadata(book.title, book.author);
          if (metadata) {
            book.coverUrl = metadata.coverUrl;
            book.description = metadata.description;
            book.pageCount = metadata.pageCount;
            book.publishedDate = metadata.publishedDate;
            book.genres = metadata.genres;
            if (!book.isbn && metadata.isbn) {
              book.isbn = metadata.isbn;
            }
          }
        } catch (error) {
          console.error('Error fetching metadata for', book.title, error);
        }
      }
    }

    // Combine existing books with new imports
    const combinedBooks = [...books, ...newBooks];
    
    // Remove duplicates, keeping the first occurrence and merging data
    const deduplicatedBooks = removeDuplicates(combinedBooks);
    const duplicateCount = combinedBooks.length - deduplicatedBooks.length;
    
    if (duplicateCount > 0) {
      alert(`Import complete! ${duplicateCount} duplicate book${duplicateCount > 1 ? 's were' : ' was'} removed.`);
    }
    
    setBooks(deduplicatedBooks);
    saveBooks(deduplicatedBooks);
    setLoading(false);
  };

  const handleAddBook = async (bookData: Partial<Book>) => {
    setLoading(true);
    
    // Fetch metadata
    const metadata = await getBookMetadata(bookData.title || '', bookData.author);
    
    const newBook: Book = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: bookData.title || '',
      author: bookData.author || '',
      status: bookData.status || 'want-to-read',
      dateAdded: new Date().toISOString(),
      ...metadata,
      ...bookData,
    };

    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    setShowAddForm(false);
    setLoading(false);
  };

  const handleUpdateStatus = (id: string, status: ReadingStatus) => {
    const updates: Partial<Book> = { status };
    
    if (status === 'currently-reading' && !books.find(b => b.id === id)?.dateStarted) {
      updates.dateStarted = new Date().toISOString();
    }
    
    if (status === 'finished' && !books.find(b => b.id === id)?.dateFinished) {
      updates.dateFinished = new Date().toISOString();
    }

    updateBook(id, updates);
    const updatedBooks = books.map(b => 
      b.id === id ? { ...b, ...updates } : b
    );
    setBooks(updatedBooks);
    // Don't set filteredBooks here - let the useEffect handle filtering
  };

  const handleUpdateRating = (id: string, rating: number | undefined) => {
    const updates: Partial<Book> = { rating };
    updateBook(id, updates);
    const updatedBooks = books.map(b => 
      b.id === id ? { ...b, ...updates } : b
    );
    setBooks(updatedBooks);
  };

  const handleRemoveDuplicates = () => {
    const duplicateCount = countDuplicates(books);
    
    if (duplicateCount === 0) {
      alert('No duplicates found in your reading list!');
      return;
    }

    if (confirm(`Found ${duplicateCount} duplicate book${duplicateCount > 1 ? 's' : ''}. Remove them?`)) {
      const deduplicatedBooks = removeDuplicates(books);
      setBooks(deduplicatedBooks);
      saveBooks(deduplicatedBooks);
      alert(`Removed ${duplicateCount} duplicate book${duplicateCount > 1 ? 's' : ''}!`);
    }
  };

  return (
    <main>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '2rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {view === 'list' ? (
            <FilterBar
              statusFilter={statusFilter}
              onFilterChange={setStatusFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              bookCount={filteredBooks.length}
              displayMode={displayMode}
              onDisplayModeChange={setDisplayMode}
            />
          ) : (
            <div style={{ flex: 1 }} />
          )}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {view === 'list' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                }}
              >
                {showAddForm ? 'Cancel' : '+ Add Book'}
              </button>
            )}
            <button
              onClick={() => {
                setView(view === 'list' ? 'dashboard' : 'list');
                setShowAddForm(false);
              }}
              style={{
                backgroundColor: view === 'dashboard' ? '#4caf50' : '#667eea',
                color: 'white',
                padding: '0.75rem 1.5rem',
              }}
            >
              {view === 'list' ? '📊 Dashboard' : '📚 Book List'}
            </button>
            <Menu 
              onImport={handleImport} 
              loading={loading}
              onRemoveDuplicates={handleRemoveDuplicates}
            />
          </div>
        </div>

        {view === 'list' ? (
          <>
            {showAddForm && (
              <div style={{ marginBottom: '2rem' }}>
                <AddBookForm onSubmit={handleAddBook} onCancel={() => setShowAddForm(false)} />
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                Loading book metadata...
              </div>
            )}

            <BookList
              books={filteredBooks}
              onUpdateStatus={handleUpdateStatus}
              onUpdateRating={handleUpdateRating}
              onFilterByAuthor={(author) => {
                setSearchQuery(author);
                setStatusFilter('all');
                setFormatFilter('all');
                setRatingFilter('all');
              }}
              displayMode={displayMode}
            />
          </>
        ) : (
          <Dashboard 
            books={books}
            onFilterByStatus={(status) => {
              setStatusFilter(status);
              setFormatFilter('all'); // Clear format filter when filtering by status
              setRatingFilter('all'); // Clear rating filter
              setSearchQuery(''); // Clear search
              setView('list');
            }}
            onFilterByFormat={(format) => {
              setFormatFilter(format);
              setStatusFilter('all'); // Clear status filter when filtering by format
              setRatingFilter('all'); // Clear rating filter
              setSearchQuery(''); // Clear search
              setView('list');
            }}
            onFilterByRating={(rating) => {
              setRatingFilter(rating);
              setStatusFilter('all'); // Clear status filter when filtering by rating
              setFormatFilter('all'); // Clear format filter
              setSearchQuery(''); // Clear search
              setView('list');
            }}
            onFilterByAuthor={(author) => {
              setSearchQuery(author); // Use search to filter by author
              setStatusFilter('all');
              setFormatFilter('all');
              setRatingFilter('all');
              setView('list');
            }}
            onSwitchToList={() => setView('list')}
          />
        )}
      </div>
    </main>
  );
}
