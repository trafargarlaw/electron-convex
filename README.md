# Electron + Convex + Better Auth + tRPC Boilerplate

A modern, production-ready Electron desktop application boilerplate featuring:
- ⚡ **Electron** - Build cross-platform desktop apps
- 🔒 **Better Auth** - Modern authentication with email OTP
- 🗄️ **Convex** - Real-time backend and database
- 🔌 **tRPC** - End-to-end typesafe IPC communication
- ⚛️ **React 19** - Modern React with latest features
- 🎨 **Tailwind CSS v4** - Utility-first styling
- 🧭 **TanStack Router** - Type-safe routing
- 📦 **Vite** - Lightning fast development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- A Convex account ([sign up free](https://convex.dev))

### Installation

1. **Clone or use this template**
   ```bash
   git clone <your-repo-url>
   cd <your-project-name>
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Convex**
   ```bash
   # Login to Convex
   npx convex login

   # Initialize your project
   npx convex dev --once
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Convex deployment URL and site URL.

5. **Start development**
   ```bash
   # Terminal 1 - Start Convex backend
   npx convex dev

   # Terminal 2 - Start Electron app
   pnpm dev
   ```

## 📁 Project Structure

```
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry
│   └── preload.ts     # Preload scripts
├── src/               # React renderer process
│   ├── routes/        # TanStack Router routes
│   ├── components/    # React components
│   ├── lib/          # Utilities and helpers
│   └── app.tsx       # App entry point
├── shared/           # Shared code (main + renderer)
│   ├── routers/      # tRPC routers
│   ├── context.ts    # tRPC context
│   └── config.ts     # tRPC client config
├── convex/           # Convex backend
│   ├── betterAuth/   # Better Auth configuration
│   ├── auth.ts       # Auth setup
│   └── http.ts       # HTTP endpoints
└── dist-electron/    # Build output
```

## 🔧 Configuration

### Better Auth

The boilerplate comes with Better Auth configured with:
- Email OTP authentication
- Convex adapter for data storage
- Cross-domain support

To customize authentication, edit:
- `convex/auth.ts` - Auth configuration
- `src/lib/auth-client.ts` - Client setup

### tRPC

tRPC is set up for type-safe IPC between Electron main and renderer processes.

Add new procedures in `shared/routers/`:
```typescript
export const myRouter = router({
  myQuery: publicProcedure.query(async () => {
    return "Hello from main process";
  }),
});
```

### Convex

Your Convex backend is in the `convex/` directory. Add functions, mutations, and queries as needed.

Example:
```typescript
// convex/myFunction.ts
import { query } from "./_generated/server";

export const myQuery = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("myTable").collect();
  },
});
```

## 🎨 UI Components

This boilerplate includes Radix UI components with Tailwind CSS:
- Button, Input, Label
- Avatar, Card, Drawer
- Progress, Input OTP
- Theme Provider (dark/light mode)

Located in `src/components/ui/`

## 📦 Building for Production

```bash
# Build the app
pnpm build

# Build output will be in dist-electron/
```

For platform-specific builds, configure `electron-builder` in `package.json`.

## 🔒 Environment Variables

Required environment variables (see `.env.example`):

- `VITE_CONVEX_URL` - Your Convex deployment URL
- `VITE_CONVEX_SITE_URL` - Your Convex site URL for auth
- `SITE_URL` - Your app's site URL
- `CONVEX_SITE_URL` - Convex site URL (backend)

## 🛠️ Tech Stack Details

### Frontend
- **React 19** - Latest React with improved performance
- **TanStack Router** - File-based routing with type safety
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS v4** - Modern utility-first CSS
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend/Services
- **Convex** - Real-time backend with TypeScript
- **Better Auth** - Modern authentication library
- **tRPC** - Type-safe APIs without code generation

### Desktop
- **Electron** - Cross-platform desktop framework
- **electron-trpc** - tRPC integration for Electron IPC
- **electron-builder** - Package and distribute apps

### Dev Tools
- **Vite** - Next-generation build tool
- **TypeScript** - Type safety across the stack
- **Biome** - Fast formatter and linter

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `npx convex dev` - Start Convex backend in dev mode
- `npx convex deploy` - Deploy Convex backend

## 🤝 Contributing

This is a boilerplate project. Feel free to:
- Fork and customize for your needs
- Submit improvements via PRs
- Report issues or suggest features

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

This boilerplate combines the best practices from:
- [Electron](https://www.electronjs.org/)
- [Convex](https://convex.dev)
- [Better Auth](https://better-auth.com)
- [tRPC](https://trpc.io)
- [electron-trpc](https://www.electron-trpc.dev/)

## 💡 Tips

1. **Development**: Always run `npx convex dev` before starting the Electron app
2. **Type Safety**: tRPC provides full type safety between main and renderer processes
3. **Authentication**: Customize the email sender in `convex/auth.ts` for production
4. **Styling**: Use Tailwind classes or extend the theme in `src/index.css`
5. **State**: Add global state with Zustand or similar if needed

## 🐛 Troubleshooting

### Convex Connection Issues
- Ensure `npx convex dev` is running
- Check your `.env.local` file has correct URLs
- Verify you're logged into Convex CLI

### Build Errors
- Clear `dist-electron/` and rebuild
- Delete `node_modules/` and reinstall
- Check TypeScript errors with `tsc --noEmit`

### Auth Not Working
- Verify Convex site URL is correct
- Check Better Auth configuration in `convex/auth.ts`
- Ensure trusted origins include your dev server URL

## 📚 Further Reading

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
- [TanStack Router](https://tanstack.com/router)

---

**Happy Building! 🚀**
