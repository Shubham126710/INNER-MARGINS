const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');

if (!fs.existsSync(standaloneDir)) {
  console.error("Standalone directory not found. Please run 'npm run build' first.");
  process.exit(1);
}

// Copy public directory
const publicSrc = path.join(projectRoot, 'public');
const publicDest = path.join(standaloneDir, 'public');

if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
  console.log("Copied 'public' to standalone directory.");
}

// Copy .next/static directory
const staticSrc = path.join(projectRoot, '.next', 'static');
const nextDest = path.join(standaloneDir, '.next');
const staticDest = path.join(nextDest, 'static');

if (fs.existsSync(staticSrc)) {
  if (!fs.existsSync(nextDest)) {
    fs.mkdirSync(nextDest, { recursive: true });
  }
  fs.cpSync(staticSrc, staticDest, { recursive: true });
  console.log("Copied '.next/static' to standalone directory.");
}

// Ensure generated Prisma client is copied if it is not inside node_modules
const prismaClientSrc = path.join(projectRoot, 'src', 'generated', 'client');
const prismaClientDest = path.join(standaloneDir, 'src', 'generated', 'client');
if (fs.existsSync(prismaClientSrc)) {
  fs.cpSync(prismaClientSrc, prismaClientDest, { recursive: true });
  console.log("Copied Prisma client to standalone directory.");
}

// Also copy .env if exists to ensure production connects correctly
const envFile = path.join(projectRoot, '.env');
if (fs.existsSync(envFile)) {
  fs.copyFileSync(envFile, path.join(standaloneDir, '.env'));
  console.log("Copied '.env' to standalone directory.");
} else if (fs.existsSync(path.join(projectRoot, '.env.production'))) {
  fs.copyFileSync(path.join(projectRoot, '.env.production'), path.join(standaloneDir, '.env.production'));
  console.log("Copied '.env.production' to standalone directory.");
}

console.log("Electron build preparation completed successfully.");
