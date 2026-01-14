'use client';

export default function Header() {
  const handleClick = () => {
    // Force full page navigation to reset all filters and state
    window.location.href = '/';
  };

  return (
    <header style={{
      textAlign: 'center',
      marginBottom: '2rem',
      color: 'white',
    }}>
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'inline-block',
          transition: 'transform 0.2s, opacity 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.opacity = '1';
        }}
      >
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '0.25rem',
          fontWeight: 'bold',
        }}>
          📚 My Reading List
        </h1>
      </a>
      <p style={{ fontSize: '1rem', opacity: 0.8 }}>
        Manage your books, track your progress, and discover new reads
      </p>
    </header>
  );
}
