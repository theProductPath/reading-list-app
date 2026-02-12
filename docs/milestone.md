# From Browser Storage to Production-Ready: Building a Personal Reading List App with Next.js

I had a problem that I suspect a lot of readers share. I'd been tracking my reading in Notion for years, but I wanted something more tailored to my needs. Something with better visualizations, faster filtering, and the ability to see my reading patterns at a glance. So I built a reading list management app from scratch using Next.js, and over the course of eleven commits, transformed it from a client-side prototype into a feature-rich, production-ready application.

What started as a straightforward CRUD app evolved into something more interesting. The journey involved migrating from localStorage to a proper API-based architecture, building an interactive analytics dashboard with hand-coded SVG charts, adding comprehensive test coverage with Jest, and creating a deployment pipeline for a real server.

## Starting with the Foundation

The initial commit laid down everything needed for a functional reading list manager: import books from Notion exports in CSV or Markdown format, add books manually with automatic metadata fetching from Google Books and Open Library, and track reading status across four states (want to read, currently reading, finished, abandoned) in a card-based grid with cover art.

The Notion import parser handled both CSV and Markdown exports, mapped Notion's status values to the internal schema, and dealt with all the quirks of how Notion formats dates and metadata. It normalized inconsistent field names and date formats into a clean, predictable data structure.

## The Pivot to Server-Side Storage

After using the app for a while, localStorage felt limiting. I wanted data to persist across devices. So I built a complete REST API using Next.js API routes with full CRUD operations backed by a JSON file on the server. The tricky part was the migration — I added automatic migration logic that detected existing localStorage data, pushed it to the new API, and cleaned itself up once complete. Not a single book entry was lost during the transition.

## Building the Analytics Dashboard

With a solid data layer in place, I turned to visualization. I hand-coded all the charts using SVG rather than pulling in a charting library — complete control over the visual design and a smaller bundle size. The dashboard included:

- **Pie charts** for status distribution, rating breakdown, format preferences, and top genres
- **Bar charts** for a 12-month reading timeline and yearly summary
- **Stat cards** for total books, finished count, average rating, total pages, and monthly/yearly finish counts
- **Top authors and recent finishes** with clickable entries

Every chart element was interactive. Clicking a yearly bar filters the book list to that year and switches to list view. Clicking a genre slice shows only books in that genre. Exploration feels fluid and intuitive.

## Polishing the User Experience

A series of UI improvements elevated the overall feel: genre filtering with clickable tags, gradient-based book placeholders matching the dashboard palette, a cleaner menu system with a three-dot icon, and a card-versus-list view toggle. List view displayed books in a compact table with inline status and rating editing for quickly scanning large collections.

## Making It Editable

Format (physical, ebook, audiobook) and finish date became editable directly on the book detail page — a dropdown selector and a click-to-edit date picker. This flexibility was crucial because not all books come with perfect metadata.

## Adding Delete Functionality and Tests

Delete buttons were wired up across book cards, list view, and the detail page. At the same time, I added comprehensive test coverage using Jest and React Testing Library — unit tests for storage functions, analytics calculations, the Notion parser, and the deduplication system. Running `npm test` became part of the workflow before every commit.

## Deploying to Production

A bash deployment script automated the entire process: pull latest changes, `npm ci`, build the production bundle, and restart via PM2. One command to deploy a new version.

## What I Learned

- **Start simple and iterate.** The localStorage version worked perfectly for the initial use case, and migrating later was straightforward because the storage layer was abstracted from the beginning.
- **Hand-coded SVG charts** were more work upfront but gave complete control over interactions and design. Adding an onClick to a chart slice to trigger a filter was trivial.
- **Automated deployment scripts** eliminate forgotten steps and wrong commands.
- **Testing is design documentation.** Writing tests forced thinking about edge cases and served as a reference for how each function should behave.
