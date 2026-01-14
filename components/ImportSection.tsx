'use client';

import { useRef } from 'react';

interface ImportSectionProps {
  onImport: (files: File[]) => void;
  loading: boolean;
}

export default function ImportSection({ onImport, loading }: ImportSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      file => file.name.endsWith('.csv') || file.name.endsWith('.md')
    );
    
    if (validFiles.length > 0) {
      onImport(validFiles);
    } else {
      alert('Please select CSV or Markdown files exported from Notion');
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <p style={{ 
        marginBottom: '1rem', 
        fontSize: '0.9rem', 
        color: '#666' 
      }}>
        Upload your Notion export files (CSV or Markdown) to import your reading list
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.md"
        multiple
        onChange={handleFileSelect}
        disabled={loading}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        style={{
          backgroundColor: '#667eea',
          color: 'white',
          padding: '0.75rem 1.5rem',
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        {loading ? 'Importing...' : 'Choose Files'}
      </button>
    </div>
  );
}
