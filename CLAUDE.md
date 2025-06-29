# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an App Store Ranking Generator built with Next.js 15.3.4 using the App Router architecture. The project uses TypeScript, React 19, and is configured with shadcn/ui components.

## Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (New York style, neutral theme)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **App Store Data**: app-store-scraper for iTunes/App Store data extraction

### Key Directories
- `app/`: Next.js App Router pages and layouts
- `app/api/`: API routes for backend functionality
- `components/`: React components (shadcn/ui components go here)
- `lib/`: Utility functions and shared code
- `public/`: Static assets

### Important Files
- `components.json`: shadcn/ui configuration
- `lib/utils.ts`: Contains `cn()` utility for className merging
- `lib/types.ts`: TypeScript interfaces for API responses
- `app/globals.css`: Global styles with Tailwind directives

## Component Development

When adding new shadcn/ui components:
```bash
pnpm dlx shadcn@latest add [component-name]
```

Components will be added to `components/ui/` directory.

## Code Conventions

1. **Imports**: Use `@/` path alias for absolute imports
2. **Styling**: Use Tailwind classes with `cn()` utility from `lib/utils`
3. **Components**: Follow shadcn/ui patterns for consistency
4. **Forms**: Use React Hook Form with Zod schemas for validation

## Testing

No testing framework is currently configured. When implementing tests, consider adding Vitest or Jest with React Testing Library.

## API Endpoints

### App Store Scraper API

The project includes API routes for fetching App Store data:

#### Get App Details
```
GET /api/app-store-scraper/app/{trackId}
```
- **Parameter**: `trackId` - iTunes trackId (numeric, e.g., 553834731)
- **Response**: App details including title, description, rating, screenshots, etc.
- **Example**: `/api/app-store-scraper/app/553834731`

#### Get Similar Apps
```
GET /api/app-store-scraper/similar/{trackId}
```
- **Parameter**: `trackId` - iTunes trackId (numeric, e.g., 553834731) 
- **Response**: Array of similar apps with their details
- **Example**: `/api/app-store-scraper/similar/553834731`

#### Error Handling
- `400 Bad Request`: Invalid trackId (non-numeric)
- `404 Not Found`: App not found in App Store
- `500 Internal Server Error`: Server or scraping error

## Notes

- The project uses pnpm as the package manager
- Turbopack is enabled for faster development builds
- API routes use app-store-scraper to fetch iTunes/App Store data
- No environment variables configured yet