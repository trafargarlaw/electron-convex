# Setup Guide

This guide will walk you through setting up your development environment and configuring all necessary services for this boilerplate.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Convex Setup](#convex-setup)
4. [Better Auth Configuration](#better-auth-configuration)
5. [Development Workflow](#development-workflow)
6. [Customization](#customization)
7. [Deployment](#deployment)

## Prerequisites

### Required Software

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **pnpm** (recommended) or npm
  ```bash
  npm install -g pnpm
  ```

### Recommended Tools

- **VS Code** with these extensions:
  - Biome (formatting/linting)
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)
  
## Initial Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-name>
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required packages for:
- Electron (desktop framework)
- React (UI framework)
- Convex (backend)
- Better Auth (authentication)
- tRPC (IPC communication)
- Tailwind CSS (styling)

## Convex Setup

### 1. Create a Convex Account

1. Go to [https://dashboard.convex.dev](https://dashboard.convex.dev)
2. Sign up with GitHub, Google, or email
3. Verify your email if required

### 2. Login via CLI

```bash
npx convex login
```

This will open a browser window for authentication.

### 3. Initialize Your Project

```bash
npx convex dev --once
```

This command will:
- Create a new Convex project (or link to existing)
- Generate the deployment
- Output your deployment URL

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Convex URLs:

```env
# Get these from your Convex dashboard
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CONVEhttp://localhost:5173
VITE_CONVEX_SITE_URL=https://your-deployment.convex.site
```

**Finding Your URLs:**
- `VITE_CONVEX_URL`: Dashboard → Your Project → Settings → Deployment URL
- `VITE_CONVEX_SITE_URL`: Dashboard → Your Project → Settings → Site URL

### 5. Deploy Convex Functions

For local development:
```bash
npx convex dev
```

Keep this running in a separate terminal during development.

For production:
```bash
npx convex deploy
```

## Better Auth Configuration

Better Auth is pre-configured with email OTP authentication.

### Email Configuration (Production)

In `convex/auth.ts`, update the email sender:

```typescript
emailOTP({
  async sendVerificationOTP({ email, otp, type }) {
    // Replace with your email service (SendGrid, Resend, etc.)
    await yourEmailService.send({
      to: email,
      subject: "Your Login Code",
      html: `Your code is: <strong>${otp}</strong>`,
    });
  },
}),
```

### Popular Email Services

**Resend** (recommended):
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

emailOTP({
  async sendVerificationOTP({ email, otp, type }) {
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Your Login Code',
      html: `Your verification code is: <strong>${otp}</strong>`,
    });
  },
}),
```

**SendGrid**:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

emailOTP({
  async sendVerificationOTP({ email, otp, type }) {
    await sgMail.send({
      to: email,
      from: 'noreply@yourdomain.com',
      subject: 'Your Login Code',
      html: `Your verification code is: <strong>${otp}</strong>`,
    });
  },
}),
```

### Additional Auth Methods

To add more authentication methods, see [Better Auth Plugins](https://better-auth.com/docs/plugins).

Example - Add Google OAuth:

```typescript
// In convex/auth.ts
import { google } from "better-auth/plugins";

plugins: [
  google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  // ... other plugins
],
```

## Development Workflow

### Starting Development

You need **two terminals**:

**Terminal 1 - Convex Backend:**
```bash
npx convex dev
```

**Terminal 2 - Electron App:**
```bash
pnpm dev
```

The Electron app will automatically reload when you make changes.

### Hot Reload

- **React Components**: Hot reload automatically with Vite
- **Electron Main Process**: Restart required (app restarts automatically)
- **Convex Functions**: Auto-deploy with `npx convex dev`

### Debugging

**Renderer Process (React):**
- Open DevTools in the Electron window: `Cmd/Ctrl + Shift + I`
- Or uncomment in `electron/main.ts`:
  ```typescript
  mainWindow.webContents.openDevTools({ mode: "bottom" });
  ```

**Main Process (Electron):**
- Use VS Code debugger
- Or add `console.log()` statements

**Convex Functions:**
- View logs in Convex dashboard
- Or in terminal running `npx convex dev`

## Customization

### Change App Name & Branding

1. **package.json** - Update name and description:
   ```json
   {
     "name": "your-app-name",
     "description": "Your app description",
     "author": "Your Name"
   }
   ```

2. **Electron Window** - Update in `electron/main.ts`:
   ```typescript
   const mainWindow = new BrowserWindow({
     width: 1200,  // Customize size
     height: 800,
     // ... other options
   });
   ```

3. **App Icon** - Replace icon files in appropriate locations
   - macOS: `.icns` file
   - Windows: `.ico` file
   - Linux: `.png` file

4. **Protocol Handler** - Update in `electron/main.ts`:
   ```typescript
   app.setAsDefaultProtocolClient("your-app-protocol");
   ```

### Add tRPC Procedures

Create new routers in `shared/routers/`:

```typescript
// shared/routers/myRouter.ts
import { publicProcedure, router } from "@/trpc";
import { z } from "zod";

export const myRouter = router({
  getData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Your logic here
      return { data: "example" };
    }),
});
```

Then add to `shared/routers/_app.ts`:

```typescript
import { myRouter } from "./myRouter";

export const appRouter = router({
  window: windowRouter,
  myRouter: myRouter,
});
```

### Add Convex Functions

Create new files in `convex/`:

```typescript
// convex/myFunction.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getData = query({
  args: { id: v.id("tableName") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createData = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tableName", { name: args.name });
  },
});
```

### Customize UI Theme

Edit `src/index.css` to change colors:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... customize other colors */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... customize dark mode colors */
  }
}
```

## Deployment

### 1. Build the App

```bash
pnpm build
```

This will:
1. Compile TypeScript
2. Build the Vite app
3. Package with electron-builder

### 2. Deploy Convex Backend

```bash
npx convex deploy
```

Update your production environment variables with the production URLs.

### 3. Configure electron-builder

Edit `package.json` to add build configuration:

```json
{
  "build": {
    "appId": "com.yourcompany.yourapp",
    "productName": "Your App Name",
    "directories": {
      "output": "dist"
    },
    "files": [
      "dist/**/*",
      "dist-electron/**/*"
    ],
    "mac": {
      "category": "public.app-category.productivity",
      "icon": "build/icon.icns"
    },
    "win": {
      "target": "nsis",
      "icon": "build/icon.ico"
    },
    "linux": {
      "target": "AppImage",
      "icon": "build/icon.png"
    }
  }
}
```

### 4. Platform-Specific Builds

**macOS:**
```bash
pnpm build -- --mac
```

**Windows:**
```bash
pnpm build -- --win
```

**Linux:**
```bash
pnpm build -- --linux
```

### 5. Code Signing (macOS/Windows)

For distribution, you'll need:
- **macOS**: Apple Developer account & certificate
- **Windows**: Code signing certificate

See [electron-builder docs](https://www.electron.build/code-signing) for details.

## Troubleshooting

### Common Issues

**"Cannot find module" errors:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Convex connection fails:**
- Ensure `npx convex dev` is running
- Check `.env.local` has correct URLs
- Verify you're logged in: `npx convex info`

**Build fails:**
```bash
rm -rf dist dist-electron
pnpm build
```

**TypeScript errors:**
```bash
# Check errors without building
tsc --noEmit
```

### Getting Help

- [Convex Discord](https://discord.gg/convex)
- [Better Auth Discord](https://discord.gg/better-auth)
- [tRPC Discord](https://discord.gg/trpc)
- [Electron Discord](https://discord.gg/electron)

## Next Steps

1. ✅ Complete the setup above
2. 🎨 Customize the UI to match your brand
3. 🔧 Add your app's specific features
4. 🧪 Test thoroughly
5. 📦 Build and distribute

Happy building! 🚀

