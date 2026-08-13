# Inner Margins macOS App Integration

I have successfully packaged the Inner Margins Next.js application into a native macOS app using Electron and Electron Forge!

## What was done
1. **Next.js Standalone**: Configured `next.config.ts` to output a `standalone` production build.
2. **Electron Foundation**: Created the `electron/main.ts` entry point which transparently runs the standalone Next.js server locally and presents it in a native, chromeless macOS window that matches the lavender Inner Margins identity.
3. **App Icon**: Converted your `public/icon.png` into a native macOS `.icns` format for the application bundle.
4. **Build Tooling**: Added scripts in `package.json` and a custom build-step (`scripts/build-electron.js`) to bundle only the necessary assets and Prisma configuration into the Electron app.

## How it works

### Development
You can still use `npm run dev` to work on the web app.
If you want to test the app inside the native Electron window during development, run:
```bash
npm run electron:dev
```
*(Make sure the Next.js dev server is running!)*

### Production Build
To create a fully bundled macOS application, run:
```bash
npm run make
```

This will automatically build the Next.js production server, compile the Electron backend, bundle the necessary assets, and output an `.app` and `.dmg` file in the `out/` directory.

> [!TIP]
> The app is completely self-contained. It spins up its own internal Node.js server using your `.env` on a dynamic local port without the user needing to touch a terminal.
