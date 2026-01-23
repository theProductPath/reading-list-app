'use client';

import { useState, useRef, useEffect } from 'react';
import ImportSection from './ImportSection';

interface MenuProps {
  onImport: (files: File[]) => void;
  loading: boolean;
  onRemoveDuplicates: () => void;
  onAddBook?: () => void;
}

export default function Menu({ onImport, loading, onRemoveDuplicates, onAddBook }: MenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleImportClick = () => {
    setShowMenu(false);
    setShowImportModal(true);
  };

  const handleImportComplete = (files: File[]) => {
    onImport(files);
    setShowImportModal(false);
  };

  return (
    <>
      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            backgroundColor: '#667eea',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
          }}
          aria-label="Menu"
        >
          ⋮
        </button>

        {showMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '200px',
            zIndex: 1000,
            overflow: 'hidden',
          }}>
            {onAddBook && (
              <>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onAddBook();
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>➕</span>
                  <span>Add Book</span>
                </button>
                <div style={{
                  height: '1px',
                  backgroundColor: '#e0e0e0',
                  margin: '0.25rem 0',
                }} />
              </>
            )}
            <button
              onClick={handleImportClick}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>📥</span>
              <span>Import from Notion</span>
            </button>
            <div style={{
              height: '1px',
              backgroundColor: '#e0e0e0',
              margin: '0.25rem 0',
            }} />
            <button
              onClick={() => {
                setShowMenu(false);
                onRemoveDuplicates();
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>🔍</span>
              <span>Remove Duplicates</span>
            </button>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem',
          }}
          onClick={() => setShowImportModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                Import from Notion
              </h2>
              <button
                onClick={() => setShowImportModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0.25rem 0.5rem',
                  lineHeight: 1,
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <ImportSection 
              onImport={handleImportComplete} 
              loading={loading}
            />
          </div>
        </div>
      )}
    </>
  );
}
