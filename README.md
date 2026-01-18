# Reading List App

A modern web application for managing your reading list, imported from Notion exports.

## Features

- 📥 **Import from Notion**: Upload CSV or Markdown files exported from your Notion Reading List database
- ➕ **Add Books**: Manually add new books to your reading list
- 📊 **Track Status**: Update reading status (Want to Read, Currently Reading, Finished, Abandoned)
- 🖼️ **Book Covers**: Automatically fetch book cover art from Open Library and Google Books
- 📚 **Rich Metadata**: Get book descriptions, page counts, publication dates, and genres
- 🔍 **Filter & Search**: Filter books by reading status
- 💾 **Local Storage**: All data is stored locally in your browser

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd reading-list-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Importing from Notion

1. Export your Reading List database from Notion as CSV or Markdown
2. Click "Choose Files" in the Import section
3. Select your exported files (`.csv` or `.md`)
4. The app will automatically:
   - Parse your book data
   - Fetch cover art and metadata from external APIs
   - Add all books to your reading list

### Adding Books Manually

1. Click the "+ Add Book" button
2. Fill in the book details (Title and Author are required)
3. Optionally add ISBN, status, and notes
4. Click "Add Book" - the app will automatically fetch cover art and metadata

### Updating Book Status

- Use the dropdown on any book card to change its status
- The app automatically tracks when you started or finished reading

### Filtering Books

- Use the filter dropdown to view books by status
- View all books, or filter by: Want to Read, Currently Reading, Finished, or Abandoned

## Data Format

The app supports importing from Notion exports with the following fields:

**CSV Format:**
- Title/Name
- Author/Authors
- Status
- ISBN
- Rating
- Notes
- Date Added/Started/Finished

**Markdown Format:**
- Book titles as headings (# Title)
- Metadata as key-value pairs (Author:, Status:, etc.)

## External APIs Used

- **Open Library**: Book covers and basic metadata
- **Google Books API**: Rich metadata including descriptions, page counts, and genres

## Data Storage

All data is stored in your browser's localStorage. This means:
- ✅ No account required
- ✅ Works offline (after initial load)
- ⚠️ Data is browser-specific (clearing browser data will remove your books)
- ⚠️ Data doesn't sync across devices

## Project Structure

```
reading-list-app/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/         # React components
│   ├── BookCard.tsx
│   ├── BookList.tsx
│   ├── AddBookForm.tsx
│   ├── ImportSection.tsx
│   └── FilterBar.tsx
├── lib/               # Utility functions
│   ├── bookApi.ts     # External API integration
│   ├── notionParser.ts # Notion export parsing
│   └── storage.ts     # LocalStorage management
├── types/             # TypeScript types
│   └── book.ts
└── data/              # Place your Notion exports here
```

## Building for Production

```bash
npm run build
npm start
```

## Server Deployment with PM2

### Initial Setup

1. Pull the latest code from GitHub:
```bash
git pull origin main
```

2. Install dependencies:
```bash
npm install
```

3. Build the production version:
```bash
npm run build
```

4. Start with PM2:
```bash
pm2 start npm --name "reading-list-app" -- start
pm2 save
```

### Deploying Updates

When deploying updates to your server, follow these steps:

1. Pull the latest code:
```bash
git pull origin main
```

2. Install any new dependencies:
```bash
npm install
```

3. Build the updated application:
```bash
npm run build
```

4. Restart PM2:
```bash
# Option 1: Standard restart (stops then starts the app)
pm2 restart reading-list-app

# Option 2: Reload with zero-downtime (recommended for production)
pm2 reload reading-list-app

# Option 3: Clean restart (delete and recreate the process)
pm2 delete reading-list-app
pm2 start npm --name "reading-list-app" -- start
pm2 save
```

### Useful PM2 Commands

- **View all processes**: `pm2 list`
- **View logs**: `pm2 logs reading-list-app`
- **View detailed info**: `pm2 show reading-list-app`
- **Monitor in real-time**: `pm2 monit`
- **Stop the app**: `pm2 stop reading-list-app`
- **Delete the app**: `pm2 delete reading-list-app`

### Differences Between Restart and Reload

- **`pm2 restart`**: Stops and starts the application (brief downtime)
- **`pm2 reload`**: Zero-downtime restart (seamlessly switches to new version)

For production deployments, use `pm2 reload` to avoid any service interruption.

## Future Enhancements

Potential features to add:
- Export functionality
- Search within books
- Rating system
- Reading statistics
- Integration with Goodreads
- Cloud sync option
