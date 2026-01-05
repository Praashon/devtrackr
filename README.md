# DevTrackr

Personal development dashboard for developers who want clear visibility into their real progress over time.

## Foundation Milestone ✅

The foundation milestone is complete! This includes:

- ✅ Design system with Tailwind (Teal, Orange, Slate colors)
- ✅ Google Fonts loaded (Fraunces, Inter, JetBrains Mono)
- ✅ Dark mode with system preference + manual toggle
- ✅ TypeScript data model types
- ✅ Prisma schema (PostgreSQL)
- ✅ Mock user authentication
- ✅ Application shell with responsive navigation
- ✅ 5 section routes (Dashboard, Weekly Review, Goals & Habits, Analytics, Reports)
- ✅ E2E tests with Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or use Prisma Dev with `npx prisma dev`)

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Testing

Run E2E tests:

```bash
npm run test:e2e
```

Run tests in UI mode:

```bash
npm run test:e2e:ui
```

### Database

Initialize Prisma (when ready):

```bash
npx prisma migrate dev --name init
```

## Project Structure

```
devtrackr-site/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # GitHub Activity Dashboard
│   ├── weekly-review/     # Weekly Review Workflow
│   ├── goals-habits/      # Goals & Habits Tracking
│   ├── analytics/         # Trend Analytics
│   ├── reports/           # Export & Reporting
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (redirects to weekly-review)
│   └── providers.tsx      # Context providers
├── components/
│   ├── shell/             # Application shell components
│   └── AppLayout.tsx      # Layout wrapper
├── lib/
│   ├── contexts/          # React contexts (Auth, Theme)
│   ├── hooks/             # Custom hooks
│   └── types/             # TypeScript types
├── prisma/
│   └── schema.prisma      # Database schema
└── tests/
    └── e2e/               # Playwright tests
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL + Prisma
- **Icons:** Lucide React
- **Testing:** Playwright
- **State Management:** React Context + Zustand (when needed)

## Features Implemented

### Design System
- Teal (primary), Orange (secondary), Slate (neutral) color palette
- Typography: Fraunces (headings), Inter (body), JetBrains Mono (code)
- Dark mode support with system preference detection

### Authentication
- Mock user for development
- `useCurrentUser()` hook abstraction
- Ready for GitHub OAuth integration (Milestone 2)

### Navigation
- 5 main sections with active route highlighting
- Collapsible sidebar on desktop
- Mobile hamburger menu
- Responsive design

## Next Steps

### Milestone 2: GitHub Activity Dashboard
- Implement GitHub OAuth
- Sync GitHub activity data
- Display aggregated activity metrics
- Weekly navigation
- Repository drill-down

## License

Private project
