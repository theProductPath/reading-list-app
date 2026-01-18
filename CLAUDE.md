# CLAUDE.md

## Project Overview

This is a Reading List management application built with Next.js, TypeScript, and React. It allows users to manage their reading lists, import books from Notion exports, track reading status, and automatically fetch book metadata and cover art.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React 18
- **Styling**: CSS Modules
- **Data Storage**: JSON file-based storage (`data/reading-list.json`)
- **Testing**: Jest with React Testing Library
- **Process Manager**: PM2 (for production deployment)

## Architecture

### Data Flow

1. **Client Side**: React components fetch and display book data
2. **API Routes**: Next.js API routes handle CRUD operations
3. **File Storage**: Books are persisted to `data/reading-list.json`
4. **External APIs**:
   - Open Library API for book covers
   - Google Books API for rich metadata

### Key Components

- `BookCard.tsx` - Individual book display with status updates and delete functionality
- `BookList.tsx` - Grid layout for displaying all books
- `AddBookForm.tsx` - Form for manually adding new books
- `ImportSection.tsx` - Handles CSV/Markdown imports from Notion
- `FilterBar.tsx` - Filter books by reading status

### API Routes

- `GET /api/reading-list` - Fetch all books
- `POST /api/reading-list` - Add a new book
- `PUT /api/reading-list` - Update a book's properties
- `DELETE /api/reading-list?id={bookId}` - Delete a book
- `GET /api/books/search?title={title}&author={author}` - Search for book metadata

## Data Model

Books are stored with the following structure:

```typescript
interface Book {
  id: string;
  title: string;
  author: string;
  status: 'Want to Read' | 'Currently Reading' | 'Finished' | 'Abandoned';
  isbn?: string;
  coverUrl?: string;
  rating?: number;
  notes?: string;
  dateAdded: string;
  dateStarted?: string;
  dateFinished?: string;
  description?: string;
  pageCount?: number;
  publishedDate?: string;
  genres?: string[];
}
```

## Development Workflow

### Local Development

```bash
npm install
npm run dev  # Runs on port 3010
```

### Running Tests

```bash
npm test              # Run tests once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Building for Production

```bash
npm run build
npm start  # Runs on port 3010
```

## Deployment

The application is deployed using PM2 for process management. See the "Server Deployment with PM2" section in README.md for detailed deployment instructions.

### Quick Deployment Steps

1. Pull latest code: `git pull origin main`
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Restart PM2: `pm2 reload reading-list-app`

## Important Notes for AI Assistants

### File Storage vs LocalStorage

- **Previous versions** used browser localStorage for data persistence
- **Current version** uses server-side JSON file storage at `data/reading-list.json`
- The data file is tracked in Git and contains all book records
- Migration from localStorage to file storage was completed in commit `ff777da`

### Port Configuration

- Development and production both run on port **3010** (hardcoded in package.json)
- To run on a different port: `npx next start -p {PORT}`

### Data File Location

- Data is stored in `data/reading-list.json`
- The `data/` directory must exist and be writable by the server process
- If the file doesn't exist, it will be created automatically with an empty array

### Recent Changes

- **Delete Feature**: Added DELETE endpoint and UI button (commit `3bf7d29`)
- **Bug Fixes**: Fixed status mapping and timeline generation (commit `97f6c1a`)
- **Storage Migration**: Completed transition from localStorage to file-based storage (commit `ff777da`)

### Common Development Tasks

**Adding a new book property:**
1. Update the `Book` type in `types/book.ts`
2. Update the API route handlers in `app/api/reading-list/route.ts`
3. Update UI components as needed
4. Update tests

**Adding a new API endpoint:**
1. Create route file in `app/api/{endpoint}/route.ts`
2. Export HTTP method handlers (GET, POST, PUT, DELETE)
3. Update types if needed
4. Add tests in `__tests__/`

**Modifying book metadata fetching:**
- Edit `lib/bookApi.ts` for external API integration
- The app uses Open Library and Google Books APIs
- No API keys required (public endpoints)

### Testing Strategy

- Unit tests for API routes
- Component tests for React components
- Integration tests for data flow
- Test files located in `__tests__/` directory

### Gotchas

1. **PM2 Caching**: Always run `npm run build` before restarting PM2
2. **Port Conflicts**: Check if port 3010 is in use before starting
3. **Data File Permissions**: Ensure the server process can write to `data/reading-list.json`
4. **Status Mapping**: Status values must match exactly (case-sensitive)

## Future Considerations

- Consider moving to a database (PostgreSQL, MongoDB) for scalability
- Add user authentication for multi-user support
- Implement cloud sync functionality
- Add export functionality (CSV, JSON)
- Consider adding book recommendations based on reading history
