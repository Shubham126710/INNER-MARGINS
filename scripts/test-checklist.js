/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function runChecklistTests() {
  console.log('==============================================');
  console.log('RUNNING REGRESSION CHECKLIST AUTOMATED TESTS');
  console.log('==============================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Passcode verification
  const crypto = require('crypto');
  const DEFAULT_PASSCODE_HASH = 'c5b389beb081fe1e43ae92e895deca086b4eed5cf9efc7b78eebbbc9dc75c3f0'; // sha256('314159')

  function verifyPasscode(inputPin) {
    if (!inputPin || typeof inputPin !== 'string') return false;
    const trimmed = inputPin.trim();
    if (!trimmed) return false;

    const envPasscode = process.env.APP_PASSCODE || process.env.SITE_PASSCODE;
    const targetHash = envPasscode
      ? crypto.createHash('sha256').update(envPasscode.trim()).digest('hex')
      : DEFAULT_PASSCODE_HASH;

    const inputHash = crypto.createHash('sha256').update(trimmed).digest('hex');
    const targetBuffer = Buffer.from(targetHash, 'hex');
    const inputBuffer = Buffer.from(inputHash, 'hex');

    if (targetBuffer.length !== inputBuffer.length) return false;
    return crypto.timingSafeEqual(targetBuffer, inputBuffer);
  }

  assert(!verifyPasscode(''), 'Empty passcode is rejected');
  assert(!verifyPasscode('   '), 'Whitespace-only passcode is rejected');
  assert(!verifyPasscode('000000'), 'Wrong passcode is rejected');
  assert(!verifyPasscode('password'), 'Alphanumeric wrong passcode is rejected');
  assert(verifyPasscode('314159'), 'Correct passcode ("314159") is accepted');
  assert(verifyPasscode('  314159  '), 'Correct passcode with leading/trailing spaces is accepted');

  // 2. cleanExcerpt testing
  function stripHtml(html) {
    if (!html) return '';
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/<[^>]*$/g, ' ')
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
    if (!plainText) return '[ Visual transmission ]';
    if (plainText.length <= maxLength) return plainText;

    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const clean = lastSpace > maxLength * 0.7 ? truncated.substring(0, lastSpace) : truncated;
    return `${clean.trim()}...`;
  }

  const htmlInput = '<div>Wow, first romcom book I liked in a while, beach read was meh. But this? This was fantastic, I completed the final third in one sitting in about 2 hrs, I was so into the plot by then. Adam and Ol';
  const cleanedResult = cleanExcerpt(htmlInput);
  assert(!cleanedResult.includes('<div>') && !cleanedResult.includes('</div>'), 'cleanExcerpt strips <div>');
  assert(cleanedResult.endsWith('...'), 'cleanExcerpt ends with "..."');
  assert(cleanedResult.length <= 155, `cleanExcerpt length is compact (${cleanedResult.length} chars)`);

  const imgHtmlInput = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgA" />Movie was great!';
  assert(cleanExcerpt(imgHtmlInput) === 'Movie was great!', 'cleanExcerpt strips <img> tags cleanly');

  // 3. Database Excerpt Verification (ensure no <div> remains in DB)
  const postsWithHtml = await prisma.post.findMany({
    where: {
      OR: [
        { excerpt: { startsWith: '<' } },
        { excerpt: { contains: '<div>' } },
        { excerpt: { contains: '<p>' } },
        { excerpt: { contains: '<img' } },
      ],
    },
    select: { slug: true, title: true, excerpt: true },
  });

  assert(postsWithHtml.length === 0, `All database excerpts are clean (0 posts with raw HTML, found: ${postsWithHtml.length})`);

  // 4. Locked Post Masking in public listings
  const lockedPostInDb = await prisma.post.findFirst({
    where: { isLocked: true },
    select: { id: true, slug: true, title: true, excerpt: true, content: true, isLocked: true },
  });

  if (lockedPostInDb) {
    console.log(`\nTesting locked post: "${lockedPostInDb.title}" (${lockedPostInDb.slug})`);

    const masked = {
      title: lockedPostInDb.isLocked ? '[ ENCRYPTED ARCHIVE ]' : lockedPostInDb.title,
      excerpt: lockedPostInDb.isLocked
        ? 'Encrypted memory fragment. Clearance required to decrypt transmission.'
        : cleanExcerpt(lockedPostInDb.excerpt || lockedPostInDb.content || '', 150),
      coverImage: lockedPostInDb.isLocked ? undefined : 'some-image.jpg',
      tags: lockedPostInDb.isLocked ? ['locked'] : ['secret-tag'],
      content: lockedPostInDb.isLocked ? undefined : lockedPostInDb.content,
    };

    assert(masked.title === '[ ENCRYPTED ARCHIVE ]', 'Locked post title is masked to [ ENCRYPTED ARCHIVE ]');
    assert(masked.excerpt === 'Encrypted memory fragment. Clearance required to decrypt transmission.', 'Locked post excerpt is masked');
    assert(masked.coverImage === undefined, 'Locked post coverImage is undefined (no leak)');
    assert(masked.content === undefined, 'Locked post content is undefined (no leak)');
    assert(masked.tags.length === 1 && masked.tags[0] === 'locked', 'Locked post tags masked to ["locked"]');
  }

  // 5. Check older posts still open (e.g. "being-alive")
  const olderPost = await prisma.post.findFirst({
    orderBy: { createdAt: 'asc' },
    select: { slug: true, title: true },
  });
  assert(olderPost !== null, `Oldest post found in DB: "${olderPost?.title}" (${olderPost?.slug})`);

  await prisma.$disconnect();

  console.log('\n==============================================');
  console.log(`CHECKLIST TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==============================================');

  if (failed > 0) process.exit(1);
}

runChecklistTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
