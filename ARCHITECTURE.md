# Architecture Overview

This document explains the architecture and how different parts of the boilerplate work together.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Main Process                    │
│  ┌────────────┐  ┌──────────┐  ┌──────────────────────┐    │
│  │ Window     │  │  tRPC    │  │  Native Node.js      │    │
│  │ Management │  │  Server  │  │  APIs & Capabilities │    │
│  └────────────┘  └──────────┘  └──────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │ IPC (via trpc-electron)
┌─────────────────────┴───────────────────────────────────────┐
│                  Electron Renderer Process                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    React App                         │   │
│  │  ┌──────────┐  ┌───────────┐  ┌─────────────────┐  │   │
│  │  │ TanStack │  │   tRPC    │  │  Better Auth    │  │   │
│  │  │  Router  │  │  Client   │  │     Client      │  │   │
│  │  └──────────┘  └───────────┘  └─────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTPS
                  ┌────────┴────────┐
                  │  Convex Backend │
                  │  ┌───────────┐  │
                  │  │ Functions │  │
                  │  │ Database  │  │
                  │  │ Real-time │  │
                  │  └───────────┘  │
                  └─────────────────┘
```

## 📁 Directory Structure Explained

### `/electron` - Main Process
The Electron main process runs with full Node.js capabilities and manages the native application.

**`main.ts`**
- Creates and manages windows
- Sets up tRPC IPC handler
- Handles app lifecycle events
- Manages native APIs

**`preload.ts`**
- Exposes APIs to renderer process
- Provides security bridge
- Keeps context isolation enabled

### `/src` - Renderer Process
The React application that runs in the Electron window.

**`app.tsx`**
- App entry point
- Sets up providers (TanStack Query, tRPC, Auth, Theme)
- Configures router

**`routes/`**
- File-based routing with TanStack Router
- Each file becomes a route
- Type-safe navigation

**`components/`**
- Reusable React components
- UI primitives from Radix UI
- Custom components

**`lib/`**
- Utility functions
- Auth client configuration
- Helper functions

### `/shared` - Shared Code
Code that's used by both main and renderer processes.

**`routers/`**
- tRPC router definitions
- Type-safe IPC procedures
- Shared between main and renderer

**`context.ts`**
- tRPC context creator
- Provides access to Electron APIs
- Available in all procedures

**`config.ts`**
- tRPC client configuration
- Query client setup
- Shared configuration

### `/convex` - Backend
Serverless backend functions and database schema.

**`auth.ts`**
- Better Auth configuration
- Authentication providers
- Auth helper functions

**`auth.config.ts`**
- Auth configuration for Convex
- Provider settings

**`http.ts`**
- HTTP endpoints for auth
- Handles auth callbacks

**`betterAuth/`**
- Better Auth adapter for Convex
- Database schema for auth tables
- Generated API methods

## 🔌 How Communication Works

### 1. Renderer → Main (via tRPC)

```typescript
// In renderer (src/)
import trpc from "@shared/config";

function MyComponent() {
  // Type-safe IPC call to main process
  const { data } = trpc.window.minimize.useMutation();
}
```

```typescript
// In main (shared/routers/)
export const windowRouter = router({
  minimize: publicProcedure.mutation(async ({ ctx }) => {
    ctx.window?.minimize();
  }),
});
```

### 2. Renderer → Convex Backend

```typescript
// In renderer
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function MyComponent() {
  const data = useQuery(api.myFunction.getData);
}
```

```typescript
// In convex/
export const getData = query({
  handler: async (ctx) => {
    return await ctx.db.query("table").collect();
  },
});
```

### 3. Main → Renderer

```typescript
// In main process
mainWindow.webContents.send("custom-event", data);

// In renderer process
ipcRenderer.on("custom-event", (event, data) => {
  // Handle event
});
```

## 🔒 Authentication Flow

```
1. User enters email
   ↓
2. Frontend calls Better Auth API
   ↓
3. Better Auth generates OTP
   ↓
4. OTP sent via email (configure in convex/auth.ts)
   ↓
