/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Migration script to clean up raw HTML tags (e.g. <div>, <p>, <img>) from post excerpts in Neon DB.
 */
require('dotenv').config();
const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanExcerpt(text, maxLength = 150) {
  const plainText = stripHtml(text);
  if (!plainText) return '';
  if (plainText.length <= maxLength) return plainText;

  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const clean = lastSpace > maxLength * 0.7 ? truncated.substring(0, lastSpace) : truncated;
  return `${clean.trim()}...`;
}

async function cleanDatabaseExcerpts() {
  console.log('Scanning all posts for raw HTML in excerpts...');
  const posts = await prisma.post.findMany({
    select: { id: true, slug: true, title: true, excerpt: true, content: true },
  });

  let updatedCount = 0;

  for (const post of posts) {
    const rawExcerpt = post.excerpt || '';
    const cleaned = cleanExcerpt(rawExcerpt.includes('<') ? (rawExcerpt || post.content) : rawExcerpt, 150);

    if (rawExcerpt !== cleaned && rawExcerpt.includes('<')) {
      console.log(`Cleaning excerpt for: "${post.title}" (${post.slug})`);
      console.log(`  Before: ${rawExcerpt.substring(0, 60)}...`);
      console.log(`  After:  ${cleaned.substring(0, 60)}...`);

      await prisma.post.update({
        where: { id: post.id },
        data: { excerpt: cleaned },
      });
      updatedCount++;
    }
  }

  console.log(`Done! Cleaned ${updatedCount} post excerpts in Neon DB.`);
  await prisma.$disconnect();
}

cleanDatabaseExcerpts().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
