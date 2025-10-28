# 🎉 Electron + Convex + Better Auth + tRPC Boilerplate

## What's Included

This boilerplate provides everything you need to build modern Electron desktop applications with:

✅ **Electron** - Cross-platform desktop apps  
✅ **Convex** - Real-time serverless backend  
✅ **Better Auth** - Modern authentication (Email OTP included)  
✅ **tRPC** - Type-safe IPC communication  
✅ **React 19** - Latest React features  
✅ **TanStack Router** - File-based routing  
✅ **Tailwind CSS v4** - Modern styling  
✅ **Radix UI** - Accessible components  
✅ **TypeScript** - Full type safety  
✅ **Biome** - Fast formatting & linting  

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](./SETUP.md)** - Detailed setup and configuration
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - How everything works together
- **[README.md](./README.md)** - Full project documentation

## 🚀 Quick Commands

```bash
# Install dependencies
pnpm install

# Start Convex backend
npx convex dev

# Start Electron app (in another terminal)
pnpm dev

# Build for production
pnpm build

# Format code
pnpm format

# Lint code
pnpm lint
```

## 📋 Before You Start

### 1. Update Project Info

Edit `package.json`:
```json
{
  "name": "your-app-name",
  "description": "Your app description",
  "author": {
    "name": "Your Name",
    "email": "your@email.com"
  }
}
```

### 2. Update Branding

- Change app name in `src/routes/index.tsx`
- Replace icons/logos
- Customize colors in `src/index.css`
- Update window settings in `electron/main.ts`

### 3. Set Up Authentication

For production, configure email sending in `convex/auth.ts`:

```typescript
emailOTP({
  async sendVerificationOTP({ email, otp, type }) {
    // Replace with your email service
    await yourEmailService.send({
      to: email,
      subject: "Your Login Code",
      html: `Your code is: ${otp}`,
    });
  },
}),
```

Popular options:
- [Resend](https://resend.com) (recommended)
- [SendGrid](https://sendgrid.com)
- [Postmark](https://postmarkapp.com)
- [AWS SES](https://aws.amazon.com/ses/)

## 🎯 What to Build

This boilerplate is perfect for:

- 💼 Productivity apps
- 📊 Dashboard applications  
- 🎮 Electron games with online features
- 🔐 Apps requiring authentication
- 💬 Real-time collaboration tools
- 📝 Note-taking applications
- 🎨 Creative tools
- 📁 File management apps
- 🔄 Sync applications

## 🏗️ Architecture Highlights

### Type-Safe IPC with tRPC

```typescript
// Define procedure in shared/routers/
export const myRouter = router({
  getData: publicProcedure.query(async () => {
    return { data: "example" };
  }),
});

// Use in renderer with full type safety
const { data } = trpc.myRouter.getData.useQuery();
```

### Real-Time Backend with Convex

```typescript
// Define function in convex/
export const messages = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

// Use in React - automatically updates in real-time
const messages = useQuery(api.messages.list);
```

### Built-in Authentication

- Email OTP authentication ready to use
- Session management handled
- Protected routes with auth guards
- Easy to extend with more auth methods

### Modern Development

- ⚡ Hot reload for instant feedback
- 🎨 Tailwind CSS for rapid styling
- 🧩 Pre-built UI components
- 📱 Responsive design ready
- 🌙 Dark mode built-in
- ♿ Accessible components from Radix UI

## 🔐 Security Features

- Context isolation enabled
- Secure IPC via tRPC
- Better Auth session management
- Environment variable protection
- HTTPS enforced in production

## 📦 What's Pre-configured

### UI Components
- Button, Input, Label
- Avatar, Card, Progress
- Drawer (mobile-friendly modal)
- Input OTP (for auth codes)
- Theme Provider (dark/light mode)

### Routes
- `/` - Login page with email OTP
- `/app` - Protected app route
- Easy to add more with file-based routing

### Convex
- Better Auth integration
- Database adapter configured
- HTTP endpoints for auth
- Auto-generated types

### Electron
- Window management
- tRPC IPC handler
- Preload script for security
- DevTools support

## 🎨 Customization

Everything is designed to be customized:

- **Colors**: Edit `src/index.css`
- **Components**: Modify or add in `src/components/`
- **Routes**: Add files to `src/routes/`
- **Backend**: Add functions to `convex/`
- **IPC**: Add routers to `shared/routers/`
- **Window**: Configure in `electron/main.ts`

## 🚢 Deployment

### Backend (Convex)
```bash
npx convex deploy
```

### Desktop App
```bash
# macOS
pnpm build -- --mac

# Windows
pnpm build -- --win

# Linux
pnpm build -- --linux
```

## 💡 Tips for Success

1. **Keep Convex running**: Always have `npx convex dev` running during development
2. **Use DevTools**: Press `Cmd/Ctrl + Shift + I` to debug
3. **Check Convex Dashboard**: Monitor functions and data
4. **Read the docs**: Each service has excellent documentation
5. **Join communities**: Discord servers are very helpful

## 🤝 Getting Help

- Read the documentation files in this repo
- Check the official docs:
  - [Convex Docs](https://docs.convex.dev)
  - [Better Auth Docs](https://better-auth.com/docs)
  - [tRPC Docs](https://trpc.io/docs)
  - [Electron Docs](https://electronjs.org/docs)
- Join Discord communities (links in README)

## 📝 License

MIT - Use this boilerplate for any project, personal or commercial!

---

**Ready to build something amazing? Start with [QUICKSTART.md](./QUICKSTART.md)!** 🚀

