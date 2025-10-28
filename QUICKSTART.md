# Quick Start Guide

Get up and running in 5 minutes!

## ⚡ TL;DR

```bash
# 1. Install dependencies
pnpm install

# 2. Login to Convex
npx convex login

# 3. Initialize Convex (creates .env.local automatically)
npx convex dev

# 4. In a new terminal, start the app
pnpm dev
```

That's it! Your Electron app should now be running. 🎉

## 📝 What You Need

- Node.js 18+
- pnpm (or npm)
- A Convex account (free at [convex.dev](https://convex.dev))

## 🎯 First Steps After Setup

### 1. Test Authentication

The app opens with a login page:
1. Enter your email
2. Check the console for the OTP code (in dev, it's logged)
3. Enter the code to log in
4. You'll be redirected to the `/app` route

### 2. Customize the App

**Change the app name:**
```json
// package.json
{
  "name": "your-app-name",
  "description": "Your app description"
}
```

**Update branding:**
- Replace the icon in `src/routes/index.tsx`
- Update window title in `electron/main.ts`
- Customize theme colors in `src/index.css`

### 3. Add Your First Feature

**Create a tRPC procedure:**
```typescript
// shared/routers/myFeature.ts
import { publicProcedure, router } from "@/trpc";
import { z } from "zod";

export const myFeatureRouter = router({
  sayHello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return `Hello, ${input.name}!`;
    }),
});
```

**Add to main router:**
```typescript
// shared/routers/_app.ts
import { myFeatureRouter } from "./myFeature";

export const appRouter = router({
  window: windowRouter,
  myFeature: myFeatureRouter, // Add this
});
```

**Use in your component:**
```typescript
// src/routes/app/index.tsx
function MyComponent() {
  const { data } = trpc.myFeature.sayHello.useQuery({ 
    name: "World" 
  });
  
  return <div>{data}</div>;
}
```

### 4. Add a Convex Function

**Create the function:**
```typescript
// convex/messages.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const send = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", { text: args.text });
  },
});
```

**Use in your component:**
```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

function Messages() {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);
  
  return (
    <div>
      {messages?.map(msg => <div key={msg._id}>{msg.text}</div>)}
      <button onClick={() => sendMessage({ text: "Hi!" })}>
        Send
      </button>
    </div>
  );
}
```

## 🔥 Common Tasks

### Add a New Route
```bash
# Create a new file in src/routes/
touch src/routes/settings.tsx
```

```typescript
// src/routes/settings.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return <div>Settings Page</div>;
}
```

Navigate: `navigate({ to: "/settings" })`

### Add a UI Component

Use shadcn-style components or create your own:

```typescript
// src/components/ui/my-component.tsx
import { Button } from "./button";

export function MyComponent() {
  return (
    <div className="flex gap-4">
      <Button>Click me</Button>
    </div>
  );
}
```

### Change Window Size/Behavior

```typescript
// electron/main.ts
const mainWindow = new BrowserWindow({
  width: 1200,    // Change width
  height: 800,    // Change height
  frame: true,    // Show/hide frame
  resizable: true, // Allow resizing
  // ... more options
});
```

### Set Up Email Sending (Production)

```bash
# Install email service
pnpm add resend
```

```typescript
// convex/auth.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

emailOTP({
  async sendVerificationOTP({ email, otp, type }) {
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Your Login Code',
      html: `<p>Your code is: <strong>${otp}</strong></p>`,
    });
  },
}),
```

## 🚀 Building for Distribution

```bash
# Build the app
pnpm build

# macOS
pnpm build -- --mac

# Windows  
pnpm build -- --win

# Linux
pnpm build -- --linux
```

Outputs will be in `dist/` directory.

## 🐛 Troubleshooting

**App won't start:**
- Ensure `npx convex dev` is running
- Check `.env.local` exists and has correct URLs
- Try `rm -rf node_modules && pnpm install`

**Auth not working:**
- Check console for OTP code (in development)
- Verify Convex is running
- Ensure URLs in `.env.local` match Convex dashboard

**Types not working:**
- Run `npx convex dev` to generate types
- Restart your TypeScript server in VS Code

**Build fails:**
- Clear build folders: `rm -rf dist dist-electron`
- Check for TypeScript errors: `tsc --noEmit`
- Ensure all dependencies are installed

## 📚 Next Steps

1. **Read the docs:**
   - [SETUP.md](./SETUP.md) - Detailed setup guide
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - How it all works
   - [README.md](./README.md) - Full documentation

2. **Explore examples:**
   - Look at `shared/routers/window.ts` for tRPC examples
   - Check `src/routes/index.tsx` for auth flow
   - Review `convex/auth.ts` for Better Auth setup

3. **Join communities:**
   - [Convex Discord](https://discord.gg/convex)
   - [tRPC Discord](https://discord.gg/trpc)
   - [Electron Discord](https://discord.gg/electron)

## 💡 Pro Tips

- Keep `npx convex dev` running for auto-deploy
- Use `console.log` in main process to debug
- Open DevTools with `Cmd/Ctrl + Shift + I`
- Check Convex dashboard for logs and data
- Use tRPC DevTools in browser for debugging

---

**Need help?** Check the full [SETUP.md](./SETUP.md) guide or open an issue!

