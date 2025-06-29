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

### Key Directories
- `app/`: Next.js App Router pages and layouts
- `components/`: React components (shadcn/ui components go here)
- `lib/`: Utility functions and shared code
- `public/`: Static assets

### Important Files
- `components.json`: shadcn/ui configuration
- `lib/utils.ts`: Contains `cn()` utility for className merging
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

## Notes

- The project uses pnpm as the package manager
- Turbopack is enabled for faster development builds
- No API routes or backend logic implemented yet
- No environment variables configured yet