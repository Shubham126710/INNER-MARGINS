const { PrismaClient } = require('./src/generated/client/index.js');
const prisma = new PrismaClient();
async function main() {
  try {
    const p = await prisma.post.create({
      data: {
        title: 'Test Locked Post',
        slug: 'test-locked-post-' + Date.now(),
        content: 'test content',
        excerpt: 'test excerpt',
        isLocked: true,
        isFeatured: true,
        isPublished: true,
        readTime: '1 min read'
      }
    });
    console.log('Success!', p);
    await prisma.post.delete({ where: { id: p.id } });
  } catch (err) {
    console.error('Error creating post:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