5. User enters OTP
   ↓
6. Better Auth verifies OTP
   ↓
7. Session created in Convex
   ↓
8. User authenticated
```

### Better Auth + Convex Integration

- **Storage**: Auth data stored in Convex tables
- **Adapter**: `@convex-dev/better-auth` provides the adapter
- **Sessions**: Managed by Better Auth, stored in Convex
- **Real-time**: Convex provides real-time auth state updates

## 🎨 Styling Architecture

### Tailwind CSS v4
- Utility-first CSS framework
- Configured in `src/index.css`
- Custom theme with CSS variables

### Radix UI
- Unstyled, accessible components
- Styled with Tailwind
- Located in `src/components/ui/`

### Theme System
- Light/dark mode support
- CSS variables for colors
- System preference detection
- Theme switcher component

## 🔄 State Management

### React State
- Local component state with `useState`
- Form state management

### TanStack Query
- Server state caching
- Automatic refetching
- Optimistic updates
- Used by both tRPC and Convex

### Convex
- Real-time reactive data
- Automatic cache invalidation
- Optimistic updates built-in

### No Global State Library?
This boilerplate intentionally doesn't include Zustand/Redux/etc. Add one if your app needs it:

```bash
pnpm add zustand
```

## 🚀 Build Process

```
1. TypeScript Compilation
   ├─ Main process (electron/)
   ├─ Renderer process (src/)
   └─ Shared code (shared/)
   ↓
2. Vite Build
   ├─ Bundles React app
   ├─ Optimizes assets
   └─ Code splitting
   ↓
3. Electron Builder
   ├─ Packages app
   ├─ Creates installers
   └─ Platform-specific builds
```

## 🔐 Security Considerations

### Context Isolation
- Enabled by default
- Renderer can't access Node.js directly
- Use tRPC for IPC instead

### Content Security Policy
Consider adding CSP headers for production.

### Secure Auth Flow
- Better Auth handles session security
- Cross-domain protection enabled
- HTTPS required for production

### Environment Variables
- Never expose secrets to renderer
- Use Convex environment variables for backend secrets
- `.env.local` for local development only

## 📦 Dependencies Explained

### Core
- **electron**: Desktop framework
- **react**: UI library
- **vite**: Build tool
- **typescript**: Type safety

### Backend
- **convex**: Serverless backend
- **better-auth**: Authentication
- **@convex-dev/better-auth**: Convex adapter for auth

### IPC & Data
- **trpc-electron**: Type-safe IPC
- **@tanstack/react-query**: Data fetching
- **@tanstack/react-router**: Routing

### UI
- **tailwindcss**: Styling
- **@radix-ui/***: UI primitives
- **lucide-react**: Icons
- **next-themes**: Theme management

### Dev Tools
- **@biomejs/biome**: Formatting & linting
- **electron-builder**: App packaging

## 🎯 Best Practices

### Code Organization
- Keep components small and focused
- Separate business logic from UI
- Use custom hooks for reusable logic
- Group related files together

### Type Safety
- Use TypeScript everywhere
- Avoid `any` types
- Let tRPC handle type inference
- Use Zod for runtime validation

### Performance
- Use React.memo() sparingly
- Leverage TanStack Query caching
- Implement pagination for large lists
- Lazy load routes with TanStack Router

### Error Handling
- Use Error Boundaries for React errors
- Handle tRPC errors gracefully
- Show user-friendly error messages
- Log errors for debugging

## 🧪 Testing Strategy (Not Included)

Recommended testing setup:

1. **Unit Tests**: Jest/Vitest for utilities
2. **Component Tests**: React Testing Library
3. **Integration Tests**: Test tRPC procedures
4. **E2E Tests**: Playwright/Spectron for full flows

## 📚 Learn More

- [Electron Docs](https://www.electronjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Better Auth Docs](https://better-auth.com/docs)
- [tRPC Docs](https://trpc.io/docs)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

This architecture provides a solid foundation while remaining flexible for your specific needs. Modify it to fit your project requirements!

