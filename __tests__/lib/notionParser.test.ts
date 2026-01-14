import { parseNotionCSV, parseNotionMarkdown } from '@/lib/notionParser';

describe('parseNotionCSV', () => {
  it('returns empty array for empty content', () => {
    expect(parseNotionCSV('')).toEqual([]);
  });

  it('returns empty array for headers only', () => {
    expect(parseNotionCSV('title,author,status')).toEqual([]);
  });

  it('parses basic CSV with title and author', () => {
    const csv = `title,author
The Great Gatsby,F. Scott Fitzgerald`;

    const result = parseNotionCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('The Great Gatsby');
    expect(result[0].author).toBe('F. Scott Fitzgerald');
  });

  it('parses CSV with status column', () => {
    const csv = `title,author,status
1984,George Orwell,Finished`;

    const result = parseNotionCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('finished');
  });

  it('maps various status values correctly', () => {
    const csv = `title,author,status
Book1,Author1,Reading
Book2,Author2,Currently Reading
Book3,Author3,Done
Book4,Author4,Abandoned`;

    const result = parseNotionCSV(csv);
    expect(result[0].status).toBe('currently-reading');
    expect(result[1].status).toBe('currently-reading');
    expect(result[2].status).toBe('finished');
    expect(result[3].status).toBe('abandoned');
  });

  it('parses format column', () => {
    const csv = `title,author,format
Book1,Author1,ebook
Book2,Author2,audiobook
Book3,Author3,paperback`;

    const result = parseNotionCSV(csv);
    expect(result[0].format).toBe('ebook');
    expect(result[1].format).toBe('audiobook');
    expect(result[2].format).toBe('book');
  });

  it('parses star emoji ratings', () => {
    const csv = `title,author,rating
Book1,Author1,⭐⭐⭐
Book2,Author2,⭐⭐⭐⭐⭐`;

    const result = parseNotionCSV(csv);
    expect(result[0].rating).toBe(3);
    expect(result[1].rating).toBe(5);
  });

  it('parses numeric ratings', () => {
    const csv = `title,author,rating
Book1,Author1,4
Book2,Author2,3.5`;

    const result = parseNotionCSV(csv);
    expect(result[0].rating).toBe(4);
    expect(result[1].rating).toBe(3.5);
  });

  it('handles quoted values with commas', () => {
    const csv = `title,author,notes
"The Long, Winding Road",Author,"Great book, highly recommended"`;

    const result = parseNotionCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('The Long, Winding Road');
    expect(result[0].notes).toBe('Great book, highly recommended');
  });

  it('skips rows without title and author', () => {
    const csv = `title,author,status
,Author1,Finished
Book2,,Finished
Book3,Author3,Finished`;

    const result = parseNotionCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Book3');
  });

  it('assigns unique IDs to each book', () => {
    const csv = `title,author
Book1,Author1
Book2,Author2`;

    const result = parseNotionCSV(csv);
    expect(result[0].id).toBeDefined();
    expect(result[1].id).toBeDefined();
    expect(result[0].id).not.toBe(result[1].id);
  });
});

describe('parseNotionMarkdown', () => {
  it('returns empty array for empty content', () => {
    expect(parseNotionMarkdown('')).toEqual([]);
  });

  it('parses basic markdown with headings', () => {
    const md = `# The Great Gatsby
Author: F. Scott Fitzgerald`;

    const result = parseNotionMarkdown(md);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('The Great Gatsby');
    expect(result[0].author).toBe('F. Scott Fitzgerald');
  });

  it('parses multiple books', () => {
    const md = `# Book One
Author: Author A

# Book Two
Author: Author B`;

    const result = parseNotionMarkdown(md);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Book One');
    expect(result[1].title).toBe('Book Two');
  });

  it('parses status field', () => {
    const md = `# Test Book
Author: Test Author
Status: Finished`;

    const result = parseNotionMarkdown(md);
    expect(result[0].status).toBe('finished');
  });

  it('parses format field', () => {
    const md = `# Test Book
Author: Test Author
Format: ebook`;

    const result = parseNotionMarkdown(md);
    expect(result[0].format).toBe('ebook');
  });

  it('parses rating field', () => {
    const md = `# Test Book
Author: Test Author
Rating: 4.5`;

    const result = parseNotionMarkdown(md);
    expect(result[0].rating).toBe(4.5);
  });

  it('defaults status to want-to-read', () => {
    const md = `# Test Book
Author: Test Author`;

    const result = parseNotionMarkdown(md);
    expect(result[0].status).toBe('want-to-read');
  });

  it('skips books without author', () => {
    const md = `# Book Without Author

# Book With Author
Author: Test Author`;

    const result = parseNotionMarkdown(md);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Book With Author');
  });
});
