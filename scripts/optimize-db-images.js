/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * One-time optimization script to compress bloated Base64 images directly inside Neon DB.
 * Shrinks embedded PNG screenshots and cover photos so queries and backups are lightweight.
 */
const sharp = require('sharp');
const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function optimizeDatabaseImages() {
  console.log('Connecting to database and finding posts with Base64 images...');
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, content: true, coverImage: true }
  });

  let totalBefore = 0;
  let totalAfter = 0;
  let updatedPostsCount = 0;

  for (const p of posts) {
    let pBefore = Buffer.byteLength(p.content || '', 'utf8') + Buffer.byteLength(p.coverImage || '', 'utf8');
    let pAfter = pBefore;
    let needsUpdate = false;
    let newCoverImage = p.coverImage;
    let newContent = p.content;

    // 1. Optimize coverImage
    if (p.coverImage && p.coverImage.startsWith('data:image')) {
      const match = p.coverImage.match(/^data:image\/[^;]+;base64,(.+)$/);
      if (match) {
        const buf = Buffer.from(match[1], 'base64');
        if (buf.length > 50 * 1024) { // Only touch if > 50KB
          try {
            const comp = await sharp(buf)
              .resize({ width: 1200, withoutEnlargement: true })
              .jpeg({ quality: 80, mozjpeg: true })
              .toBuffer();

            if (comp.length < buf.length * 0.85) {
              const compDataUrl = 'data:image/jpeg;base64,' + comp.toString('base64');
              pAfter -= Buffer.byteLength(p.coverImage, 'utf8');
              pAfter += Buffer.byteLength(compDataUrl, 'utf8');
              newCoverImage = compDataUrl;
              needsUpdate = true;
              console.log(`[Cover Optimized] "${p.title}": ${(buf.length / 1024).toFixed(1)} KB -> ${(comp.length / 1024).toFixed(1)} KB`);
            }
          } catch (e) {
            console.error(`Failed to optimize cover for "${p.title}":`, e.message);
          }
        }
      }
    }

    // 2. Optimize content embedded images
    if (p.content && p.content.includes('data:image')) {
      const imgRegex = /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/g;
      let match;
      let contentWorking = p.content;
      let contentModified = false;

      while ((match = imgRegex.exec(p.content)) !== null) {
        const fullDataUrl = match[0];
        const base64Data = match[1];
        const buf = Buffer.from(base64Data, 'base64');

        if (buf.length > 50 * 1024) { // Only touch if > 50KB
          try {
            const comp = await sharp(buf)
              .resize({ width: 1200, withoutEnlargement: true })
              .jpeg({ quality: 80, mozjpeg: true })
              .toBuffer();

            if (comp.length < buf.length * 0.85) {
              const compDataUrl = 'data:image/jpeg;base64,' + comp.toString('base64');
              contentWorking = contentWorking.replace(fullDataUrl, compDataUrl);
              contentModified = true;
              console.log(`[Content Img Optimized] "${p.title}": ${(buf.length / 1024).toFixed(1)} KB -> ${(comp.length / 1024).toFixed(1)} KB`);
            }
          } catch (e) {
            console.error(`Failed to optimize content image in "${p.title}":`, e.message);
          }
        }
      }

      if (contentModified) {
        pAfter -= Buffer.byteLength(p.content, 'utf8');
        pAfter += Buffer.byteLength(contentWorking, 'utf8');
        newContent = contentWorking;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await prisma.post.update({
        where: { id: p.id },
        data: {
          coverImage: newCoverImage,
          content: newContent
        }
      });
      updatedPostsCount++;
    }

    totalBefore += pBefore;
    totalAfter += pAfter;
  }

  console.log('\n=========================================');
  console.log(`Updated posts:           ${updatedPostsCount}`);
  console.log(`Total Table Data Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Table Data After:  ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Net Space Saved:         ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);
  console.log('=========================================\n');
}

optimizeDatabaseImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
