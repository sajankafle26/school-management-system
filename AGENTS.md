<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: School Management System (SMS)

## Architecture
- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB Atlas (via Mongoose)
- **Styling**: Tailwind CSS v4
- **Root Layout**: `src/app/layout.tsx`

## Directory Structure
- `src/app/` - Next.js App Router pages & API routes
  - `src/app/page.tsx` - Public website (landing page)
  - `src/app/login/page.tsx` - Login page
  - `src/app/dashboard/page.tsx` - Dashboard SPA (admin panel)
  - `src/app/api/` - REST API routes
- `src/views/` - Page components (used by dashboard)
- `src/components/` - Shared React components
- `src/lib/` - MongoDB connection & Mongoose models
- `src/lib/models/` - Mongoose schemas for all data types
- `src/data/` - Mock data (legacy, being replaced by API)

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## API Endpoints
- `POST /api/seed` - Seed database with initial data
- `POST /api/auth/login` - Authenticate user
- `GET/PUT /api/website-content` - Website CMS content
- `GET/POST /api/students` - Student management
- `GET/POST /api/teachers` - Teacher management
- `GET/POST /api/notices` - Notice management
- `GET/POST /api/events` - Event management
- `GET/POST /api/results` - Results management
- `GET/POST /api/fee-invoices` - Fee invoice management
- `GET/POST /api/expenses` - Expense management
- `GET/POST /api/academic-years` - Academic year management
- `GET/POST /api/parents` - Parent management
- `GET/POST /api/staff` - Staff management
- `GET/POST /api/drivers` - Driver management

## Data Flow
- Public website fetches website content from `/api/website-content`
- Notices on public site come from `/api/notices`
- Login authenticates against MongoDB via `/api/auth/login`
- Website CMS edits are saved via `PUT /api/website-content`
- Dashboard pages fetch data from respective API endpoints

## Environment
- `.env.local` contains `MONGODB_URI` for database connection
- Default login: `admin` / `password`
