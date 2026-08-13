import { PrismaClient } from './src/generated/client';
const prisma = new PrismaClient();
async function main() {
  const post = await prisma.post.findFirst();
  console.log("Editing post:", post?.id);
  if (!post) return;
  try {
    const updated = await prisma.post.update({
      where: { id: post.id },
      data: {
          title: 'Updated title',
          // omit slug to see if that fails
          content: post.content,
          excerpt: post.excerpt,
          isFeatured: true,
          isPublished: true,
          isLocked: true,
          tags: {
              set: [], 
              connectOrCreate: []
          }
      },
    });
    console.log("Updated success", updated.isLocked);
    await prisma.post.update({ where: { id: post.id }, data: { isLocked: false, isFeatured: false }});
  } catch (err) {
    console.error("Save post error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
