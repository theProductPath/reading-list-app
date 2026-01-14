'use client';

import { useState } from 'react';
import { Book, ReadingStatus, BookFormat } from '@/types/book';

interface AddBookFormProps {
  onSubmit: (book: Partial<Book>) => void;
  onCancel: () => void;
}

export default function AddBookForm({ onSubmit, onCancel }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('want-to-read');
  const [format, setFormat] = useState<BookFormat>('book');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !author.trim()) {
      alert('Please fill in at least the title and author');
      return;
    }

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim() || undefined,
      status,
      format,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setAuthor('');
    setIsbn('');
    setStatus('want-to-read');
    setFormat('book');
    setNotes('');
  };

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1.5rem',
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: 'bold' }}>
        Add New Book
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Author *
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            ISBN (optional)
          </label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Enter ISBN"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as BookFormat)}
            style={{ width: '100%' }}
          >
            <option value="book">📖 Physical Book</option>
            <option value="ebook">📱 eBook</option>
            <option value="audiobook">🎧 Audio Book</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ReadingStatus)}
            style={{ width: '100%' }}
          >
            <option value="want-to-read">Want to Read</option>
            <option value="currently-reading">Currently Reading</option>
            <option value="finished">Finished</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this book"
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              flex: 1,
            }}
          >
            Add Book
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: '#e0e0e0',
              color: '#333',
              flex: 1,
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
